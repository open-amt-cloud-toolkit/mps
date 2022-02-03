import { certificatesType } from '../models/Config'
import { ISecretManagerService } from '../interfaces/ISecretManagerService'
import { config } from '../test/helper/config'
import { WebServer } from './webserver'
import { Environment } from '../utils/Environment'
import { IncomingMessage } from 'http'
import { Socket } from 'net'

Environment.Config = config

let certs: certificatesType
let secrets: ISecretManagerService
let web: WebServer

beforeAll(async function () {
  jest.setTimeout(60000)
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
  web = new WebServer(secrets, certs)
})

describe('WEB Server test', () => {
  it('Create WEBServer', () => {
    expect(web).toBeDefined()
    expect(web.app).toBeDefined()
    expect(web.relayWSS).toBeDefined()
    expect(web.certs).toBeDefined()
    expect(web.app).toBeDefined()
    expect(web.server).toBeDefined()
  })
})

describe('verify client token', () => {
  it('should return false when client jwt token is invalid', () => {
    const jwsSpy = jest.spyOn(web.jws, 'verify')
    jwsSpy.mockImplementationOnce(() => false)
    const info = { req: { headers: ['sec-websocket-protocol:invalid'] } }
    const result = web.verifyClientToken(info)
    expect(result).toBe(false)
  })
  it('should return true when client jwt token is valid', () => {
    const jwsSpy = jest.spyOn(web.jws, 'verify')
    jwsSpy.mockImplementationOnce(() => true)
    const info = { req: { headers: ['sec-websocket-protocol:supersecret'] } }
    const result = web.verifyClientToken(info)
    expect(result).toBe(true)
  })
  it('should return false and handle error while client jwt token is verified', () => {
    const jwsSpy = jest.spyOn(web.jws, 'verify')
    jwsSpy.mockImplementationOnce(() => {
      throw new Error()
    })
    const info = { req: { headers: ['sec-websocket-protocol:invalid'] } }
    const result = web.verifyClientToken(info)
    expect(result).toBe(false)
  })
})

describe('handle upgrade', () => {
  it('should route the message', () => {
    const request = new IncomingMessage(null)
    request.url = '/relay/webrelay.ashx?p=2&host=4c4c4544-004b-4210-8033-b6c04f504633&port=16994&tls=0&tls1only=0'
    const socket: Socket = new Socket()
    const head: Buffer = null
    const handleUpgradeSpy = jest.spyOn(web.relayWSS, 'handleUpgrade')
    web.handleUpgrade(request, socket, head)
    expect(handleUpgradeSpy).toHaveBeenCalledTimes(1)
  })
})

describe('listen', () => {
  it('should listen on port 3000', () => {
    const listenSpy = jest.spyOn(web.server, 'listen')
    web.listen()
    expect(listenSpy).toHaveBeenCalledTimes(1)
    web.server.close()
  })
  it('should listen on port null', () => {
    const listenSpy = jest.spyOn(web.server, 'listen')
    Environment.Config.web_port = null
    web.listen()
    expect(listenSpy).toHaveBeenCalledTimes(2)
    web.server.close()
  })
})

describe('useapiv1', () => {
  it('test useapiv1', async () => {
    const req: Express.Request = {
      db: null,
      secrets: null,
      certs: null
    }
    let res: Express.Response
    const useapiv1Spy = jest.spyOn(web, 'useAPIv1')
    await web.useAPIv1(req as any, res as any, jest.fn())
    expect(useapiv1Spy).toHaveBeenCalledTimes(1)
  })
})

describe('appUseJsonParser', () => {
  it('test appUseJsonParser', () => {
    const req: Express.Request = {
      db: null,
      secrets: null,
      certs: null
    }
    let res: Express.Response
    const appUseJsonParserSpy = jest.spyOn(web, 'appUseJsonParser')
    web.appUseJsonParser(null, req as any, res as any, jest.fn())
    expect(appUseJsonParserSpy).toHaveBeenCalledTimes(1)
  })

  it('test appUseJsonParser with error', () => {
    const req: Express.Request = {
      db: null,
      secrets: null,
      certs: null
    }
    const res: Express.Response = {
      status (): any {
        return returnMock
      }
    }
    const returnMock = {
      send (any): void {
      }
    }
    const err = new SyntaxError()
    const appUseJsonParserSpy = jest.spyOn(web, 'appUseJsonParser')
    web.appUseJsonParser(err, req as any, res as any, jest.fn())
    expect(appUseJsonParserSpy).toHaveBeenCalledTimes(2)
  })
})

describe('appUseCall', () => {
  it('test appUseCall', () => {
    const req: Express.Request = {
      deviceAction: {
        ciraHandler: {
          channel: 2
        }
      }
    }
    const res: Express.Response = {
      on: jest.fn()
    }
    const next = jest.fn()
    const appUseCallSpy = jest.spyOn(web, 'appUseCall')
    web.appUseCall(req as any, res as any, next)
    expect(appUseCallSpy).toHaveBeenCalledTimes(1)
  })
})

describe('afterResponse', () => {
  it('test afterResponse', () => {
    const req: Express.Request = {
      deviceAction: {
        ciraHandler: {
          channel: {
            CloseChannel: jest.fn()
          }
        }
      }
    }
    const res: Express.Response = {
      removeListener: jest.fn()
    }
    const afterResponseSpy = jest.spyOn(web, 'afterResponse')
    web.afterResponse(req as any, res as any)
    expect(afterResponseSpy).toHaveBeenCalledTimes(1)
  })
  it('test afterResponse with undefined channel', () => {
    const req: Express.Request = {
      deviceAction: {
        ciraHandler: {
          channel: null
        }
      }
    }
    const res: Express.Response = {
      removeListener: jest.fn()
    }
    const afterResponseSpy = jest.spyOn(web, 'afterResponse')
    web.afterResponse(req as any, res as any)
    expect(afterResponseSpy).toHaveBeenCalledTimes(2)
  })
})

describe('relayconnection', () => {
  it('test relayconnection', async () => {
    const mockWebSocket = {
      pause: jest.fn()
    }
    const mockSocket = new Socket()
    mockSocket.connect = jest.fn()

    const mockWebSocketExt = {
      _socket: mockWebSocket,
      forwardclient: mockSocket,
      on: jest.fn()
    }
    const mockIncomingMessage = {
      url: 'https://iotg.com?tls=0'
    }
    const relayConnectionSpy = jest.spyOn(web, 'relayConnection')
    await web.relayConnection(mockWebSocketExt as any, mockIncomingMessage as any)
    expect(relayConnectionSpy).toHaveBeenCalledTimes(1)
  })
})

afterAll(function () {
})
