/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { WsRedirect } from './wsRedirect'
import { type queryParams } from '../models/Config'
import { RedirectInterceptor } from './redirectInterceptor'
import { devices } from '../server/mpsserver'
import { ConnectedDevice } from '../amt/ConnectedDevice'
import { Socket } from 'net'
import { MqttProvider } from './MqttProvider'
import { EventEmitter } from 'stream'

const fakeGuid = '00000000-0000-0000-0000-000000000000'

describe('WsRedirect tests', () => {
  const mockWebSocket = {
    _socket: {
      pause: jest.fn(),
      resume: jest.fn()
    }
  }
  let pauseSpy: jest.SpyInstance
  let resumeSpy: jest.SpyInstance
  let wsRedirect: WsRedirect

  beforeEach(() => {
    const secretManagerService = {
      getSecretFromKey: async (path: string, key: string) => 'P@ssw0rd',
      getSecretAtPath: async (path: string) => ({} as any),
      getAMTCredentials: async (path: string) => ['admin', 'P@ssw0rd'],
      getMPSCerts: async () => ({} as any),
      writeSecretWithObject: async (path: string, data: any) => false,
      deleteSecretAtPath: async (path: string) => { },
      health: async () => ({})
    }
    resumeSpy = jest.spyOn(mockWebSocket._socket, 'resume').mockReturnValue(null)
    pauseSpy = jest.spyOn(mockWebSocket._socket, 'pause').mockReturnValue(null)
    wsRedirect = new WsRedirect(mockWebSocket as any, secretManagerService)
  })

  describe('handleConnection tests', () => {
    it('should handle connection with TCP socket', async () => {
      const mockSocket = new Socket()
      mockSocket.connect = jest.fn()

      const mockIncomingMessage = {
        url: `https://iotg.com?tls=0&host=${fakeGuid}`
      }
      devices[fakeGuid] = new ConnectedDevice(null, 'admin', 'P@ssw0rd', '')

      const setNormalTCPSpy = jest.spyOn(wsRedirect, 'setNormalTCP').mockReturnValue()
      const publishEventSpy = jest.spyOn(MqttProvider, 'publishEvent')
      await wsRedirect.handleConnection(mockIncomingMessage as any)

      expect(setNormalTCPSpy).toBeCalled()
      expect(publishEventSpy).toHaveBeenCalled()
      expect(pauseSpy).toHaveBeenCalled()
    })
  })

  it('should handle message', () => {
    const message: any = { data: 'hello' }

    wsRedirect.websocketFromDevice = {
      writeData: jest.fn()
    } as any
    wsRedirect.interceptor = {
      processBrowserData: jest.fn()
    } as any
    const interceptorSpy = jest.spyOn(wsRedirect.interceptor, 'processBrowserData').mockReturnValue('binaryData')
    const writeSpy = jest.spyOn(wsRedirect.websocketFromDevice, 'writeData')
    void wsRedirect.handleMessage(message)

    expect(interceptorSpy).toBeCalledWith(message.data)
    expect(writeSpy).toBeCalledWith('binaryData')
  })

  describe('handleClose tests', () => {
    let params: queryParams
    let publishEventSpy

    beforeEach(() => {
      params = {
        host: 'localhost',
        port: 1111,
        mode: 'kvm' // default mode for testing
      } as any
      wsRedirect.websocketFromDevice = {
        CloseChannel: jest.fn()
      } as any
      devices[params.host] = { kvmConnect: true, iderConnect: true, solConnect: true } as any
      publishEventSpy = jest.spyOn(MqttProvider, 'publishEvent')
    })

    it('should handle close for KVM mode', () => {
      wsRedirect.handleClose(params, null)
      expect(publishEventSpy).toHaveBeenCalled()
      expect(wsRedirect.websocketFromDevice.CloseChannel).toBeCalled()
      expect(devices[params.host].kvmConnect).toBeFalsy()
    })

    it('should handle close for IDER mode', () => {
      params.mode = 'ider'
      wsRedirect.handleClose(params, null)
      expect(devices[params.host].iderConnect).toBeFalsy()
    })

    it('should handle close for SOL mode', () => {
      params.mode = 'sol'
      wsRedirect.handleClose(params, null)
      expect(devices[params.host].solConnect).toBeFalsy()
    })

    it('should do nothing if websocketFromDevice is not set', () => {
      wsRedirect.websocketFromDevice = null
      wsRedirect.handleClose(params, null)
      expect(publishEventSpy).toHaveBeenCalled()
    })
  })

  describe('createCredential tests', () => {
    it('should create credential for RedirectInterceptor', () => {
      const paramsWithPof2 = {
        p: 2
      }
      const credentials = ['joe blow', 'P@ssw0rd']

      wsRedirect.createCredential(paramsWithPof2 as any, credentials as any)
      expect(wsRedirect.interceptor).toBeInstanceOf(RedirectInterceptor)
      expect(wsRedirect.interceptor.args).toMatchObject({
        user: credentials[0],
        pass: credentials[1]
      })
    })

    it('should not create credential if none are passed in', () => {
      const paramsWithPof2 = {
        p: 2
      }
      const credentials = null

      wsRedirect.createCredential(paramsWithPof2 as any, credentials)
      expect(wsRedirect.interceptor).toBeFalsy()
    })

    it('should not create credential if any are missing', () => {
      const paramsWithPof2 = {
        p: 2
      }
      const credentials = ['test']

      wsRedirect.createCredential(paramsWithPof2 as any, credentials)
      expect(wsRedirect.interceptor).toBeFalsy()
    })

    it('should not create credential too many are passed in', () => {
      const paramsWithPof2 = {
        p: 2
      }
      const credentials = ['test1', 'test2', 'test3']

      wsRedirect.createCredential(paramsWithPof2 as any, credentials)
      expect(wsRedirect.interceptor).toBeFalsy()
    })
  })

  describe('setnormalTCP test', () => {
    it('should set normal tcp socket for mps connection', () => {
      const params: queryParams = {
        host: fakeGuid,
        port: 16994
      } as any
      const mockCiraChannel = {
        onData: jest.fn(),
        onStateChange: { on: jest.fn() },
        send: jest.fn()
      } as any
      wsRedirect.ciraHandler = {
        SetupCiraChannel: jest.fn()
      } as any
      wsRedirect.interceptor = {
        processBrowserData: jest.fn()
      } as any
      const setupCIRASpy = jest.spyOn(wsRedirect.ciraHandler, 'SetupCiraChannel').mockReturnValue(mockCiraChannel)

      wsRedirect.setNormalTCP(params)
      expect(setupCIRASpy).toHaveBeenCalled()
      expect(resumeSpy).toHaveBeenCalled()
    })

    it('should close websocket connection and set kvmConnect to false when cira state changes to 0', () => {
      devices[fakeGuid] = new ConnectedDevice(null, 'admin', 'P@ssw0rd', '')
      devices[fakeGuid].kvmConnect = true // Set kvmConnect to true
      const params: queryParams = {
        host: fakeGuid,
        port: 16994
      } as any
      const mockCiraChannel = {
        onData: jest.fn(),
        onStateChange: new EventEmitter(),
        send: jest.fn()
      } as any
      wsRedirect.ciraHandler = {
        SetupCiraChannel: jest.fn()
      } as any
      const setupCIRASpy = jest.spyOn(wsRedirect.ciraHandler, 'SetupCiraChannel').mockReturnValue(mockCiraChannel)

      wsRedirect.setNormalTCP(params)

      const onClose = jest.fn()
      wsRedirect.websocketFromWeb = { close: onClose } as any
      wsRedirect.websocketFromDevice.onStateChange.emit('stateChange', 0) // Emit stateChange event

      expect(setupCIRASpy).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
      expect(devices[fakeGuid].kvmConnect).toBe(false)
    })
  })
})
