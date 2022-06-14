/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import tlsConfiguration from './tlsConfiguration'
import fs from 'fs'
import { logger } from '../logging'
import { mpsConfigType, webConfigType, directConfigType } from '../models/Config'
import { constants } from 'crypto'

const web = tlsConfiguration.web
const mps = tlsConfiguration.mps
const direct = tlsConfiguration.direct
let existsSyncSpy: jest.SpyInstance
let readFileSyncSpy: jest.SpyInstance
let jsonParseSpy: jest.SpyInstance
let errorSpy: jest.SpyInstance
let exitSpy: jest.SpyInstance

beforeEach(() => {
  errorSpy = jest.spyOn(logger, 'error')
  exitSpy = jest.spyOn(process, 'exit').mockImplementation((code: number) => { return null as never })
  existsSyncSpy = jest.spyOn(fs, 'existsSync')
  readFileSyncSpy = jest.spyOn(fs, 'readFileSync')
  jsonParseSpy = jest.spyOn(JSON, 'parse')
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

const defaultWebConfig = {
  ca: '',
  cert: '',
  key: '',
  secureOptions: [constants.SSL_OP_NO_SSLv2]
}

const defaultMpsConfig = {
  cert: '',
  key: '',
  minVersion: 'TLSv1',
  secureOptions: [constants.SSL_OP_NO_SSLv2],
  requestCert: true,
  rejectUnauthorized: false
}

describe('web', () => {
  it('should return webConfig (more than one secure options)', () => {
    const webConfig = {
      ca: 'abc',
      cert: 'cert',
      key: 'key',
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3, constants.SSL_OP_NO_TLSv1],
      null: null
    }
    readFileSyncSpy.mockImplementation()
    jsonParseSpy.mockReturnValue(webConfig)
    existsSyncSpy.mockReturnValue(true)
    const result = web(defaultWebConfig)
    expect(result).toEqual(webConfig)
    expect(readFileSyncSpy).toHaveBeenCalled()
  })

  it('should return webConfig (one secure option)', () => {
    const webConfig = {
      ca: 'abc',
      cert: 'cert',
      key: 'key',
      secureOptions: [constants.SSL_OP_NO_SSLv2]
    }
    readFileSyncSpy.mockImplementation()
    jsonParseSpy.mockReturnValue(webConfig)
    existsSyncSpy.mockReturnValue(true)
    const result = web(defaultWebConfig)
    expect(result).toEqual(webConfig)
    expect(readFileSyncSpy).toHaveBeenCalled()
  })

  it('should return webConfig after read the file', () => {
    const webConfig = {
      ca: 'ca.crt',
      cert: 'tls.crt',
      key: 'tls.key',
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3, constants.SSL_OP_NO_TLSv1],
      null: null
    }

    const mockFile = (p: string): string | undefined => {
      if (p === webConfig.ca) {
        return 'CA'
      } else if (p === webConfig.cert) {
        return 'CERT'
      } else if (p === webConfig.key) {
        return 'KEY'
      }
    }
    readFileSyncSpy.mockImplementation((p) => mockFile(p))
    existsSyncSpy.mockImplementation((p) => !!mockFile(p))
    jsonParseSpy.mockReturnValue(webConfig)
    const result = web(webConfig)
    expect(result).toEqual({
      ...webConfig,
      ca: ['CA'],
      cert: 'CERT',
      key: 'KEY'
    })
    expect(readFileSyncSpy).toHaveBeenCalled()
  })

  it('should return void if webTlsConfigPath does not exist', () => {
    existsSyncSpy.mockReturnValue(false)
    const result = web(defaultWebConfig)
    expect(result).toBeUndefined()
    expect(errorSpy).toHaveBeenCalled()
  })

  it('should exit if webConfig missing either TLS cert or private key', () => {
    const webConfig: webConfigType = {
      ca: 'abc',
      cert: null,
      key: null,
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3]
    }
    readFileSyncSpy.mockImplementation()
    jsonParseSpy.mockReturnValue(webConfig)
    existsSyncSpy.mockReturnValue(true)
    const result = web(defaultWebConfig)
    expect(result).toBeFalsy()
    expect(errorSpy).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalled()
  })

  it('should exit if TLS cert or private key does not exist', () => {
    const webConfig: webConfigType = {
      ca: 'abc',
      cert: 'cert',
      key: 'key',
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3]
    }
    readFileSyncSpy.mockImplementation()
    jsonParseSpy.mockReturnValue(webConfig)
    existsSyncSpy.mockImplementation((p) => {
      if (p === webConfig.key) {
        return false
      } else if (p === webConfig.cert) {
        return false
      } else {
        return true
      }
    })
    const result = web(defaultWebConfig)
    expect(result).toBeFalsy()
    expect(errorSpy).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalled()
  })

  it('should exit if exception on failed to parse json file', () => {
    existsSyncSpy.mockReturnValue(true)
    jsonParseSpy.mockImplementation(() => {
      throw new Error('fake json parse error')
    })
    const result = web(defaultWebConfig)
    expect(result).toBeFalsy()
    expect(errorSpy).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalled()
  })

  it('should exit if webConfig missing CA cert', () => {
    const webConfig: webConfigType = {
      ca: null,
      cert: 'cert',
      key: 'key',
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3]
    }
    readFileSyncSpy.mockImplementation()
    jsonParseSpy.mockReturnValue(webConfig)
    existsSyncSpy.mockImplementation((p) => {
      if (p === webConfig.key) {
        return true
      } else if (p === webConfig.cert) {
        return true
      } else {
        return true
      }
    })
    const result = web(defaultWebConfig)
    expect(result).toBeFalsy()
    expect(errorSpy).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalled()
  })

  it('should exit on exception', () => {
    const webConfig: webConfigType = {
      ca: 'abc',
      cert: 'cert',
      key: 'key',
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3]
    }
    readFileSyncSpy.mockImplementation((p, e) => {
      if (p === webConfig.key) {
        throw Error('fake read file error')
      }
    })
    jsonParseSpy.mockReturnValue(webConfig)
    existsSyncSpy.mockReturnValue(true)
    const result = web(defaultWebConfig)
    expect(result).toBeFalsy()
    expect(errorSpy).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalled()
  })
})

describe('mps', () => {
  it('should return mpsConfig (more than one secure options)', () => {
    const mpsConfig = {
      cert: 'cert',
      key: 'key',
      minVersion: '',
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3, constants.SSL_OP_NO_TLSv1],
      requestCert: true,
      rejectUnauthorized: true,
      null: null
    }
    readFileSyncSpy.mockImplementation()
    jsonParseSpy.mockReturnValue(mpsConfig)
    existsSyncSpy.mockReturnValue(true)
    const result = mps(defaultMpsConfig)
    expect(result).toEqual(mpsConfig)
    expect(readFileSyncSpy).toHaveBeenCalled()
  })

  it('should return mpsConfig (one secure option)', () => {
    const mpsConfig = {
      cert: 'cert',
      key: 'key',
      minVersion: '',
      secureOptions: [constants.SSL_OP_NO_SSLv2],
      requestCert: true,
      rejectUnauthorized: true,
      null: null
    }
    readFileSyncSpy.mockImplementation()
    jsonParseSpy.mockReturnValue(mpsConfig)
    existsSyncSpy.mockReturnValue(true)
    const result = mps(defaultMpsConfig)
    expect(result).toEqual(mpsConfig)
    expect(readFileSyncSpy).toHaveBeenCalled()
  })

  it('should return mpsConfig after read the file', () => {
    const mpsConfig = {
      cert: 'tls.crt',
      key: 'tls.key',
      minVersion: '',
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3, constants.SSL_OP_NO_TLSv1],
      requestCert: true,
      rejectUnauthorized: true,
      null: null
    }

    const mockFile = (p: string): string | undefined => {
      if (p === mpsConfig.cert) {
        return 'CERT'
      } else if (p === mpsConfig.key) {
        return 'KEY'
      }
    }
    readFileSyncSpy.mockImplementation((p) => mockFile(p))
    existsSyncSpy.mockImplementation((p) => !!mockFile(p))
    jsonParseSpy.mockReturnValue(mpsConfig)
    const result = mps(mpsConfig)
    expect(result).toEqual({
      ...mpsConfig,
      cert: 'CERT',
      key: 'KEY'
    })
    expect(readFileSyncSpy).toHaveBeenCalled()
  })

  it('should return void if mpsTlsConfigPath does not exist', () => {
    existsSyncSpy.mockReturnValue(false)
    const result = mps(defaultMpsConfig)
    expect(result).toBeUndefined()
    expect(errorSpy).toHaveBeenCalled()
  })

  it('should exit if mpsConfig missing either TLS cert or private key', () => {
    const mpsConfig: mpsConfigType = {
      cert: null,
      key: null,
      minVersion: '',
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3],
      requestCert: true,
      rejectUnauthorized: true
    }
    readFileSyncSpy.mockImplementation()
    jsonParseSpy.mockReturnValue(mpsConfig)
    existsSyncSpy.mockReturnValue(true)
    const result = mps(defaultMpsConfig)
    expect(result).toBeFalsy()
    expect(errorSpy).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalled()
  })

  it('should exit if TLS cert or private key does not exist', () => {
    const mpsConfig: mpsConfigType = {
      cert: 'cert',
      key: 'key',
      minVersion: '',
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3],
      requestCert: true,
      rejectUnauthorized: true
    }
    readFileSyncSpy.mockImplementation()
    jsonParseSpy.mockReturnValue(mpsConfig)
    existsSyncSpy.mockImplementation((p) => {
      if (p === mpsConfig.key) {
        return false
      } else if (p === mpsConfig.cert) {
        return false
      } else {
        return true
      }
    })
    const result = mps(defaultMpsConfig)
    expect(result).toBeFalsy()
    expect(errorSpy).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalled()
  })

  it('should exit if exception on failed to parse json file', () => {
    existsSyncSpy.mockReturnValue(true)
    jsonParseSpy.mockImplementation(() => {
      throw new Error('fake json parse error')
    })
    const result = mps(defaultMpsConfig)
    expect(result).toBeFalsy()
    expect(errorSpy).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalled()
  })

  it('should exit on exception', () => {
    const mpsConfig: mpsConfigType = {
      cert: 'cert',
      key: 'key',
      minVersion: '',
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3],
      requestCert: true,
      rejectUnauthorized: true
    }
    readFileSyncSpy.mockImplementation((p, e) => {
      if (p === mpsConfig.key) {
        throw Error('fake read file error')
      }
    })
    jsonParseSpy.mockReturnValue(mpsConfig)
    existsSyncSpy.mockReturnValue(true)
    const result = mps(defaultMpsConfig)
    expect(result).toBeFalsy()
    expect(errorSpy).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalled()
  })
})

describe('direct', () => {
  it('should return directConnConfig', () => {
    const directConfig = {
      cert: 'cert',
      key: 'key',
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3, constants.SSL_OP_NO_TLSv1],
      rejectUnauthorized: true,
      ca: 'ca',
      ciphers: 'ciphers',
      null: null
    }
    readFileSyncSpy.mockImplementation()
    jsonParseSpy.mockReturnValue(directConfig)
    existsSyncSpy.mockReturnValue(true)
    const result = direct()
    expect(result).toEqual(directConfig)
    expect(readFileSyncSpy).toHaveBeenCalled()
  })

  it('should return void if directtls config file does not exist', () => {
    existsSyncSpy.mockReturnValue(false)
    const result = direct()
    expect(result).toBeUndefined()
    expect(errorSpy).toHaveBeenCalled()
  })

  it('should exit if Direct Connection Configuration missing either TLS cert or private key', () => {
    const directConfig: directConfigType = {
      cert: null,
      key: null,
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3],
      rejectUnauthorized: true,
      ca: 'ca',
      ciphers: 'ciphers'
    }
    readFileSyncSpy.mockImplementation()
    jsonParseSpy.mockReturnValue(directConfig)
    existsSyncSpy.mockReturnValue(true)
    const result = direct()
    expect(result).toBeFalsy()
    expect(errorSpy).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalled()
  })

  it('should exit if TLS cert or private key does not exist', () => {
    const directConfig: directConfigType = {
      cert: 'cert',
      key: 'key',
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3],
      rejectUnauthorized: true,
      ca: 'ca',
      ciphers: 'ciphers'
    }
    readFileSyncSpy.mockImplementation()
    jsonParseSpy.mockReturnValue(directConfig)
    existsSyncSpy.mockImplementation((p) => {
      if (p === directConfig.key) {
        return true
      } else if (p === directConfig.cert) {
        return false
      } else {
        return true
      }
    })
    const result = direct()
    expect(result).toBeFalsy()
    expect(errorSpy).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalled()
  })

  it('should exit if exception on failed to parse json file', () => {
    existsSyncSpy.mockReturnValue(true)
    jsonParseSpy.mockImplementation(() => {
      throw new Error('fake json parse error')
    })
    const result = direct()
    expect(result).toBeFalsy()
    expect(errorSpy).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalled()
  })

  it('should exit on exception', () => {
    const directConfig: directConfigType = {
      cert: 'cert',
      key: 'key',
      secureOptions: [constants.SSL_OP_NO_SSLv2, constants.SSL_OP_NO_SSLv3],
      rejectUnauthorized: true,
      ca: 'ca',
      ciphers: 'ciphers'
    }
    readFileSyncSpy.mockImplementation((p, e) => {
      if (p === directConfig.key) {
        throw Error('fake read file error')
      }
    })
    jsonParseSpy.mockReturnValue(directConfig)
    existsSyncSpy.mockReturnValue(true)
    const result = direct()
    expect(result).toBeFalsy()
    expect(errorSpy).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalled()
  })
})
