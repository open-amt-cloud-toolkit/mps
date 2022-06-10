/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Certificates } from './certificates'
import { certificatesType } from '../models/Config'
import forge from 'node-forge'

let certificates: Certificates
let generateKeyPairSpy: jest.SpyInstance
let createCertificateSpy: jest.SpyInstance
let getPublicKeyFingerprintSpy: jest.SpyInstance
let sha384CreateSpy: jest.SpyInstance
let getMPSCertsSpy: jest.SpyInstance
let issuePkiCertificateSpy: jest.SpyInstance
let storeCertificatesSpy: jest.SpyInstance
let writeSecretWithObjectSpy: jest.SpyInstance
const config = {
  common_name: 'me',
  country: 'us',
  organization: 'rbhe',
  generate_certificates: true as any
}
const secrets = {
  getMPSCerts: () => undefined,
  writeSecretWithObject: async () => undefined,
  issuePkiCertificate: async (path: string, data: any) => false
}

beforeEach(() => {
  getMPSCertsSpy = jest.spyOn(secrets, 'getMPSCerts')
  issuePkiCertificateSpy = jest.spyOn(secrets, 'issuePkiCertificate')
  certificates = new Certificates(config, secrets)
  writeSecretWithObjectSpy = jest.spyOn(secrets, 'writeSecretWithObject')
  storeCertificatesSpy = jest.spyOn(certificates, 'storeCertificates')
  generateKeyPairSpy = jest.spyOn(forge.pki.rsa, 'generateKeyPair')
  createCertificateSpy = jest.spyOn(forge.pki, 'createCertificate')
  getPublicKeyFingerprintSpy = jest.spyOn(forge.pki, 'getPublicKeyFingerprint')
  sha384CreateSpy = jest.spyOn(forge.md.sha384, 'create')
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('constructor', () => {
  it('should construct a Certificates object', () => {
    const result = certificates
    expect(result).toBeTruthy()
  })
})

describe('generateCertificates', () => {
  it('should generate certificates', async () => {
    const generateRootCertificateSpy = jest.spyOn(certificates, 'GenerateRootCertificate').mockReturnValue({})
    const certificateToPemSpy = jest.spyOn(forge.pki, 'certificateToPem').mockReturnValue('certificate')
    const privateKeyToPemSpy = jest.spyOn(forge.pki, 'privateKeyToPem').mockReturnValue('private key')
    const issueWebServerCertificateSpy = jest.spyOn(certificates, 'IssueWebServerCertificate').mockReturnValue({})
    const result: certificatesType = await certificates.generateCertificates()
    expect(result.mps_tls_config).toBeTruthy()
    expect(result.web_tls_config).toBeTruthy()
    expect(result.root_key).toBeTruthy()
    expect(certificateToPemSpy).toBeCalled()
    expect(privateKeyToPemSpy).toBeCalled()
    expect(issueWebServerCertificateSpy).toBeCalled()
    expect(generateRootCertificateSpy).toBeCalled()
  })
})

describe('issueCertificates by vault', () => {
  beforeEach(() => {
    config.generate_certificates = 'vault'
  })

  afterEach(() => {
    config.generate_certificates = true
  })

  it('should issue certificates', async () => {
    issuePkiCertificateSpy.mockReturnValue(Promise.resolve({
      data: {
        //
        issuing_ca: '.',
        certificate: '.',
        private_key: '.'
      }
    }))
    const generateRootCertificateSpy = jest.spyOn(certificates, 'GenerateRootCertificate').mockReturnValue({})
    const issueWebServerCertificateByVaultSpy = jest.spyOn(certificates, 'IssueWebServerCertificateByVault')
    const result: certificatesType = await certificates.generateCertificates()
    expect(result.mps_tls_config).toBeTruthy()
    expect(result.web_tls_config).toBeTruthy()
    expect(result.root_key).toBeUndefined()
    expect(generateRootCertificateSpy).not.toBeCalled()
    expect(issuePkiCertificateSpy).toBeCalled()
    expect(issueWebServerCertificateByVaultSpy).toBeCalled()
  })
})

describe('GenerateRootCertificate', () => {
  const keyPair = {
    publicKey: {},
    privateKey: {}
  } as any
  const certificate = {
    validity: {},
    setSubject: jest.fn(),
    setIssuer: jest.fn(),
    setExtensions: jest.fn(),
    sign: jest.fn()
  } as any

  beforeEach(() => {
    generateKeyPairSpy.mockReturnValue(keyPair)
    createCertificateSpy.mockReturnValue(certificate)
    getPublicKeyFingerprintSpy.mockReturnValue('abc123')
    sha384CreateSpy.mockReturnValue(123456 as any)
  })

  it('should generate root certificate using strong keysize', () => {
    const addThumbPrintToName = true
    const commonName = 'cn'
    const country = 'us'
    const organization = 'rhbe'
    const strong = true
    const result = certificates.GenerateRootCertificate(addThumbPrintToName, commonName, country, organization, strong)
    expect(result.cert).toBeTruthy()
    expect(result.key).toBeTruthy()
  })

  it('should generate root certificate without using strong keysize', () => {
    const addThumbPrintToName = true
    const commonName = null
    const country = null
    const organization = null
    const strong = false
    const result = certificates.GenerateRootCertificate(addThumbPrintToName, commonName, country, organization, strong)
    expect(result.cert).toBeTruthy()
    expect(result.key).toBeTruthy()
  })
})

describe('getCertificates', () => {
  it('should get certificates if they already exist', async () => {
    const expectedCertificates = {}
    getMPSCertsSpy.mockReturnValue(expectedCertificates)
    const result = await certificates.getCertificates()
    expect(result).toEqual(expectedCertificates)
    expect(storeCertificatesSpy).not.toBeCalled()
  })

  it('should get certificates after generating them first if they do not already exist', async () => {
    const expectedCertificates = {} as any
    getMPSCertsSpy.mockReturnValue(null)
    storeCertificatesSpy.mockImplementation()
    const generateCertificatesSpy = jest.spyOn(certificates, 'generateCertificates').mockReturnValue(expectedCertificates)
    const result = await certificates.getCertificates()
    expect(result).toEqual(expectedCertificates)
    expect(generateCertificatesSpy).toBeCalled()
    expect(storeCertificatesSpy).toBeCalled()
  })
})

describe('storeCertificates', () => {
  it('should store certificates', async () => {
    const certificatesData: certificatesType = {
      mps_tls_config: undefined,
      web_tls_config: undefined
    }
    writeSecretWithObjectSpy.mockImplementation()
    await certificates.storeCertificates(certificatesData)
    const expectedData = { data: certificatesData }
    expect(writeSecretWithObjectSpy).toBeCalledWith('MPSCerts', expectedData)
  })
})

describe('IssueWebServerCertificate', () => {
  const keyPair = {
    publicKey: {},
    privateKey: {}
  } as any

  it('should issue web server certificate using strong keys', () => {
    const certificate = {
      validity: {
        notAfter: {
          getFullYear: jest.fn().mockReturnValue('2022')
        }
      },
      setSubject: jest.fn(),
      setIssuer: jest.fn(),
      setExtensions: jest.fn(),
      sign: jest.fn()
    } as any
    generateKeyPairSpy.mockReturnValue(keyPair)
    createCertificateSpy.mockReturnValue(certificate)
    getPublicKeyFingerprintSpy.mockReturnValue('abc123')
    sha384CreateSpy.mockReturnValue(123456 as any)
    const rootcert = {
      cert: {
        subject: {
          attributes: {}
        }
      }
    }
    const addThumbPrintToName = true
    const commonName = 'cn'
    const country = 'us'
    const organization = 'rhbe'
    const extKeyUsage = {
      serverAuth: true
    }
    const strong = true
    const result = certificates.IssueWebServerCertificate(rootcert, addThumbPrintToName, commonName, country, organization, extKeyUsage, strong)
    expect(result.cert).toBeTruthy()
    expect(result.key).toBeTruthy()
  })

  it('should issue web server certificate not using strong keys and no extKeyUsage', () => {
    const certificate = {
      validity: {
        notAfter: {
          getFullYear: jest.fn().mockReturnValue('2022')
        }
      },
      setSubject: jest.fn(),
      setIssuer: jest.fn(),
      setExtensions: jest.fn(),
      sign: jest.fn()
    } as any
    generateKeyPairSpy.mockReturnValue(keyPair)
    createCertificateSpy.mockReturnValue(certificate)
    getPublicKeyFingerprintSpy.mockReturnValue('abc123')
    sha384CreateSpy.mockReturnValue(123456 as any)
    const rootcert = {
      cert: {
        subject: {
          attributes: {}
        }
      }
    }
    const addThumbPrintToName = true
    const commonName = 'cn'
    const country = 'us'
    const organization = 'rhbe'
    const extKeyUsage = null
    const strong = false
    const result = certificates.IssueWebServerCertificate(rootcert, addThumbPrintToName, commonName, country, organization, extKeyUsage, strong)
    expect(result.cert).toBeTruthy()
    expect(result.key).toBeTruthy()
  })
})
