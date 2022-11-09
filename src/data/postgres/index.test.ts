/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { QueryResult } from 'pg'
import PostgresDb, { POSTGRES_RESPONSE_CODES } from '.'
import exp from 'constants'

const db: PostgresDb = new PostgresDb('postgresql://postgresadmin:admin123@localhost:5432/mpsdb?sslmode=no-verify')
describe('Postgres', () => {
  afterEach(() => {
    jest.clearAllMocks()
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
    const dbQuery = jest.spyOn(db.pool, 'query').mockImplementation(async () => {
      return qr
    })
    await db.waitForStartup()
    expect(dbQuery).toBeCalledWith('SELECT NOW()')
    expect(dbQuery).toHaveBeenCalled()
  })

  test('should fail waiting for startup', async () => {
    jest.spyOn(db.pool, 'query').mockImplementation(() => {
      const err: any = {
        code: '08006',
        message: 'connection_failure'
      }
      throw err
    })
    await expect(db.waitForStartup())
      .rejects
      .toThrow()
  })

  test('should pass checking transient error codes', () => {
    expect(db.isErrCodeTransient(null)).toBeTruthy()
    expect(db.isErrCodeTransient(3)).toBeTruthy()
    expect(db.isErrCodeTransient('ABCDEF123')).toBeTruthy()
    expect(db.isErrCodeTransient('57P05')).toBeTruthy()
    expect(db.isErrCodeTransient('21000')).toBeFalsy()
  })
})
