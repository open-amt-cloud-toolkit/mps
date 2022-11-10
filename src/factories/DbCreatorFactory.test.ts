/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Environment } from '../utils/Environment'
import { DbCreatorFactory } from './DbCreatorFactory'
import { config } from '../test/helper/config'
import { IDB } from '../interfaces/IDb'

it('should pass with default test configuration', async () => {
  Environment.Config = config
  const factory = new DbCreatorFactory()
  const db1 = await factory.getDb()
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
