/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { stats } from './stats'

let res: Express.Response
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
  jsonSpy = jest.spyOn(res as any, 'json')
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('stats', () => {
  it('should get stats when a device exists', async () => {
    const devices = [{
      connectionStatus: true
    }]
    const req = {
      db: {
        devices: {
          get: jest.fn().mockReturnValue(devices)
        }
      }
    }
    await stats(req as any, res as any)
    const expectedTotalCount = devices.length
    const expectedConnectedCount = devices.filter(device => device.connectionStatus).length
    const expectedDisconnectedCount = Math.max(expectedTotalCount - expectedConnectedCount, 0)
    const expectedJson = {
      totalCount: expectedTotalCount,
      connectedCount: expectedConnectedCount,
      disconnectedCount: expectedDisconnectedCount
    }
    expect(jsonSpy).toBeCalledWith(expectedJson)
  })

  it('should get stats even when no device exists', async () => {
    const req = {
      db: {
        devices: {
          get: jest.fn().mockReturnValue(null)
        }
      }
    }
    await stats(req as any, res as any)
    const expectedTotalCount = 0
    const expectedConnectedCount = 0
    const expectedDisconnectedCount = 0
    const expectedJson = {
      totalCount: expectedTotalCount,
      connectedCount: expectedConnectedCount,
      disconnectedCount: expectedDisconnectedCount
    }
    expect(jsonSpy).toBeCalledWith(expectedJson)
  })
})
