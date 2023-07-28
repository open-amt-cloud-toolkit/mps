/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import * as indexFile from './index'
import * as svcMngr from './consul/serviceManager'
import * as exponentialBackoff from 'exponential-backoff'
import { logger } from './logging'
import VaultSecretManagerService from './secrets/vault'
import { Environment } from './utils/Environment'
import { type IDB } from './interfaces/IDb'
import { type ISecretManagerService } from './interfaces/ISecretManagerService'

describe('Index', () => {
  describe('loadConfig', () => {
    afterEach(() => {
      jest.clearAllMocks()
      jest.restoreAllMocks()
      jest.resetAllMocks()
    })
    let config

    beforeEach(() => {
      process.env.NODE_ENV = 'test'
      config = {
        common_name: 'localhost',
        port: 4433,
        country: 'US',
        company: 'NoCorp',
        listen_any: true,
        tls_offload: false,
        web_port: 3000,
        generate_certificates: true,
        web_admin_user: 'admin',
        web_admin_password: 'password',
        web_auth_enabled: true,
        vault_address: 'http://localhost:8200',
        vault_token: 'myroot',
        mqtt_address: '',
        secrets_path: 'secret/data/',
        cert_format: 'file',
        data_path: '../private/data.json',
        cert_path: '../private',
        jwt_secret: 'secret',
        jwt_issuer: '9EmRJTbIiIb4bIeSsmgcWIjrR6HyETqc',
        jwt_expiration: '1440',
        cors_origin: '*',
        cors_headers: '*',
        cors_methods: '*',
        db_provider: 'postgres',
        connection_string: 'postgresql://<USERNAME>:<PASSWORD>@localhost:5432/mpsdb?sslmode=no-verify',
        instance_name: 'localhost',
        mps_tls_config: {
          key: '../private/mpsserver-cert-private.key',
          cert: '../private/mpsserver-cert-public.crt',
          requestCert: true,
          rejectUnauthorized: false,
          minVersion: 'TLSv1',
          ciphers: null,
          secureOptions: ['SSL_OP_NO_SSLv2', 'SSL_OP_NO_SSLv3']
        },
        web_tls_config: {
          key: '../private/mpsserver-cert-private.key',
          cert: '../private/mpsserver-cert-public.crt',
          ca: ['../private/root-cert-public.crt'],
          secureOptions: [
            'SSL_OP_NO_SSLv2',
            'SSL_OP_NO_SSLv3',
            'SSL_OP_NO_COMPRESSION',
            'SSL_OP_CIPHER_SERVER_PREFERENCE',
            'SSL_OP_NO_TLSv1',
            'SSL_OP_NO_TLSv11'
          ]
        },
        consul_enabled: true,
        consul_host: 'localhost',
        consul_port: '8500',
        consul_key_prefix: 'MPS'
      }
      Environment.Config = config
    })
    it('Should exit setupServiceManager', async () => {
      const waitSpy = jest.spyOn(svcMngr, 'waitForServiceManager').mockImplementation(() => {
        throw new Error('Test error')
      })
      const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => code as never)
      await indexFile.setupServiceManager(config)
      expect(mockExit).toHaveBeenCalledWith(0)
      expect(waitSpy).toHaveBeenCalled()
    })
    it('should pass setupServiceManager', async () => {
      const waitSpy = jest.spyOn(svcMngr, 'waitForServiceManager').mockReturnValue(Promise.resolve())
      const prcSpy = jest.spyOn(svcMngr, 'processServiceConfigs').mockReturnValue(Promise.resolve(true))

      await indexFile.setupServiceManager(config)
      expect(waitSpy).toHaveBeenCalled()
      expect(prcSpy).toHaveBeenCalled()
    })

    it('should pass with config', () => {
      jest.spyOn(indexFile, 'main').mockResolvedValue(null)
      const result = indexFile.loadConfig(config)
      expect(result.web_tls_config).toEqual(config.web_tls_config)
    })

    it('Should fail with no jwt secret', () => {
      config.jwt_secret = ''
      const mockExit = jest.spyOn(process, 'exit')
        .mockImplementation((number) => { throw new Error('process.exit: ' + number) })
      expect(() => {
        indexFile.loadConfig(config)
      }).toThrow()
      expect(mockExit).toHaveBeenCalledWith(1)
    })
    it('Should fail with no username or password if web_auth_enabled is set to true', () => {
      config.web_auth_enabled = true
      config.web_admin_user = 'admin'
      config.web_admin_password = ''
      config.jwt_secret = 'secret'
      const mockExit = jest.spyOn(process, 'exit')
        .mockImplementation((number) => { throw new Error('process.exit: ' + number) })
      expect(() => {
        indexFile.loadConfig(config)
      }).toThrow()
      expect(mockExit).toHaveBeenCalledWith(1)
    })
  })

  describe('setupSignalHandling', () => {
    let secretManagerService: VaultSecretManagerService = null
    let config

    beforeEach(() => {
      jest.clearAllMocks()
      config = {
        common_name: 'localhost',
        port: 4433,
        country: 'US',
        company: 'NoCorp',
        listen_any: true,
        tls_offload: false,
        web_port: 3000,
        generate_certificates: false,
        web_admin_user: 'admin',
        web_admin_password: 'password',
        web_auth_enabled: true,
        vault_address: 'http://localhost:8200',
        vault_token: 'myroot',
        mqtt_address: '',
        secrets_path: 'secret/data/',
        cert_format: 'raw',
        data_path: '../private/data.json',
        cert_path: '../private',
        jwt_secret: 'secret',
        jwt_issuer: '9EmRJTbIiIb4bIeSsmgcWIjrR6HyETqc',
        jwt_expiration: '1440',
        cors_origin: '*',
        cors_headers: '*',
        cors_methods: '*',
        db_provider: 'postgres',
        connection_string: '',
        instance_name: 'localhost',
        mps_tls_config: {
          key: '../private/mpsserver-cert-private.key',
          cert: '../private/mpsserver-cert-public.crt',
          requestCert: true,
          rejectUnauthorized: false,
          minVersion: 'TLSv1',
          ciphers: null,
          secureOptions: ['SSL_OP_NO_SSLv2', 'SSL_OP_NO_SSLv3']
        },
        web_tls_config: {
          key: '../private/mpsserver-cert-private.key',
          cert: '../private/mpsserver-cert-public.crt',
          ca: ['../private/root-cert-public.crt'],
          secureOptions: [
            'SSL_OP_NO_SSLv2',
            'SSL_OP_NO_SSLv3',
            'SSL_OP_NO_COMPRESSION',
            'SSL_OP_CIPHER_SERVER_PREFERENCE',
            'SSL_OP_NO_TLSv1',
            'SSL_OP_NO_TLSv11'
          ]
        }
      }
      Environment.Config = config
      secretManagerService = new VaultSecretManagerService(logger)
      jest.spyOn(secretManagerService.gotClient, 'get').mockImplementation(() => ({
        json: jest.fn(() => null)
      } as any))
    })
    it('should pass with config', async () => {
      const result = await indexFile.loadCertificates(secretManagerService)
      expect(result.mps_tls_config.requestCert).toEqual(true)
    })
  })

  it('should wait for db', async () => {
    const backOffSpy = jest.spyOn(exponentialBackoff, 'backOff')
    let shouldBeOk = false
    const dbMock: IDB = {
      query: jest.fn(() => {
        if (shouldBeOk) return null
        shouldBeOk = true
        throw new Error('error')
      })
    } as any
    await indexFile.waitForDB(dbMock)
    expect(backOffSpy).toHaveBeenCalled()
  })

  it('should wait for secret provider', async () => {
    const backOffSpy = jest.spyOn(exponentialBackoff, 'backOff')
    let shouldBeOk = false
    const secretMock: ISecretManagerService = {
      health: jest.fn(() => {
        if (shouldBeOk) return null
        shouldBeOk = true
        throw new Error('error')
      })
    } as any
    await indexFile.waitForSecretProvider(secretMock)
    expect(backOffSpy).toHaveBeenCalled()
  })
})
