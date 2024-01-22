/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { createSpyObj } from '../../test/helper/jest.js'
import { Environment } from '../../utils/Environment.js'
import { jest } from '@jest/globals'
import { spyOn } from 'jest-mock'

jest.unstable_mockModule('express-validator', () => ({
  validationResult: () => ({
    isEmpty: jest.fn().mockReturnValue(true),
    array: jest.fn().mockReturnValue([{ test: 'error' }])
  } as any)
}))
const auth = await import ('./authorizeDevice.js')

describe('Check login', () => {
  let resSpy
  let req

  beforeEach(() => {
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = {
      params: {
        guid: '4c4c4544-004b-4210-8033-b6c04f504633'
      },
      db: {
        devices: {
          getById: () => {}
        }
      }
    }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()
    Environment.Config = {
      web_admin_user: 'admin',
      web_admin_password: 'Passw0rd',
      jwt_expiration: 1440,
      jwt_issuer: 'fake',
      jwt_secret: 'my_secret',
      redirection_expiration_time: 5
    } as any
  })
  it('should fail with device does not exits', async () => {
    const query = spyOn(req.db.devices, 'getById')
    query.mockResolvedValueOnce(null)
    await auth.authorizeDevice(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(404)
  })
  it('should pass with a token', async () => {
    const device = {
      guid: '4c4c4544-004b-4210-8033-b6c04f504633',
      hostname: 'hostname',
      tags: null,
      mpsInstance: 'localhost',
      connectionStatus: false,
      mpsusername: 'admin',
      tenantId: null
    }
    const query = spyOn(req.db.devices, 'getById')
    query.mockResolvedValueOnce({ rows: [device], command: '', fields: null, rowCount: 0, oid: 0 })
    await auth.authorizeDevice(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
  })
})
