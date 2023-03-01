/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { getDevice } from './get'
import { logger } from '../../logging'

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

describe('guid get', () => {
  const req = {
    tenantId: 'tenantxyz',
    params: {
      guid: '00000000-0000-0000-0000-000000000000'
    },
    query: {
      tenantId: ''
    },
    db: {
      devices: {
        getById: () => {}
      }
    }
  } as any
  const logSpy = jest.spyOn(logger, 'error')

  it('should set status to 200 and get result if device exists in DB with tenant', async () => {
    req.db.devices.getById = jest.fn().mockReturnValue({
      guid: '00000000-0000-0000-0000-000000000000',
      hostname: 'hostname',
      tags: [],
      mpsusername: 'admin',
      tenantId: 'tenantxyz'
    })
    await getDevice(req, res as any)
    expect(req.db.devices.getById).toHaveBeenCalledWith(req.params.guid)
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(jsonSpy).not.toHaveBeenCalledWith(null)
    expect(endSpy).toHaveBeenCalled()
  })

  it('should set status to 204 and get result if device exists in DB', async () => {
    req.db.devices.getById = jest.fn().mockReturnValue({})
    await getDevice(req, res as any)
    expect(req.db.devices.getById).toHaveBeenCalledWith(req.params.guid)
    expect(statusSpy).toHaveBeenCalledWith(204)
    expect(jsonSpy).not.toHaveBeenCalledWith(null)
    expect(endSpy).toHaveBeenCalled()
  })

  it('should set status to 404 if device does not exist in DB', async () => {
    req.db.devices.getById = jest.fn().mockReturnValue(null)
    await getDevice(req, res as any)
    expect(req.db.devices.getById).toHaveBeenCalledWith(req.params.guid)
    expect(statusSpy).toHaveBeenCalledWith(404)
    expect(jsonSpy).not.toHaveBeenCalled()
    expect(endSpy).toHaveBeenCalled()
  })

  it('should set status to 500 if error occurs while getting device from DB', async () => {
    req.db.devices.getById = jest.fn().mockImplementation(() => {
      throw new TypeError('fake error')
    })
    await getDevice(req, res as any)
    expect(req.db.devices.getById).toHaveBeenCalledWith(req.params.guid)
    expect(statusSpy).toHaveBeenCalledWith(500)
    expect(jsonSpy).not.toHaveBeenCalled()
    expect(endSpy).toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalled()
  })

  it('should set status to 204 and get tenantId from req.query', async () => {
    req.tenantId = ''
    req.query.tenantId = 'test'

    req.db.devices.getById = jest.fn().mockReturnValue({
      guid: '00000000-0000-0000-0000-000000000000',
      hostname: 'hostname',
      tags: [],
      mpsusername: 'admin',
      tenantId: 'tenantxyz'
    })
    await getDevice(req, res as any)
    expect(req.db.devices.getById).toHaveBeenCalledWith(req.params.guid)
    expect(statusSpy).toHaveBeenCalledWith(204)
    expect(jsonSpy).not.toHaveBeenCalledWith(null)
    expect(endSpy).toHaveBeenCalled()
  })
})
