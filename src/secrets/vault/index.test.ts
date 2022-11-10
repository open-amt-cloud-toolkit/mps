/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { VaultSecretManagerService } from '.'
import { logger } from '../../logging'
import { config } from '../../test/helper/config'
import { Environment } from '../../utils/Environment'

let secretManagerService: VaultSecretManagerService = null
Environment.Config = config
let gotSpy: jest.SpyInstance
const secretPath = '4c4c4544-004b-4210-8033-b6c04f504633'
const secretCreds = {
  data: {
    data: {
      AMT_PASSWORD: 'P@ssw0rd',
      MEBX_PASSWORD: 'Intel@123',
      MPS_PASSWORD: 'lLJPJNtU2$8FZTUy'
    }
  }
}

const secretCert = {
  data: {
    mps_tls_config: {
      cert: '-----BEGIN CERTIFICATE-----\r\ncert\r\n-----END CERTIFICATE-----\r\n',
      key: '-----BEGIN RSA PRIVATE KEY-----\r\nkey\r\n-----END RSA PRIVATE KEY-----\r\n',
      minVersion: 'TLSv1',
      rejectUnauthorized: false,
      requestCert: true
    },
    root_key: '-----BEGIN RSA PRIVATE KEY-----\r\nrootkey\r\n-----END RSA PRIVATE KEY-----\r\n',
    web_tls_config: {
      ca: '-----BEGIN CERTIFICATE-----\r\nca\r\n-----END CERTIFICATE-----\r\n',
      cert: '-----BEGIN CERTIFICATE-----\r\ncert\r\n-----END CERTIFICATE-----\r\n',
      key: '-----BEGIN RSA PRIVATE KEY-----\r\nkey\r\n-----END RSA PRIVATE KEY-----\r\n'
    }
  }
}

beforeEach(() => {
  secretManagerService = new VaultSecretManagerService(logger)
  gotSpy = jest.spyOn(secretManagerService.gotClient, 'get').mockImplementation(() => {
    return {
      json: jest.fn(() => {
        return secretCreds
      })
    } as any
  })
})

afterEach(() => {
  jest.clearAllMocks()
})

test('should get a secret for specific given key of a path', async () => {
  const result = await secretManagerService.getSecretFromKey(secretPath, 'AMT_PASSWORD')
  expect(gotSpy).toHaveBeenCalledWith(secretPath)
  expect(result).toBe('P@ssw0rd')
})

test('should get null, if the key does not exists in the path', async () => {
  const result = await secretManagerService.getSecretFromKey(secretPath, 'AMT_PASSWORD1')
  expect(result).toBe(null)
  expect(gotSpy).toHaveBeenCalledWith(secretPath)
})

test('should get null, if path does not exist', async () => {
  const gotFailSpy = jest.spyOn(secretManagerService.gotClient, 'get').mockResolvedValue({
    json: jest.fn(async () => await Promise.reject(new Error('Not Found')))
  })
  const result = await secretManagerService.getSecretFromKey(secretPath, 'AMT_PASSWORD')
  expect(result).toBe(null)
  expect(gotFailSpy).toHaveBeenCalledWith(secretPath)
})

test('should get a secret from a specific given path', async () => {
  const result = await secretManagerService.getSecretAtPath(secretPath)
  expect(result).toEqual(secretCreds.data)
  expect(gotSpy).toHaveBeenCalledWith(secretPath)
})

test('should throw an exception and return null if given path does not exist', async () => {
  const gotFailSpy = jest.spyOn(secretManagerService.gotClient, 'get').mockResolvedValue({
    json: jest.fn(async () => await Promise.reject(new Error('Not Found')))
  })
  const result = await secretManagerService.getSecretAtPath('does/not/exist')
  expect(result).toEqual(null)
  expect(gotFailSpy).toHaveBeenCalledWith('does/not/exist')
})

test('should delete a a secrete', async () => {
  const msg = { message: 'success' }
  jest.spyOn(secretManagerService.gotClient, 'delete').mockImplementation(() => {
    return {
      json: jest.fn(() => {
        return msg
      })
    } as any
  })
  const result = await secretManagerService.deleteSecretAtPath('does/not/matter')
  expect(result).toEqual(undefined)
})

test('should create a secret', async () => {
  const gotPostSpy = jest.spyOn(secretManagerService.gotClient, 'post').mockResolvedValue(null)
  const result = await secretManagerService.writeSecretWithObject('test', secretCert)
  expect(result).toBe(true)
  expect(gotPostSpy).toHaveBeenCalledWith('test', { json: secretCert })
})

test('should return false if the path does not exist', async () => {
  const gotFailSpy = jest.spyOn(secretManagerService.gotClient, 'post').mockRejectedValue('')
  const result = await secretManagerService.writeSecretWithObject('does/not/exist', secretCert)
  expect(result).toBe(false)
  expect(gotFailSpy).toHaveBeenCalledWith('does/not/exist', { json: secretCert })
})

test('should get AMT credentials for a specific device', async () => {
  const data = ['admin', 'P@ssw0rd']
  const secretAtPathSpy = jest.spyOn(secretManagerService, 'getSecretAtPath').mockResolvedValue(secretCreds.data)
  const result = await secretManagerService.getAMTCredentials(secretPath)
  expect(result).toEqual(data)
  expect(secretAtPathSpy).toHaveBeenCalledWith(`devices/${secretPath}`)
})

test('should return null if AMT credentials for a specific device does not exists', async () => {
  const secretAtPathSpy = jest.spyOn(secretManagerService, 'getSecretAtPath').mockResolvedValue(null)
  const result = await secretManagerService.getAMTCredentials(secretPath)
  expect(result).toEqual(null)
  expect(secretAtPathSpy).toHaveBeenCalledWith(`devices/${secretPath}`)
})

test('should get MPS certs', async () => {
  const secretAtPathSpy = jest.spyOn(secretManagerService, 'getSecretAtPath').mockResolvedValue(secretCert)
  const result = await secretManagerService.getMPSCerts()
  expect(result).toEqual(secretCert.data)
  expect(secretAtPathSpy).toHaveBeenCalledWith('MPSCerts')
})

test('should return null if MPS certs does not exists', async () => {
  const secretAtPathSpy = jest.spyOn(secretManagerService, 'getSecretAtPath').mockResolvedValue(null)
  const result = await secretManagerService.getMPSCerts()
  expect(result).toEqual(null)
  expect(secretAtPathSpy).toHaveBeenCalledWith('MPSCerts')
})

test('should get health of vault', async () => {
  const data = {
    initialized: true,
    sealed: false,
    standby: false,
    performance_standby: false,
    replication_performance_mode: 'disabled',
    replication_dr_mode: 'disabled',
    server_time_utc: 1638201913,
    version: '1.8.5',
    cluster_name: 'vault-cluster-426a5cd4',
    cluster_id: '3f02d0f2-4048-cdcd-7e4d-7d2905c52995'
  }
  const gothealthSpy = jest.spyOn(secretManagerService.gotClient, 'get').mockImplementation(() => {
    return {
      json: jest.fn(() => {
        return data
      })
    } as any
  })
  const result = await secretManagerService.health()
  expect(result).toEqual(data)
  expect(gothealthSpy).toHaveBeenCalledWith('sys/health', { prefixUrl: `${Environment.Config.vault_address}/v1/` })
})

test('should succeed waiting for startup', async () => {
  const data = {
    accessor: '8609694a-cdbc-db9b-d345-e782dbb562ed',
    creation_time: 1523979354,
    creation_ttl: 2764800,
    display_name: 'ldap2-tesla',
    entity_id: '7d2e3179-f69b-450c-7179-ac8ee8bd8ca9',
    expire_time: '2018-05-19T11:35:54.466476215-04:00',
    explicit_max_ttl: 0,
    id: 'cf64a70f-3a12-3f6c-791d-6cef6d390eed',
    identity_policies: ['dev-group-policy'],
    issue_time: '2018-04-17T11:35:54.466476078-04:00',
    meta: {
      username: 'tesla'
    },
    num_uses: 0,
    orphan: true,
    path: 'auth/ldap2/login/tesla',
    policies: ['default', 'testgroup2-policy'],
    renewable: true,
    ttl: 2764790
  }
  jest.spyOn(secretManagerService.gotClient, 'get').mockImplementation(() => {
    return {
      json: jest.fn(() => {
        return data
      })
    } as any
  })
  const result = await secretManagerService.waitForStartup()
  expect(result).toEqual(data)
})
