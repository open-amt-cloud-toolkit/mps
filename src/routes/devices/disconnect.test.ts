/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { logger, messages } from '../../logging'
import { devices } from '../../server/mpsserver'
import { disconnect } from './disconnect'

let res: Express.Response
let statusSpy: jest.SpyInstance
let jsonSpy: jest.SpyInstance

beforeEach(() => {
  res = {
    status: () => {
      return res
    },
    json: () => {
      return res
    },
    end: () => {
      return res
    }
  }
  statusSpy = jest.spyOn(res as any, 'status')
  jsonSpy = jest.spyOn(res as any, 'json')
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

const req = {
  params: {
    guid: '00000000-0000-0000-0000-000000000000'
  },
  db: {
    devices: {
    }
  }
} as any

describe('disconnect', () => {
  it('should disconnect device if it is connected', async () => {
    const guid = req.params.guid
    devices[guid] = {
      ciraSocket: {
        destroy: jest.fn()
      }
    } as any
    await disconnect(req, res as any)
    expect(devices[guid].ciraSocket.destroy).toHaveBeenCalled()
    expect(jsonSpy).toHaveBeenCalledWith({ success: 200, description: `${messages.DEVICE_DISCONNECTED_SUCCESS} : ${guid}` })
  })

  it('should set status to 500 if error occurs when calling destroy on socket of connected device', async () => {
    devices[req.params.guid] = {
      ciraSocket: {
        destroy: jest.fn().mockImplementation(() => {
          throw new TypeError('fake error')
        })
      }
    } as any
    const loggerSpy = jest.spyOn(logger, 'error')
    await disconnect(req, res as any)
    expect(statusSpy).toHaveBeenCalledWith(500)
    expect(loggerSpy).toHaveBeenCalled()
  })
})
