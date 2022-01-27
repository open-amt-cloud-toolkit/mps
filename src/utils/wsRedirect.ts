import { logger as log } from '../utils/logger'
import { IncomingMessage } from 'http'
import { queryParams } from '../models/Config'
import { devices } from '../server/mpsserver'
import { ISecretManagerService } from '../interfaces/ISecretManagerService'
import { RedirectInterceptor } from './redirectInterceptor'
import WebSocket from 'ws'
import { CIRAHandler } from '../amt/CIRAHandler'
import { CIRAChannel } from '../amt/CIRAChannel'

export class WsRedirect {
  secrets: ISecretManagerService
  interceptor: RedirectInterceptor
  websocketFromWeb: WebSocket
  websocketFromDevice: CIRAChannel // | Socket
  ciraHandler: CIRAHandler
  constructor (ws: WebSocket, secrets: ISecretManagerService) {
    this.secrets = secrets
    this.websocketFromWeb = ws
  }

  handleConnection = async (req: IncomingMessage): Promise<void> => {
    const reqQueryURL = new URL(req.url, 'http://dummy.com')
    const params: queryParams = {
      host: reqQueryURL.searchParams.get('host'),
      port: Number(reqQueryURL.searchParams.get('port')),
      p: Number(reqQueryURL.searchParams.get('p')),
      tls: Number(reqQueryURL.searchParams.get('tls')),
      tls1only: Number(reqQueryURL.searchParams.get('tls1only'))
    };

    (this.websocketFromWeb as any)._socket.pause()
    // console.log('Socket paused', ws._socket);

    // When data is received from the web socket, forward the data into the associated TCP connection.
    // If the TCP connection is pending, buffer up the data until it connects.
    this.websocketFromWeb.onmessage = this.handleMessage.bind(this)

    // If the web socket is closed, close the associated TCP connection.
    this.websocketFromWeb.onclose = this.handleClose.bind(this, params)

    // We got a new web socket connection, initiate a TCP connection to the target Intel AMT host/port.
    log.debug(`Opening web socket connection to ${params.host}: ${params.port}.`)

    // Fetch Intel AMT credentials & Setup interceptor
    const credentials = await this.secrets.getAMTCredentials(params.host)
    if (credentials != null) {
      this.createCredential(params, credentials)
    }

    if (params.tls === 0) {
      const device = devices[params.host]
      if (device != null) {
        this.ciraHandler = new CIRAHandler(device.httpHandler, device.username, device.password)
        this.setNormalTCP(params)
      }
    }
  }

  async handleMessage (msg: WebSocket.MessageEvent): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    let msgStr = msg.data.toString('binary')

    if (this.interceptor) {
      msgStr = this.interceptor.processBrowserData(msgStr)
    } // Run data thru interceptor
    await this.websocketFromDevice.writeData(msgStr) // Forward data to the associated TCP connection.
  }

  handleClose (params: queryParams, CloseEvent: WebSocket.CloseEvent): void {
    log.debug(`Closing web socket connection to  ${params.host}: ${params.port}.`)
    if (this.websocketFromDevice) {
      this.websocketFromDevice.CloseChannel()
    }
  }

  createCredential (params: queryParams, credentials: string[]): void {
    if (credentials != null) {
      log.debug('Creating credential')
      if (params.p === 2) {
        this.interceptor = new RedirectInterceptor({
          user: credentials[0],
          pass: credentials[1]
        })
      }
    }
  }

  setNormalTCP (params: queryParams): void {
    // If this is TCP (without TLS) set a normal TCP socket
    // check if this is MPS connection

    this.websocketFromDevice = this.ciraHandler.SetupCiraChannel(devices[params.host].ciraSocket, params.port)
    this.websocketFromDevice.write = null
    // this.websocketFromDevice.xtls = 0
    this.websocketFromDevice.onData = (data: any): void => {
      // Run data thru interceptor
      if (this.interceptor) {
        data = this.interceptor.processAmtData(data)
      }
      try {
        this.websocketFromWeb.send(data)
      } catch (e) {
        log.error(`Exception while forwarding data to client: ${e}`)
      }
    }

    this.websocketFromDevice.onStateChange.on('stateChange', (state: number) => {
      log.debug('Relay CIRA state change:' + state)
      if (state === 0) {
        try {
          log.debug('Closing websocket')
          this.websocketFromWeb.close()
        } catch (e) {
          log.error(`Exception while closing client websocket connection: ${e}`)
        }
      }
    });

    (this.websocketFromWeb as any)._socket.resume()
  }
}
