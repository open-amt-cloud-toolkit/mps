/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
/*
  Code pattern used to make connections and queries.
  Pattern referred from https://node-postgres.com/guides/project-structure
*/
import { Pool, QueryResult } from 'pg'
import { IDB } from '../../interfaces/IDb'
import { IDeviceTable } from '../../interfaces/IDeviceTable'
import { logger as log } from '../../utils/logger'
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
    log.verbose(`executed query: ${JSON.stringify({ text, duration, rows: res.rowCount })}`)
    return res
  }
}
export default PostgresDb
