/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import * as indexFile from './index'
import { logger } from './logging'
import VaultSecretManagerService from './secrets/vault'
import { Environment } from './utils/Environment'
import { SecretManagerCreatorFactory } from './factories/SecretManagerCreatorFactory'
import { DbCreatorFactory } from './factories/DbCreatorFactory'
import { config } from './test/helper/config'
import { MqttProvider } from './utils/MqttProvider'

describe('Index', () => {
  let testCfg
  let mockExit
  beforeEach(() => {
    process.env.NODE_ENV = 'test'
    testCfg = JSON.parse(JSON.stringify(config))
    mockExit = jest.spyOn(process, 'exit')
      .mockImplementation((number) => {
        throw new Error('process.exit: ' + number)
      })
  })
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
    jest.resetAllMocks()
  })
  describe('validateConfig', () => {
    it('should pass with config', () => {
      testCfg.web_auth_enabled = true
      testCfg.web_admin_user = 'test-web-admin-user'
      testCfg.web_admin_password = 'test-web-admin-password'
      const result = indexFile.validateConfig(testCfg)
      expect(result.web_tls_config).toEqual(testCfg.web_tls_config)
    })
    it('Should fail with no jwt secret', () => {
      testCfg.web_auth_enabled = true
      testCfg.web_admin_user = 'test-web-admin-user'
      testCfg.web_admin_password = 'test-web-admin-password'
      testCfg.jwt_secret = ''
      expect(() => {
        indexFile.validateConfig(testCfg)
      }).toThrow()
      expect(mockExit).toHaveBeenCalledWith(1)
    })
    it('Should fail with no username or password if web_auth_enabled is set to true', () => {
      testCfg.web_auth_enabled = true
      testCfg.web_admin_user = 'admin'
      testCfg.web_admin_password = ''
      testCfg.jwt_secret = 'secret'
      expect(() => {
        indexFile.validateConfig(testCfg)
      }).toThrow()
      expect(mockExit).toHaveBeenCalledWith(1)
    })
  })

  describe('loadCertificates', () => {
    let secretManagerService: VaultSecretManagerService = null
    beforeEach(() => {
      Environment.Config = testCfg
      secretManagerService = new VaultSecretManagerService(logger)
      jest.spyOn(secretManagerService.gotClient, 'get').mockImplementation(() => {
        return {
          json: jest.fn(() => {
            return null
          })
        } as any
      })
    })
    it('should pass with mps_tls_config.requestCert', async () => {
      const result = await indexFile.loadCertificates(secretManagerService)
      expect(result.mps_tls_config.requestCert).toEqual(true)
    })
  })

  describe('initializeDB', () => {
    let db
    beforeEach(async () => {
      testCfg.startup_retry_limit = 5
      testCfg.startup_backoff_limit = 30
      Environment.Config = testCfg
      const factory = new DbCreatorFactory()
      db = await factory.getDb()
    })
    it('should succeed', async () => {
      // for testing, just returning without any errors is all that is needed
      db.pool.query = jest.fn().mockResolvedValue({
        rows: [0],
        command: 'SELECT',
        fields: null,
        rowCount: 0,
        oid: 0
      })
      const returned = await indexFile.initializeDB()
      expect(returned).not.toBeNull()
    })
    it('should exit on error', async () => {
      const mockExit = jest.spyOn(process, 'exit')
      mockExit.mockImplementation((number) => {
        throw new Error('process.exit: ' + number)
      })
      db.pool.query = jest.fn().mockRejectedValue({ code: 'ECONNREFUSED' })
      await expect(indexFile.initializeDB())
        .rejects
        .toThrow(/process.exit/)
      expect(mockExit).toHaveBeenCalledWith(1)
    })
  })

  describe('initializeSecrets', () => {
    let vault
    beforeEach(async () => {
      testCfg.startup_retry_limit = 5
      testCfg.startup_backoff_limit = 30
      Environment.Config = testCfg
      vault = await new SecretManagerCreatorFactory().getSecretManager(logger) as VaultSecretManagerService
    })
    it('should succeed', async () => {
      // for testing, just returning without any errors is all
      jest.spyOn(vault.gotClient, 'get').mockImplementation(() => {
        return {
          json: jest.fn(() => {
            return {}
          })
        } as any
      })
      const returned = await indexFile.initializeSecrets()
      expect(returned).not.toBeNull()
    })
    it('should exit on error', async () => {
      const mockExit = jest.spyOn(process, 'exit').mockImplementation((number) => {
        throw new Error('process.exit: ' + number)
      })
      jest.spyOn(vault.gotClient, 'get').mockImplementation(() => {
        throw new Error('failed connecting')
      })
      await expect(indexFile.initializeSecrets())
        .rejects
        .toThrow(/process.exit/)
      expect(mockExit).toHaveBeenCalledWith(1)
    })
  })

  describe('initializeMqtt', () => {
    it('should pass', () => {
      Environment.Config = testCfg
      const mqttProvider = indexFile.initializeMqtt()
      expect(mqttProvider).not.toBeNull()
    })
  })

  describe('shutdown', () => {
    it('should shutdown using process exit', async () => {
      jest.useFakeTimers()
      const mockExit = jest.spyOn(process, 'exit').mockImplementation()
      jest.spyOn(DbCreatorFactory, 'shutdown').mockImplementation(async () => await Promise.resolve())
      jest.spyOn(MqttProvider, 'endBroker').mockImplementation(async () => await Promise.resolve())
      await indexFile.shutdown('SIGINT')
      jest.runOnlyPendingTimers()
      expect(mockExit).toHaveBeenCalled()
    })
  })
})
