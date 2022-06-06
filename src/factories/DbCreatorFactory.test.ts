/*********************************************************************
* Copyright (c) Intel Corporation
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import PostgresDb from '../data/postgres'
import { Environment } from '../utils/Environment'
import { DbCreatorFactory } from './DbCreatorFactory'

describe('', () => {
  let dbCreator: DbCreatorFactory
  beforeEach(() => {
    jest.clearAllMocks()
    dbCreator = new DbCreatorFactory()
    Environment.Config = {
      db_provider: 'postgres',
      connection_string: ''
    } as any
  })
  it('should pass with default connection string', async () => {
    Environment.Config.connection_string = 'postgresql://<USERNAME>:<PASSWORD>@localhost:5432/mpsdb?sslmode=no-verify'
    DbCreatorFactory.instance = null
    const response = await dbCreator.getDb()
    const provider = await import(`../data/${Environment.Config.db_provider}`)
    // eslint-disable-next-line new-cap
    const expected = new provider.default(Environment.Config.connection_string)
    expect(typeof response).toEqual(typeof expected)
  })
  it('should pass returning an instance of IDB', async () => {
    Environment.Config.connection_string = 'postgresql://<USERNAME>:<PASSWORD>@localhost:5432/mpsdb?sslmode=no-verify'
    DbCreatorFactory.instance = new PostgresDb(Environment.Config.connection_string)
    const response = await dbCreator.getDb()
    expect(typeof response).toEqual(typeof DbCreatorFactory.instance)
  })
})
