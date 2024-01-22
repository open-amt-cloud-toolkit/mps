/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import jws from 'jws'
import { createSpyObj } from '../../test/helper/jest.js'
import { Environment } from '../../utils/Environment.js'
import { jest } from '@jest/globals'
import { spyOn } from 'jest-mock'
let expressValidatorMockReturnValue = true
jest.unstable_mockModule('express-validator', () => ({
  validationResult: () => ({
    isEmpty: jest.fn().mockReturnValue(expressValidatorMockReturnValue),
    array: jest.fn().mockReturnValue([{ test: 'error' }])
  } as any)
}))
const login = await import('./login.js')

describe('Check login', () => {
  let resSpy
  let req

  beforeEach(() => {
    expressValidatorMockReturnValue = true
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = {
      body: {
        username: 'admin',
        password: 'Passw0rd'
      }
    }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()
    // spyOn(val, 'validationResult').mockImplementation(() => ({
    //   isEmpty: jest.fn().mockReturnValue(true),
    //   array: jest.fn().mockReturnValue([{ test: 'error' }])
    // } as any))
    Environment.Config = {
      web_admin_user: 'admin',
      web_admin_password: 'Passw0rd',
      jwt_expiration: 1440,
      jwt_issuer: 'fake',
      jwt_secret: 'my_secret'
    } as any
  })
  it('should fail when auth disabled', async () => {
    Environment.Config.web_auth_enabled = false
    await login.login(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(405)
  })
  it('should pass with correct user and password', async () => {
    Environment.Config.web_auth_enabled = true
    Environment.Config.web_admin_user = 'admin'
    Environment.Config.web_admin_password = 'Passw0rd'
    await login.login(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
  })
  it('should fail with incorrect user', async () => {
    Environment.Config.web_auth_enabled = true
    Environment.Config.web_admin_user = 'fake'
    Environment.Config.web_admin_password = 'Passw0rd'
    await login.login(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(401)
  })
  it('should pass with lowercase user', async () => {
    Environment.Config.web_auth_enabled = true
    Environment.Config.web_admin_user = 'ADMIN'
    req = {
      body: {
        username: 'admin',
        password: 'Passw0rd'
      }
    }
    await login.login(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
  })
  it('should pass with uppercase user', async () => {
    Environment.Config.web_auth_enabled = true
    req = {
      body: {
        username: 'ADMIN',
        password: 'Passw0rd'
      }
    }
    await login.login(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
  })
  it('should pass with expected expiration', async () => {
    Environment.Config.web_auth_enabled = true
    spyOn(global.Date, 'now').mockImplementation(() => new Date('2019-05-14T11:01:58.135Z').valueOf())
    const expiration = Math.floor((Date.now() + (1000 * 60 * Environment.Config.jwt_expiration)) / 1000)
    const expected = {
      payload: {
        exp: expiration
      }
    }
    resSpy.send.mockImplementation((responseData) => {
      expect(responseData.token).toBeDefined()
      const decodedToken = jws.decode(responseData.token)
      expect(decodedToken.payload.exp).toEqual(expected.payload.exp)
    })
    await login.login(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.send).toHaveBeenCalled()
  })
  it('should pass with correct issuer', async () => {
    Environment.Config.web_auth_enabled = true
    const expected = {
      payload: {
        iss: 'fake'
      }
    }
    resSpy.send.mockImplementation((responseData) => {
      expect(responseData.token).toBeDefined()
      const decodedToken = jws.decode(responseData.token)
      expect(decodedToken.payload.iss).toEqual(expected.payload.iss)
    })

    await login.login(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.send).toHaveBeenCalled()
  })
  it('should fail with incorrect password', async () => {
    Environment.Config.web_auth_enabled = true
    Environment.Config.web_admin_password = 'Passw0rdFake'
    await login.login(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(401)
  })
  it('should fail with incorrect req', async () => {
    expressValidatorMockReturnValue = false
    await login.login(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(400)
  })
})
