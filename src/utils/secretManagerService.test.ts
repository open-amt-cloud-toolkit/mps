import { SecretManagerService } from './SecretManagerService'
import { logger as log } from './logger'
import { config } from '../test/helper/config'
import NodeVault from 'node-vault'
import { Environment } from './Environment'

let secretManagerService: SecretManagerService = null
Environment.Config = config
beforeEach(() => {
  const options: NodeVault.VaultOptions = {
    apiVersion: 'v1', // default
    endpoint: config.vault_address, // default
    token: config.vault_token // optional client token; can be fetched after valid initialization of the server
  }
  secretManagerService = new SecretManagerService(log, NodeVault(options))
})

afterEach(() => {
  jest.clearAllMocks()
})

test('should get a secret for specific given key of a path', async () => {
  const secretManagerService: SecretManagerService = new SecretManagerService(log)
  const read = jest.spyOn(secretManagerService.vaultClient, 'read')
  read.mockResolvedValueOnce({ data: { data: { AMT_PASSWORD: 'P@ssw0rd', MEBX_PASSWORD: 'Intel@123', MPS_PASSWORD: 'lLJPJNtU2$8FZTUy' } } })
  const result = await secretManagerService.getSecretFromKey('4c4c4544-004b-4210-8033-b6c04f504633', 'AMT_PASSWORD')
  expect(result).toBe('P@ssw0rd')
})

test('should get null, if the key does not exists in the path', async () => {
  const read = jest.spyOn(secretManagerService.vaultClient, 'read')
  read.mockResolvedValueOnce({ data: { data: { AMT_PASSWORD: 'P@ssw0rd', MEBX_PASSWORD: 'Intel@123', MPS_PASSWORD: 'lLJPJNtU2$8FZTUy' } } })
  const result = await secretManagerService.getSecretFromKey('4c4c4544-004b-4210-8033-b6c04f504633', 'AMT_PASSWORD1')
  expect(result).toBe(null)
})

test('should get null, if path does not exist', async () => {
  const read = jest.spyOn(secretManagerService.vaultClient, 'read')
  read.mockRejectedValueOnce('Status 404')
  const result = await secretManagerService.getSecretFromKey('4c4c4544-004b-4210-8033-b6c04f504634', 'AMT_PASSWORD')
  expect(result).toBe(null)
})

test('should get a secret from a specific given path', async () => {
  const data = { data: { data: { AMT_PASSWORD: 'P@ssw0rd', MEBX_PASSWORD: 'Intel@123', MPS_PASSWORD: 'lLJPJNtU2$8FZTUy' } } }
  const read = jest.spyOn(secretManagerService.vaultClient, 'read')
  read.mockResolvedValueOnce({ data: { data: { AMT_PASSWORD: 'P@ssw0rd', MEBX_PASSWORD: 'Intel@123', MPS_PASSWORD: 'lLJPJNtU2$8FZTUy' } } })
  const result = await secretManagerService.getSecretAtPath('4c4c4544-004b-4210-8033-b6c04f504633?version=3')
  expect(result).toEqual(data.data)
})

test('should throw an exception and return null if given path does not exist', async () => {
  const read = jest.spyOn(secretManagerService.vaultClient, 'read')
  read.mockRejectedValueOnce('Status 404')
  const result = await secretManagerService.getSecretAtPath('doesnotexists')
  expect(result).toEqual(null)
})

test('should create a secret', async () => {
  const data = {
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
  const write = jest.spyOn(secretManagerService.vaultClient, 'write')
  write.mockResolvedValueOnce({})
  const result = await secretManagerService.writeSecretWithObject('test', data)
  expect(result).toBe(true)
})

test('should return false if the path does not exist', async () => {
  const data = {
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
  const write = jest.spyOn(secretManagerService.vaultClient, 'write')
  write.mockRejectedValueOnce('Status 404')
  const result = await secretManagerService.writeSecretWithObject('doesnotexist', data)
  expect(result).toBe(false)
})

test('should get AMT credentials for a specific device', async () => {
  const data = ['admin', 'P@ssw0rd']
  const read = jest.spyOn(secretManagerService.vaultClient, 'read')
  read.mockResolvedValueOnce({ data: { data: { AMT_PASSWORD: 'P@ssw0rd', MEBX_PASSWORD: 'Intel@123', MPS_PASSWORD: 'lLJPJNtU2$8FZTUy' } } })
  const result = await secretManagerService.getAMTCredentials('4c4c4544-004b-4210-8033-b6c04f504633')
  expect(result).toEqual(data)
})

test('should return null if AMT credentials for a specific device does not exists', async () => {
  const getSecretAtPath = jest.spyOn(secretManagerService, 'getSecretAtPath')
  getSecretAtPath.mockResolvedValueOnce(null)
  const result = await secretManagerService.getAMTCredentials('4c4c4544-004b-4210-8033-b6c04f504633')
  expect(result).toEqual(null)
})

test('should get MPS certs', async () => {
  const data = {
    data: {
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
  }
  const read = jest.spyOn(secretManagerService.vaultClient, 'read')
  read.mockResolvedValueOnce(data)
  const result = await secretManagerService.getMPSCerts()
  expect(result).toEqual(data.data.data)
})

test('should return null if MPS certs does not exists', async () => {
  const getSecretAtPath = jest.spyOn(secretManagerService, 'getSecretAtPath')
  getSecretAtPath.mockResolvedValueOnce(null)
  const result = await secretManagerService.getMPSCerts()
  expect(result).toEqual(null)
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
  const health = jest.spyOn(secretManagerService.vaultClient, 'health')
  health.mockResolvedValueOnce(data)
  const result = await secretManagerService.health()
  expect(result).toEqual(data)
})
