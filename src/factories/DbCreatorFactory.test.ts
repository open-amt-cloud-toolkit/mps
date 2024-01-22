/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Environment } from '../utils/Environment.js'
import { DbCreatorFactory } from './DbCreatorFactory.js'
import { config } from '../test/helper/config.js'
import { type IDB } from '../interfaces/IDb.js'

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
  })
})
