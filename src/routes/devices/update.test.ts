/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { MPSValidationError } from '../../utils/MPSValidationError.js'
import { updateDevice } from './update.js'
import { logger } from '../../logging/index.js'
import { jest } from '@jest/globals'
import { type SpyInstance, spyOn } from 'jest-mock'

let res: Express.Response
let statusSpy: SpyInstance<any>
let jsonSpy: SpyInstance<any>
let endSpy: SpyInstance<any>

beforeEach(() => {
  res = {
    status: () => res,
    json: () => res,
    end: () => res
  }
  statusSpy = spyOn(res as any, 'status')
  jsonSpy = spyOn(res as any, 'json')
  endSpy = spyOn(res as any, 'end')
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('update', () => {
  const guid = '00000000-0000-0000-0000-000000000000'
  const errorSpy = spyOn(logger, 'error')

  it('should set status to 404 if getById gets no result', async () => {
    const req = {
      db: {
        devices: {
          getById: jest.fn().mockReturnValue(null)
        }
      },
      body: {
        guid
      }
    }
    await updateDevice(req as any, res as any)
    expect(statusSpy).toBeCalledWith(404)
    expect(jsonSpy).toBeCalledWith({ error: 'NOT FOUND', message: `Device ID ${guid} not found` })
    expect(endSpy).toBeCalled()
  })

  it('should set status to 200 if getById gets a result', async () => {
    const device = {} as any

    const req = {
      db: {
        devices: {
          getById: jest.fn().mockReturnValue(device),
          update: () => {}
        }
      },
      body: {
        guid
      }
    }
    const expectedDevice = { ...device, ...req.body }
    const updateSpy = spyOn(req.db.devices, 'update').mockReturnValue(expectedDevice)
    await updateDevice(req as any, res as any)
    expect(updateSpy).toHaveBeenCalled()
    expect(statusSpy).toBeCalledWith(200)
    expect(jsonSpy).toBeCalledWith(expectedDevice)
    expect(endSpy).toBeCalled()
  })

  it('should set status to that of MPSValidationError if it occurs', async () => {
    const errorName = 'FakeMPSError'
    const errorMessage = 'This is a fake error'
    const errorStatus = 555
    const req = {
      db: {
        devices: {
          getById: jest.fn().mockImplementation(() => {
            throw new MPSValidationError(errorMessage, errorStatus, errorName)
          })
        }
      },
      body: {
        guid
      }
    }
    await updateDevice(req as any, res as any)
    expect(statusSpy).toBeCalled()
    expect(jsonSpy).toBeCalledWith({ error: errorName, message: errorMessage })
    expect(endSpy).toBeCalled()
    expect(errorSpy).toHaveBeenCalled()
  })

  it('should set status to 500 if error other than MPSValidationError occurs', async () => {
    const req = {
      db: {
        devices: {
          getById: jest.fn().mockImplementation(() => {
            throw new TypeError('fake error')
          })
        }
      },
      body: {
        guid
      }
    }
    await updateDevice(req as any, res as any)
    expect(statusSpy).toBeCalledWith(500)
    expect(endSpy).toBeCalled()
    expect(errorSpy).toHaveBeenCalled()
  })
})
