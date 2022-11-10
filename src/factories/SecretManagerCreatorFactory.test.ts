/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { logger } from '../logging'
import { Environment } from '../utils/Environment'
import { SecretManagerCreatorFactory } from './SecretManagerCreatorFactory'
import { config } from '../test/helper/config'
import { ILogger } from '../interfaces/ILogger'
import { ISecretManagerService } from '../interfaces/ISecretManagerService'

it('should pass with default test configuration', async () => {
  Environment.Config = config
  const factory = new SecretManagerCreatorFactory()
  const mgr1 = await factory.getSecretManager(logger)
  expect(mgr1).not.toBeNull()
  const mgr2 = await factory.getSecretManager(logger)
  expect(mgr2).not.toBeNull()
  const { default: Provider }: { default: new (logger: ILogger) => ISecretManagerService } =
        await import(`../secrets/${Environment.Config.secrets_provider}`)
  const mgr3 = new Provider(logger)
  expect(mgr3).not.toBeNull()
  expect(mgr1).toEqual(mgr2)
  expect(mgr1).not.toEqual(mgr3)
})
