/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { logger, messages } from '../../logging'
import { devices } from '../../server/mpsserver'
import { refreshDevice } from './refresh'

describe('refresh tests', () => {
  let res: Express.Response
  let statusSpy: jest.SpyInstance
  let jsonSpy: jest.SpyInstance
  let getCredsSpy: jest.SpyInstance
  let req
  beforeEach(() => {
    res = {
      status: () => res,
      json: () => res,
      end: () => res
    }

    statusSpy = jest.spyOn(res as any, 'status')
    jsonSpy = jest.spyOn(res as any, 'json')

    req = {
      body: {
        guid: '00000000-0000-0000-0000-000000000000'
      },
      secrets: {
        getSecretFromKey: async (path: string, key: string) => 'P@ssw0rd',
        getSecretAtPath: async (path: string) => ({} as any),
        getAMTCredentials: async (path: string) => ['admin', 'P@ssw0rd'],
        getMPSCerts: async () => ({} as any),
        writeSecretWithObject: async (path: string, data: any) => false,
        health: async () => ({}),
        deleteSecretAtPath: async (path: string) => { }
      }
    } as any
    getCredsSpy = jest.spyOn(req.secrets, 'getAMTCredentials')
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  it('should refresh device if it is connected', async () => {
    const guid = req.body.guid
    devices[guid] = {
      ciraSocket: {
        destroy: jest.fn()
      },
      httpHandler: { digestChallenge: 'dumy' },
      tenantId: { tenantId: '' },
      kvmConnect: { kvmConnect: false },
      limiter: { limiter: 'dummy' }
    } as any
    await refreshDevice(req, res as any)
    expect(getCredsSpy).toHaveBeenCalledWith(guid)
    expect(jsonSpy).toHaveBeenCalledWith({ success: 200, description: `${messages.DEVICE_REFRESH_SUCCESS} : ${guid}` })
  })

  it('should set status to 404 if error occurs when device is not connected', async () => {
    const guid = req.body.guid
    devices[guid] = null

    await refreshDevice(req, res as any)
    expect(statusSpy).toHaveBeenCalledWith(404)
  })
  it('should set status to 500', async () => {
    req.secrets = {
      getAMTCredentials: async (path: string) => null
    }

    const guid = req.body.guid
    devices[guid] = {
      ciraSocket: {
        destroy: jest.fn()
      },
      httpHandler: { digestChallenge: 'dumy' },
      tenantId: { tenantId: '' },
      kvmConnect: { kvmConnect: false },
      limiter: { limiter: 'dummy' }
    } as any
    const loggerSpy = jest.spyOn(logger, 'error')
    await refreshDevice(req, res as any)
    expect(statusSpy).toHaveBeenCalledWith(500)
    expect(loggerSpy).toHaveBeenCalled()
  })
})
