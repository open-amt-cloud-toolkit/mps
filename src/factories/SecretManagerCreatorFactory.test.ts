/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { logger } from '../logging'
import VaultSecretManagerService from '../secrets/vault'
import { Environment } from '../utils/Environment'
import { SecretManagerCreatorFactory } from './SecretManagerCreatorFactory'

describe('', () => {
  let secretsCreator: SecretManagerCreatorFactory

  beforeEach(() => {
    jest.clearAllMocks()
    secretsCreator = new SecretManagerCreatorFactory()
    Environment.Config = {
      vault_address: 'http://localhost',
      secrets_path: 'secret/data/',
      secrets_provider: 'vault'
    } as any
  })

  it('should pass with given logger', async () => {
    const response = await secretsCreator.getSecretManager(logger)
    expect(response).toBeInstanceOf(VaultSecretManagerService)
  })

  it('should maintain an instance', async () => {
    const first = await secretsCreator.getSecretManager(logger)
    const second = await secretsCreator.getSecretManager(logger)
    expect(first).toEqual(second)
  })
})
