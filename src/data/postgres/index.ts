/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

/*
  Code pattern used to make connections and queries.
  Pattern referred from https://node-postgres.com/guides/project-structure
*/
import pg from 'pg'
import { type IDB } from '../../interfaces/IDb.js'
import { type IDeviceTable } from '../../interfaces/IDeviceTable.js'
import { logger, messages } from '../../logging/index.js'
import { DeviceTable } from './tables/device.js'

export class PostgresDb implements IDB {
  pool: pg.Pool
  devices: IDeviceTable
  constructor(connectionString: string) {
    this.pool = new pg.Pool({
      connectionString
    })
    this.devices = new DeviceTable(this)
  }

  async query<T>(text: string, params?: any): Promise<pg.QueryResult<T>> {
    const start = Date.now()
    const res = await this.pool.query(text, params)
    const duration = Date.now() - start
    logger.verbose(`${messages.EXECUTED_QUERY}: ${JSON.stringify({ text, duration, rows: res.rowCount })}`)
    return res
  }
}
export default PostgresDb

export const POSTGRES_RESPONSE_CODES = (statusCode: any = null): string => {
  let vaultError: string
  if (statusCode != null) {
    switch (statusCode) {
      case '28P01':
        vaultError = 'invalid_password'
        break
      default:
        vaultError = 'unknown error'
        break
    }
  } else {
    vaultError = 'statusCode null'
  }

  return vaultError
}
