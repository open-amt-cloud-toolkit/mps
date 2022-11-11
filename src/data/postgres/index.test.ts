/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { QueryResult } from 'pg'
import PostgresDb, { POSTGRES_RESPONSE_CODES } from '.'
import { Environment } from '../../utils/Environment'
import { config } from '../../test/helper/config'

describe('Postgres', () => {
  let db: PostgresDb
  beforeEach(() => {
    jest.restoreAllMocks()
    Environment.Config = JSON.parse(JSON.stringify(config))
    Environment.Config.startup_retry_limit = 5
    Environment.Config.startup_max_backoff_millis = 50
    db = new PostgresDb(Environment.Config.connection_string)
  })

  test('should return result when query executes', async () => {
    const dbQuery = jest.spyOn(db, 'query')
    dbQuery.mockResolvedValueOnce({ rows: [0], command: 'SELECT', fields: null, rowCount: 0, oid: 0 })
    const result = await db.query('SELECT * FROM devices')
    expect(result).toEqual({ rows: [0], command: 'SELECT', fields: null, rowCount: 0, oid: 0 })
  })

  test('should return result when pool query executes', async () => {
    const qr: QueryResult = { rows: [0], command: 'SELECT', fields: null, rowCount: 0, oid: 0 }
    const dbQuery = jest.spyOn(db.pool, 'query').mockImplementation(async () => {
      return qr
    })
    const result = await db.query('SELECT * FROM devices', null)
    expect(result.rowCount).toBe(0)
    expect(dbQuery).toBeCalledWith('SELECT * FROM devices', null)
    expect(dbQuery).toHaveBeenCalled()
  })

  test('should get unknown error when status code is not known', () => {
    const result = POSTGRES_RESPONSE_CODES('28P00')
    expect(result).toBe('unknown error')
  })

  test('should get invalid password when status code is 28P01', () => {
    const result = POSTGRES_RESPONSE_CODES('28P01')
    expect(result).toBe('invalid_password')
  })

  test('should get null when status code is not given', () => {
    const result = POSTGRES_RESPONSE_CODES()
    expect(result).toBe('statusCode null')
  })

  test('should succeed waiting for startup', async () => {
    const qr: QueryResult = { rows: [0], command: 'SELECT', fields: null, rowCount: 0, oid: 0 }
    db.pool.query = jest.fn()
      .mockRejectedValueOnce(new Error('test error'))
      .mockRejectedValueOnce(255)
      .mockRejectedValueOnce({ code: 'ECONNREFUSED' })
      .mockRejectedValueOnce({ code: '08006' })
      .mockResolvedValue(qr)
    const dbQuery = jest.spyOn(db.pool, 'query')
    await db.waitForStartup()
    expect(dbQuery).toHaveBeenCalled()
  })

  test('should fail waiting for startup', async () => {
    db.pool.query = jest.fn().mockRejectedValue({ code: 'ECONNREFUSED' })
    let caughtOne = false
    try {
      await db.waitForStartup()
    } catch (e) {
      caughtOne = true
    }
    expect(caughtOne).toBeTruthy()
  })

  test('should be graceful after shutdown', async () => {
    const qr: QueryResult = { rows: [0], command: 'SELECT', fields: null, rowCount: 0, oid: 0 }
    db.pool.query = jest.fn().mockResolvedValue(qr)
    db.pool.end = jest.fn().mockResolvedValue(undefined)
    await db.shutdown()
    expect(db.pool).toBeNull()
    let caughtErr = null
    try {
      await db.waitForStartup()
    } catch (e) {
      caughtErr = e
    }
    expect(caughtErr).not.toBeNull()
    expect(caughtErr?.code).toEqual(PostgresDb.errPoolEndedCode)
    expect(caughtErr?.message).toEqual(PostgresDb.errPoolEndedMsg)
  })

  test('should pass checking transient error codes', () => {
    expect(db.shouldRetryOnErr(null)).toBeTruthy()
    expect(db.shouldRetryOnErr(3)).toBeTruthy()
    expect(db.shouldRetryOnErr('ABCDEF123')).toBeTruthy()
    expect(db.shouldRetryOnErr('57P05')).toBeTruthy()
    expect(db.shouldRetryOnErr('21000')).toBeFalsy()
    // our own generic error
    expect(db.shouldRetryOnErr(PostgresDb.errPoolEndedCode)).toBeFalsy()
  })
})
