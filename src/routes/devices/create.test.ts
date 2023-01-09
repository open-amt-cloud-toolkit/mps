/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { insertDevice } from './create'
import { logger } from '../../logging'
import { MPSValidationError } from '../../utils/MPSValidationError'

let res: Express.Response
let statusSpy: jest.SpyInstance
let jsonSpy: jest.SpyInstance
let endSpy: jest.SpyInstance

beforeEach(() => {
  res = {
    status: () => res,
    json: () => res,
    end: () => res
  }
  statusSpy = jest.spyOn(res as any, 'status')
  endSpy = jest.spyOn(res as any, 'end')
  jsonSpy = jest.spyOn(res as any, 'json')
})

describe('create', () => {
  it('should set status to 200 and update device in db with relevant properties from request if device already exists in db', async () => {
    const deviceFromMockDb = {
      connectionStatus: true
    } as any
    const hostnameFromRequest = 'anyhost'
    const tagsFromRequest = ['tag']
    const mpsusernameFromRequest = 'itproadmin'
    const tenantIdFromRequest = 'tenantxyz'
    const guidFromRequest = '00000000-0000-0000-0000-000000000000'
    const friendlyNameFromRequest = 'host1'
    const dnsSuffixFromRequest = 'dns1'
    const expectedUpdateResultFromDb = {
      hostname: hostnameFromRequest,
      tags: tagsFromRequest,
      connectionStatus: true,
      mpsusername: mpsusernameFromRequest,
      tenantId: tenantIdFromRequest,
      friendlyName: friendlyNameFromRequest,
      dnsSuffix: dnsSuffixFromRequest
    }
    const req = {
      body: {
        guid: guidFromRequest,
        hostname: hostnameFromRequest,
        tags: tagsFromRequest,
        mpsusername: mpsusernameFromRequest,
        tenantId: tenantIdFromRequest,
        friendlyname: friendlyNameFromRequest,
        dnssuffix: dnsSuffixFromRequest
      },
      db: {
        devices: {
          getById: jest.fn().mockReturnValue(deviceFromMockDb),
          update: jest.fn().mockReturnValue(expectedUpdateResultFromDb)
        }
      }
    } as any
    await insertDevice(req, res as any)
    expect(req.db.devices.getById).toHaveBeenCalledWith(guidFromRequest)
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(jsonSpy).toHaveBeenCalledWith(expectedUpdateResultFromDb)
    expect(req.db.devices.update).toHaveBeenCalledWith(expectedUpdateResultFromDb)
  })

  it('should set status to 200 and update device in db with relevant properties from db if device already exists in db', async () => {
    const hostnameFromDb = 'anyhost'
    const tagsFromDb = ['tag']
    const mpsusernameFromDb = 'itproadmin'
    const tenantIdFromDb = ''
    const guidFromRequest = '00000000-0000-0000-0000-000000000000'
    const friendlyNameFromRequest = 'host2'
    const dnsSuffixFromRequest = 'dns2'
    const deviceFromMockDb = {
      hostname: hostnameFromDb,
      tags: tagsFromDb,
      mpsusername: mpsusernameFromDb,
      friendlyName: friendlyNameFromRequest,
      dnsSuffix: dnsSuffixFromRequest
    } as any
    const expectedUpdateResultFromDb = {
      hostname: hostnameFromDb,
      tags: tagsFromDb,
      connectionStatus: false,
      mpsusername: mpsusernameFromDb,
      tenantId: tenantIdFromDb,
      friendlyName: friendlyNameFromRequest,
      dnsSuffix: dnsSuffixFromRequest
    }
    const req = {
      body: {
        guid: guidFromRequest,
        hostname: null,
        tags: null,
        mpsusername: null,
        tenantId: null,
        friendlyname: friendlyNameFromRequest,
        dnssuffix: dnsSuffixFromRequest
      },
      db: {
        devices: {
          getById: jest.fn().mockReturnValue(deviceFromMockDb),
          update: jest.fn().mockReturnValue(expectedUpdateResultFromDb)
        }
      }
    } as any
    await insertDevice(req, res as any)
    expect(req.db.devices.getById).toHaveBeenCalledWith(guidFromRequest)
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(jsonSpy).toHaveBeenCalledWith(expectedUpdateResultFromDb)
    expect(req.db.devices.update).toHaveBeenCalledWith(expectedUpdateResultFromDb)
  })

  it('should set status to 201 and insert device in db with relevant properties from request if device does not already exist in db', async () => {
    const deviceFromMockDb = null
    const hostnameFromRequest = 'anyhost'
    const tagsFromRequest = ['tag']
    const mpsusernameFromRequest = 'itproadmin'
    const tenantIdFromRequest = 'tenantxyz'
    const guidFromRequest = '00000000-0000-0000-0000-000000000000'
    const friendlyNameFromRequest = null
    const dnsSuffixFromRequest = null
    const expectedInsertResultFromDb = {
      connectionStatus: false,
      guid: guidFromRequest,
      hostname: hostnameFromRequest,
      tags: tagsFromRequest,
      mpsusername: mpsusernameFromRequest,
      mpsInstance: null,
      tenantId: tenantIdFromRequest,
      friendlyName: friendlyNameFromRequest,
      dnsSuffix: dnsSuffixFromRequest
    }
    const req = {
      body: {
        guid: guidFromRequest,
        hostname: hostnameFromRequest,
        tags: tagsFromRequest,
        mpsusername: mpsusernameFromRequest,
        tenantId: tenantIdFromRequest,
        friendlyName: friendlyNameFromRequest,
        dnsSuffix: dnsSuffixFromRequest
      },
      db: {
        devices: {
          getById: jest.fn().mockReturnValue(deviceFromMockDb),
          insert: jest.fn().mockReturnValue(expectedInsertResultFromDb)
        }
      }
    } as any
    await insertDevice(req, res as any)
    expect(req.db.devices.getById).toHaveBeenCalledWith(guidFromRequest)
    expect(statusSpy).toHaveBeenCalledWith(201)
    expect(jsonSpy).toHaveBeenCalledWith(expectedInsertResultFromDb)
    expect(req.db.devices.insert).toHaveBeenCalledWith(expectedInsertResultFromDb)
  })

  it('should set status to 201 and insert device in db with default properties if device does not already exist in db', async () => {
    const deviceFromMockDb = null
    const hostnameFromRequest = null
    const tagsFromRequest = null
    const mpsusernameFromRequest = 'itproadmin'
    const tenantIdFromRequest = null
    const friendlyNameFromRequest = null
    const dnsSuffixFromRequest = null
    const guidFromRequest = '00000000-0000-0000-0000-000000000000'
    const expectedInsertResultFromDb = {
      connectionStatus: false,
      guid: guidFromRequest,
      hostname: null,
      tags: null,
      mpsusername: mpsusernameFromRequest,
      mpsInstance: null,
      tenantId: '',
      friendlyName: friendlyNameFromRequest,
      dnsSuffix: dnsSuffixFromRequest
    }
    const req = {
      body: {
        guid: guidFromRequest,
        hostname: hostnameFromRequest,
        tags: tagsFromRequest,
        mpsusername: mpsusernameFromRequest,
        tenantId: tenantIdFromRequest,
        friendlyName: friendlyNameFromRequest,
        dnsSuffix: dnsSuffixFromRequest
      },
      db: {
        devices: {
          getById: jest.fn().mockReturnValue(deviceFromMockDb),
          insert: jest.fn().mockReturnValue(expectedInsertResultFromDb)
        }
      }
    } as any
    await insertDevice(req, res as any)
    expect(req.db.devices.getById).toHaveBeenCalledWith(guidFromRequest)
    expect(statusSpy).toHaveBeenCalledWith(201)
    expect(jsonSpy).toHaveBeenCalledWith(expectedInsertResultFromDb)
    expect(req.db.devices.insert).toHaveBeenCalledWith(expectedInsertResultFromDb)
  })

  it('should handle MPSValidationError', async () => {
    const errorName = 'FakeMPSError'
    const errorMessage = 'This is a fake error'
    const errorStatus = 555
    const guidFromRequest = '00000000-0000-0000-0000-000000000000'
    const req = {
      body: {
        guid: guidFromRequest
      },
      db: {
        devices: {
          getById: jest.fn().mockImplementation(() => {
            throw new MPSValidationError(errorMessage, errorStatus, errorName)
          })
        }
      }
    } as any
    const errorSpy = jest.spyOn(logger, 'error')
    await insertDevice(req, res as any)
    expect(statusSpy).toHaveBeenLastCalledWith(errorStatus)
    expect(jsonSpy).toHaveBeenCalledWith({
      error: errorName,
      message: errorMessage
    })
    expect(errorSpy).toHaveBeenCalled()
  })

  it('should handle general error', async () => {
    const guidFromRequest = '00000000-0000-0000-0000-000000000000'
    const req = {
      body: {
        guid: guidFromRequest
      },
      db: {
        devices: {
          getById: jest.fn().mockImplementation(() => {
            throw new TypeError('fake error')
          })
        }
      }
    } as any
    const errorSpy = jest.spyOn(logger, 'error')
    await insertDevice(req, res as any)
    expect(statusSpy).toHaveBeenLastCalledWith(500)
    expect(endSpy).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalled()
  })
})
