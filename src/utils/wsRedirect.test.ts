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
    const params: queryParams = {
      host: 'localhost',
      port: 1111
    } as any

    it('should handle close', () => {
      wsRedirect.websocketFromDevice = {
        CloseChannel: jest.fn()
      } as any
      devices[params.host] = {} as any
      jest.spyOn(wsRedirect.websocketFromDevice, 'CloseChannel')
      const publishEventSpy = jest.spyOn(MqttProvider, 'publishEvent')
      wsRedirect.handleClose(params, null)
      expect(publishEventSpy).toHaveBeenCalled()
      expect(wsRedirect.websocketFromDevice.CloseChannel).toBeCalled()
      expect(devices[params.host].kvmConnect).toBeFalsy()
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
  })
})
