/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

/*
  Code pattern used to make connections and queries.
  Pattern referred from https://node-postgres.com/guides/project-structure
*/
import { DatabaseError, Pool, QueryResult } from 'pg'
import { IDB } from '../../interfaces/IDb'
import { IDeviceTable } from '../../interfaces/IDeviceTable'
import { logger, messages } from '../../logging'
import { DeviceTable } from './tables/device'
import { backOff } from 'exponential-backoff'
import { Environment } from '../../utils/Environment'

export class PostgresDb implements IDB {
  static readonly errPoolEndedMsg = 'db connection pool has ended'
  static readonly errPoolEndedCode = 'XXXXX'
  pool: Pool
  devices: IDeviceTable
  constructor (connectionString: string) {
    this.pool = new Pool({
      connectionString: connectionString
    })
    this.pool.on('error', (err) => {
      logger.error('An idle db client has experienced an error', err.stack)
    })
    this.devices = new DeviceTable(this)
  }

  async query<T> (text: string, params?: any): Promise<QueryResult<T>> {
    if (this.pool === null) {
      const e = new DatabaseError(PostgresDb.errPoolEndedMsg, 0, 'error')
      e.code = PostgresDb.errPoolEndedCode
      throw e
    }
    const start = Date.now()
    const res = await this.pool.query(text, params)
    const duration = Date.now() - start
    logger.verbose(`${messages.EXECUTED_QUERY}: ${JSON.stringify({ text, duration, rows: res.rowCount })}`)
    return res
  }

  async waitForStartup (): Promise<any> {
    await backOff(async () => await this.query('SELECT 1'), {
      maxDelay: Environment.Config.startup_max_backoff_millis || (1000 * 60),
      numOfAttempts: Environment.Config.startup_retry_limit || 40,
      retry: (e: any, attemptNumber: number) => {
        logger.verbose(`PostgresDb wait for startup[${attemptNumber}] ${e.code || e.message || e}`)
        return this.shouldRetryOnErr(e.code)
      }
    })
  }

  async shutdown (): Promise<void> {
    if (this.pool != null) {
      await this.devices.clearInstanceStatus(Environment.Config.instance_name)
      await this.pool.end()
      this.pool = null
    }
  }

  // supports retry logic which is why null and non-postgresql codes retur true
  shouldRetryOnErr (errCode: any): boolean {
    if (errCode === null) { return true }
    if (typeof errCode !== 'string' && !(errCode instanceof String)) { return true }
    if (errCode.length !== 5) { return true }
    switch (errCode) {
      case '08000': // connection_exception
      case '08003': // connection_does_not_exist
      case '08006': // connection_failure
      case '08001': // sqlclient_unable_to_establish_sqlconnection
      case '08004': // sqlserver_rejected_establishment_of_sqlconnection
      case '08007': // transaction_resolution_unknown
      case '08P01': // protocol_violation
      case '57000': // operator_intervention
      case '57014': // query_canceled
      case '57P01': // admin_shutdown
      case '57P02': // crash_shutdown
      case '57P03': // cannot_connect_now
      case '57P04': // database_dropped
      case '57P05': // idle_session_timeout
        return true
      case PostgresDb.errPoolEndedCode:
      default:
        return false
    }
  }
}
export default PostgresDb

export const POSTGRES_RESPONSE_CODES = (statusCode: any = null): string => {
  let errMsg: string
  if (statusCode != null) {
    switch (statusCode) {
      case '28P01':
        errMsg = 'invalid_password'
        break
      default:
        errMsg = 'unknown error'
        break
    }
  } else {
    errMsg = 'statusCode null'
  }

  return errMsg
}
