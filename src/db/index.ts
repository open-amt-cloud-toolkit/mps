/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
/*
  Code pattern used to make connections and queries.
  Pattern referred from https://node-postgres.com/guides/project-structure
*/
import { Pool, QueryResult } from 'pg'
import { logger as log } from '../utils/logger'

export class PostgresDb {
  pool: Pool

  constructor (connectionString: string) {
    this.pool = new Pool({
      connectionString: connectionString
    })
  }

  async query (text: string, params?: any): Promise<QueryResult> {
    const start = Date.now()
    const res = await this.pool.query(text, params)
    const duration = Date.now() - start
    log.verbose(`executed query: ${JSON.stringify({ text, duration, rows: res.rowCount })}`)
    return res
  }
}
