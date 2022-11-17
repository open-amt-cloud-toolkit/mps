/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Environment } from '../utils/Environment'
import { DbCreatorFactory } from './DbCreatorFactory'
import { config } from '../test/helper/config'
import { IDB } from '../interfaces/IDb'
import PostgresDb from '../data/postgres'
import { DatabaseError } from 'pg'

describe('DB Creator Factory', () => {
  it('should pass with default test configuration', async () => {
    Environment.Config = config

    // test singleton pattern with IDB instance on the factory
    let factory = new DbCreatorFactory()
    const db1 = await factory.getDb()
    factory = new DbCreatorFactory()
    expect(db1).not.toBeNull()
    const db2 = await factory.getDb()
    expect(db2).not.toBeNull()
    const { default: Provider }: { default: new () => IDB } =
        await import(`../data/${Environment.Config.db_provider}`)
    const db3 = new Provider()
    expect(db3).not.toBeNull()

    expect(db1).toEqual(db2)
    expect(db1).not.toEqual(db3)

    // since using a singleton pattern,
    // run the shutdown test in the same test context
    jest.spyOn(db1, 'query').mockResolvedValue({})
    await DbCreatorFactory.shutdown()
    jest.spyOn(db1, 'query').mockRejectedValue(() => {
      const e = new DatabaseError(PostgresDb.errPoolEndedMsg, 0, 'error')
      e.code = PostgresDb.errPoolEndedCode
      return e
    })
    jest.restoreAllMocks()
    await expect(db1.query('SELECT 1'))
      .rejects
      .toThrow()
    const db4 = await factory.getDb()
    expect(db4).not.toBeNull()
    expect(db1).not.toEqual(db4)
  })
})
