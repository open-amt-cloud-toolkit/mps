/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { stats } from './stats.js'

let res: Express.Response
let jsonSpy: jest.SpyInstance
let resSpy: jest.SpyInstance

beforeEach(() => {
  res = {
    status: () => res,
    json: () => res,
    end: () => res
  }
  jsonSpy = jest.spyOn(res as any, 'json')
  resSpy = jest.spyOn(res as any, 'status')
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('stats', () => {
  it('should get stats when a device exists', async () => {
    const allCount = 20
    const connectedCount = 10
    const req = {
      db: {
        devices: {
          getConnectedDevices: jest.fn().mockReturnValue(connectedCount),
          getCount: jest.fn().mockReturnValue(allCount)
        }
      }
    }
    await stats(req as any, res as any)
    const expectedTotalCount = allCount
    const expectedConnectedCount = connectedCount
    const expectedDisconnectedCount = Math.max(expectedTotalCount - expectedConnectedCount, 0)
    const expectedJson = {
      totalCount: expectedTotalCount,
      connectedCount: expectedConnectedCount,
      disconnectedCount: expectedDisconnectedCount
    }
    expect(jsonSpy).toBeCalledWith(expectedJson)
  })
  it('should return 500 when error', async () => {
    const req = {
      db: {
        devices: {
          getConnectedDevices: jest.fn().mockRejectedValue(new Error()),
          getCount: jest.fn().mockRejectedValue(new Error())
        }
      }
    }
    await stats(req as any, res as any)

    expect(resSpy).toHaveBeenCalledWith(500)
  })
  it('should get stats even when no device exists', async () => {
    const req = {
      db: {
        devices: {
          getConnectedDevices: jest.fn().mockReturnValue(0),
          getCount: jest.fn().mockReturnValue(0)
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
