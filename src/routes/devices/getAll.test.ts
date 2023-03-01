/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { logger } from '../../logging'
import { getAllDevices } from './getAll'

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
  jsonSpy = jest.spyOn(res as any, 'json')
  endSpy = jest.spyOn(res as any, 'end')
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('getAll', () => {
  it('should set status to 200 and get data with count', async () => {
    const device = {
      connectionStatus: true
    } as any

    const req = {
      query: {
        $count: 1,
        tags: 'tag1,tag2',
        method: 'method',
        $top: 0,
        $skip: 0,
        status: false
      },
      tenantId: '',
      db: {
        devices:
        {
          getByTags: jest.fn().mockReturnValue([device]),
          getCount: jest.fn().mockReturnValue(1)
        }
      }
    }
    await getAllDevices(req as any, res as any)
    const tags = req.query.tags.split(',')
    expect(req.db.devices.getByTags).toHaveBeenCalledWith(tags, req.query.method, req.query.$top, req.query.$skip, req.tenantId)
    expect(statusSpy).toHaveBeenCalledWith(200)
  })

  it('should set status to 200 and get data as list', async () => {
    const deviceList = []
    const req = {
      query: {
        $count: null,
        tags: null,
        method: 'method',
        $top: 0,
        $skip: 0,
        status: null
      },
      tenantId: '',
      db: {
        devices:
        {
          get: jest.fn().mockReturnValue([])
        }
      }
    }
    await getAllDevices(req as any, res as any)
    expect(req.db.devices.get).toHaveBeenCalledWith(req.query.$top, req.query.$skip, req.tenantId)
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(jsonSpy).toHaveBeenCalledWith(deviceList)
  })

  it('should set status to 500 if error occurs', async () => {
    const req = {
      query: {
        $count: null,
        tags: null,
        method: 'method',
        $top: 0,
        $skip: 0,
        status: null
      },
      db: {
        devices:
        {
          get: jest.fn().mockImplementation(() => {
            throw new TypeError('fake error')
          })
        }
      }
    }
    const logSpy = jest.spyOn(logger, 'error')
    await getAllDevices(req as any, res as any)
    expect(statusSpy).toHaveBeenCalledWith(500)
    expect(logSpy).toHaveBeenCalled()
  })

  describe('hostname get', () => {
    const req = {
      query: {
        hostname: 'test'
      },
      tenantId: '',
      db: {
        devices: {
          getById: () => {}
        }
      }
    } as any
    const logSpy = jest.spyOn(logger, 'error')

    it('should set status to 200 and get result if device exists in DB', async () => {
      req.db.devices.getByHostname = jest.fn().mockReturnValue([{}])
      await getAllDevices(req, res as any)
      expect(req.db.devices.getByHostname).toHaveBeenCalledWith(req.query.hostname, req.tenantId)
      expect(statusSpy).toHaveBeenCalledWith(200)
      expect(jsonSpy).toHaveBeenCalledWith([{}])
      expect(endSpy).toHaveBeenCalled()
    })

    it('should set status to 404 if device does not exist in DB', async () => {
      req.db.devices.getByHostname = jest.fn().mockReturnValue([])
      await getAllDevices(req, res as any)
      expect(req.db.devices.getByHostname).toHaveBeenCalledWith(req.query.hostname, req.tenantId)
      expect(statusSpy).toHaveBeenCalledWith(200)
      expect(jsonSpy).toHaveBeenCalledWith([])
      expect(endSpy).toHaveBeenCalled()
    })

    it('should set status to 500 if error occurs while getting device from DB', async () => {
      req.db.devices.getByHostname = jest.fn().mockImplementation(() => {
        throw new TypeError('fake error')
      })
      await getAllDevices(req, res as any)
      expect(req.db.devices.getByHostname).toHaveBeenCalledWith(req.query.hostname, req.tenantId)
      expect(statusSpy).toHaveBeenCalledWith(500)
      expect(jsonSpy).not.toHaveBeenCalled()
      expect(endSpy).toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalled()
    })
  })
})
