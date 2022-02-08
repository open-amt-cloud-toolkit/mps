/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { certificatesType } from '../models/Config'
import { devices, MPSServer } from './mpsserver'
import { ISecretManagerService } from '../interfaces/ISecretManagerService'
import { Device } from '../models/models'
import { IDeviceTable } from '../interfaces/IDeviceTable'
import { IDB } from '../interfaces/IDb'
import { Environment } from '../utils/Environment'
import { logger } from '../logging'
import APFProcessor from '../amt/APFProcessor'

let certs: certificatesType
let db: IDB
let devicesMock: IDeviceTable
let secrets: ISecretManagerService
let mps: MPSServer

describe('MPS Server', function () {
  let deviceSpy: jest.SpyInstance
  let deviceUpdateSpy: jest.SpyInstance
  let processCommandSpy: jest.SpyInstance
  let getSecretSpy: jest.SpyInstance
  let getCredsSpy: jest.SpyInstance
  let sendUserAuthSpy: jest.SpyInstance
  let sendUserAuthFailSpy: jest.SpyInstance
  let socket
  beforeEach(async function () {
    jest.setTimeout(60000)
    const device = { mpsusername: 'admin' }
    devicesMock = {
      get: async () => { return [] as Device[] },
      getCount: async () => { return 0 },
      getDistinctTags: async () => { return ['tag'] },
      getByName: async (guid) => { return device as Device },
      getByTags: async (tags) => { return [device] as Device[] },
      clearInstanceStatus: async () => {},
      delete: async (guid) => { return true },
      insert: async (device) => { return device },
      update: async () => { return device as Device }
    }

    db = {
      devices: devicesMock,
      query: async (text, params): Promise<any> => {

      }
    }
    secrets = {
      getSecretFromKey: async (path: string, key: string) => { return 'P@ssw0rd' },
      getSecretAtPath: async (path: string) => { return {} as any },
      getAMTCredentials: async (path: string) => { return ['admin', 'P@ssw0rd'] },
      health: async () => { return {} }
    }
    certs = {
      mps_tls_config: {} as any,
      web_tls_config: {} as any
    }
    deviceSpy = jest.spyOn(devicesMock, 'getByName')
    deviceUpdateSpy = jest.spyOn(devicesMock, 'update')
    getSecretSpy = jest.spyOn(secrets, 'getSecretFromKey')
    getCredsSpy = jest.spyOn(secrets, 'getAMTCredentials')
    sendUserAuthSpy = jest.spyOn(APFProcessor, 'SendUserAuthSuccess').mockReturnValue(null)
    sendUserAuthFailSpy = jest.spyOn(APFProcessor, 'SendUserAuthFail').mockReturnValue(null)
    processCommandSpy = jest.spyOn(APFProcessor, 'processCommand').mockResolvedValue(0)
    socket = {
      tag: { SystemId: '123' },
      end: jest.fn(),
      write: jest.fn(),
      setEncoding: jest.fn(),
      setTimeout: jest.fn(),
      on: jest.fn(),
      addListener: jest.fn(),
      getPeerCertificate: jest.fn()
    } as any
    delete devices['123']
    mps = new MPSServer(certs, db, secrets)
  })
  it('should initialize', () => {
    expect(mps.certs).toBeDefined()
    expect(mps.secrets).toBeDefined()
    expect(mps.db).toBeDefined()
    expect(mps.server).toBeDefined()
    expect(mps.events).toBeDefined()
    expect(true).toBeTruthy()
  })
  it('should listen on configured port', () => {
    const listenSpy = jest.spyOn(mps.server, 'listen').mockReturnValue(null)
    Environment.Config = { port: 3000 } as any
    mps.listen()
    expect(listenSpy).toHaveBeenCalledWith(3000, mps.listeningListener)
  })
  it('should log what port the server is listening on', () => {
    const infoSpy = jest.spyOn(logger, 'info')
    Environment.Config = { common_name: 'localhost', port: 3000 } as any
    mps.listeningListener()
    expect(infoSpy).toHaveBeenCalledWith('Intel(R) AMT server running on localhost:3000.')
  })
  it('should handle onAPFDisconnected', async () => {
    const deviceDisconnectSpy = jest.spyOn(mps, 'handleDeviceDisconnect').mockResolvedValue(null)
    const emitSpy = jest.spyOn(mps.events, 'emit')
    devices['123'] = { device: 'a device' } as any
    await mps.onAPFDisconnected('123')
    expect(devices['123']).toBeUndefined()
    expect(deviceDisconnectSpy).toHaveBeenCalledWith('123')
    expect(emitSpy).toHaveBeenCalledWith('disconnected', '123')
  })
  it('should allow device to connect if exists in db', async () => {
    await mps.onAPFProtocolVersion(socket)
    expect(deviceSpy).toHaveBeenCalledWith('123')
  })
  it('should not allow device to connect if exists in db', async () => {
    deviceSpy = jest.spyOn(devicesMock, 'getByName').mockResolvedValue(null)
    const endSpy = jest.spyOn(socket, 'end')
    await mps.onAPFProtocolVersion(socket)
    expect(deviceSpy).toHaveBeenCalledWith('123')
    expect(endSpy).toHaveBeenCalled()
  })
  it('should verify user auth when valid', async () => {
    const deviceConnectSpy = jest.spyOn(mps, 'handleDeviceConnect').mockResolvedValue(null)
    await mps.onVerifyUserAuth(socket, 'admin', 'P@ssw0rd')
    expect(deviceSpy).toHaveBeenCalledWith('123')
    expect(getSecretSpy).toHaveBeenCalledWith('devices/123', 'MPS_PASSWORD')
    expect(getCredsSpy).toHaveBeenCalledWith('123')
    expect(devices['123']).toBeDefined()
    expect(deviceConnectSpy).toHaveBeenCalledWith('123')
    expect(sendUserAuthSpy).toHaveBeenCalledWith(socket)
  })
  it('should NOT verify user auth when NOT valid', async () => {
    const deviceConnectSpy = jest.spyOn(mps, 'handleDeviceConnect').mockResolvedValue(null)
    await mps.onVerifyUserAuth(socket, 'admin', 'WrongP@ssw0rd')
    expect(deviceSpy).toHaveBeenCalled()
    expect(getSecretSpy).toHaveBeenCalled()
    expect(getCredsSpy).not.toHaveBeenCalled()
    expect(devices['123']).toBeUndefined()
    expect(deviceConnectSpy).not.toHaveBeenCalled()
    expect(sendUserAuthFailSpy).toHaveBeenCalledWith(socket)
  })
  it('should NOT verify user auth valid but vault call fails', async () => {
    const deviceConnectSpy = jest.spyOn(mps, 'handleDeviceConnect').mockResolvedValue(null)
    getCredsSpy.mockRejectedValue(new Error('unknown'))
    await mps.onVerifyUserAuth(socket, 'admin', 'P@ssw0rd')
    expect(deviceSpy).toHaveBeenCalled()
    expect(getSecretSpy).toHaveBeenCalled()
    expect(getCredsSpy).toHaveBeenCalledWith('123')
    expect(devices['123']).toBeUndefined()
    expect(deviceConnectSpy).not.toHaveBeenCalledWith('123')
    expect(sendUserAuthFailSpy).toHaveBeenCalledWith(socket)
  })
  it('should connect with TLS', () => {
    const addHandlersSpy = jest.spyOn(mps, 'addHandlers').mockReturnValue(null)
    delete socket.tag
    mps.onTLSConnection(socket)
    expect(socket.tag).toBeDefined()
    expect(addHandlersSpy).toHaveBeenCalledWith(socket)
  })
  it('should add handlers', () => {
    const setEncodingSpy = jest.spyOn(socket, 'setEncoding')
    const setTimeoutSpy = jest.spyOn(socket, 'setTimeout')
    const onSpy = jest.spyOn(socket, 'on')
    const addListenerSpy = jest.spyOn(socket, 'addListener')
    mps.addHandlers(socket)
    expect(setEncodingSpy).toHaveBeenCalled()
    expect(setTimeoutSpy).toHaveBeenCalled()
    expect(onSpy).toHaveBeenCalled()
    expect(addListenerSpy).toHaveBeenCalledTimes(3)
  })
  it('should disconnect on timeout', async () => {
    const endSpy = jest.spyOn(socket, 'end')
    const deviceDisconnectSpy = jest.spyOn(mps, 'handleDeviceDisconnect').mockResolvedValue(null)
    await mps.onTimeout(socket)
    expect(endSpy).toHaveBeenCalled()
    expect(deviceDisconnectSpy).toHaveBeenCalledWith('123')
  })
  it('should do nothing data when not much is received', async () => {
    const endSpy = jest.spyOn(socket, 'end')
    socket.tag.accumulator = ''
    socket.tag.first = true
    await mps.onDataReceived(socket, 'A')
    expect(endSpy).not.toHaveBeenCalled()
    expect(processCommandSpy).not.toHaveBeenCalled()
  })
  it('should NOT process data when HTTP request received', async () => {
    const endSpy = jest.spyOn(socket, 'end')
    socket.tag.accumulator = ''
    socket.tag.first = true
    await mps.onDataReceived(socket, 'GET')
    expect(endSpy).toHaveBeenCalled()
    expect(processCommandSpy).not.toHaveBeenCalled()
  })
  it('should process data when data received', async () => {
    const endSpy = jest.spyOn(socket, 'end')
    socket.tag.accumulator = ''
    socket.tag.first = true
    await mps.onDataReceived(socket, 'data')
    expect(processCommandSpy).toHaveBeenCalledWith(socket)
    expect(endSpy).not.toHaveBeenCalled()
  })
  it('should continue process data when data received ', async () => {
    const length = 9
    let callCount = 0
    processCommandSpy = jest.spyOn(APFProcessor, 'processCommand').mockImplementation(async () => {
      if (callCount === 0) {
        callCount++
        return length
      }
      return 0
    })
    const endSpy = jest.spyOn(socket, 'end')
    socket.tag.accumulator = ''
    socket.tag.first = true
    await mps.onDataReceived(socket, 'datadata')
    expect(processCommandSpy).toHaveBeenCalledWith(socket)
    expect(socket.tag.accumulator).toBe('')
    expect(endSpy).not.toHaveBeenCalled()
  })
  it('should end connection when unknown command', async () => {
    processCommandSpy = jest.spyOn(APFProcessor, 'processCommand').mockResolvedValue(-1)
    const endSpy = jest.spyOn(socket, 'end')
    socket.tag.accumulator = ''
    socket.tag.first = true
    await mps.onDataReceived(socket, 'data')
    expect(processCommandSpy).toHaveBeenCalledWith(socket)
    expect(endSpy).toHaveBeenCalled()
  })
  it('should disconnect on close', async () => {
    const deviceDisconnectSpy = jest.spyOn(mps, 'handleDeviceDisconnect').mockResolvedValue(null)
    await mps.onClose(socket)
    expect(deviceDisconnectSpy).toHaveBeenCalledWith('123')
  })
  it('should NOT log on error when ECONNRESET', () => {
    const errorLogSpy = jest.spyOn(logger, 'error')
    mps.onError(socket, { code: 'ECONNRESET' } as any)
    expect(errorLogSpy).not.toHaveBeenCalled()
  })
  it('should log on error when other error', () => {
    const errorLogSpy = jest.spyOn(logger, 'error')
    mps.onError(socket, { code: 'COOL ERROR' } as any)
    expect(errorLogSpy).toHaveBeenCalled()
  })
  it('should handle device disconnect', async () => {
    const emitSpy = jest.spyOn(mps.events, 'emit')
    devices['123'] = { device: 'a device' } as any
    await mps.handleDeviceDisconnect('123')
    expect(devices['123']).toBeUndefined()
    expect(deviceSpy).toHaveBeenCalledWith('123')
    expect(deviceUpdateSpy).toHaveBeenCalledWith({ connectionStatus: false, mpsInstance: null, mpsusername: 'admin' })
    expect(emitSpy).toHaveBeenCalledWith('disconnected', '123')
  })

  it('should handle device connect', async () => {
    devices['123'] = { device: 'a device' } as any
    Environment.Config = { instance_name: 'mpsInstance' } as any
    await mps.handleDeviceConnect('123')
    expect(deviceUpdateSpy).toHaveBeenCalledWith({ connectionStatus: true, mpsInstance: 'mpsInstance', mpsusername: 'admin' })
  })
})
