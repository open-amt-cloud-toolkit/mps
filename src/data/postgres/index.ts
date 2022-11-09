/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

/*
  Code pattern used to make connections and queries.
  Pattern referred from https://node-postgres.com/guides/project-structure
*/
import { Pool, QueryResult } from 'pg'
import { IDB } from '../../interfaces/IDb'
import { IDeviceTable } from '../../interfaces/IDeviceTable'
import { logger, messages } from '../../logging'
import { DeviceTable } from './tables/device'

export class PostgresDb implements IDB {
  pool: Pool
  devices: IDeviceTable
  constructor (connectionString: string) {
    this.pool = new Pool({
      connectionString: connectionString
    })
    this.devices = new DeviceTable(this)
  }

  async query<T> (text: string, params?: any): Promise<QueryResult<T>> {
    const start = Date.now()
    const res = await this.pool.query(text, params)
    const duration = Date.now() - start
    logger.verbose(`${messages.EXECUTED_QUERY}: ${JSON.stringify({ text, duration, rows: res.rowCount })}`)
    return res
  }

  async waitForStartup (): Promise<any> {
    try {
      await this.pool.query('SELECT NOW()')
    } catch (err) {
      if (this.isErrCodeTransient(err.code)) {
        logger.info(`should have repeated transient error: ${err.code}`)
      } else {
        logger.info(`got a postgresql error: ${err.code}`)
      }
      throw new Error(err.message || err)
    }
  }

  // supports retry logic which is why null and non-postgresql codes retur true
  isErrCodeTransient (errCode: any): boolean {
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
