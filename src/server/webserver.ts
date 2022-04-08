/*********************************************************************
* Copyright (c) Intel Corporation 2018-2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

/**
* @description Intel AMT Web server object
* @author Ylian Saint-Hilaire
* @version v0.2.0c
*/

import { Socket } from 'net'

import express, { NextFunction, Request, Response } from 'express'
import { createServer, IncomingMessage, Server } from 'http'
import * as parser from 'body-parser'
import jws from 'jws'
import { certificatesType } from '../models/Config'
import { ErrorResponse } from '../utils/amtHelper'
import { logger, messages } from '../logging'
import routes from '../routes'
import WebSocket from 'ws'
import { URL } from 'url'
import cors from 'cors'
import { DbCreatorFactory } from '../factories/DbCreatorFactory'
import { Environment } from '../utils/Environment'
import { ISecretManagerService } from '../interfaces/ISecretManagerService'
import { WsRedirect } from '../utils/wsRedirect'
import { devices } from './mpsserver'

export class WebServer {
  app: express.Express
  server: Server = null
  relayWSS: WebSocket.Server = null
  secrets: ISecretManagerService
  certs: certificatesType
  // to unit test code
  jws: jws = jws

  constructor (secrets: ISecretManagerService, certs: certificatesType) {
    try {
      this.secrets = secrets
      this.certs = certs
      this.app = express()

      const options: WebSocket.ServerOptions = {
        noServer: true,
        verifyClient: (info) => this.verifyClientToken(info)
      }
      this.relayWSS = new WebSocket.Server(options)

      // Create Server
      this.server = createServer(this.app)
      this.app.use(cors())

      // Handles the Bad JSON exceptions
      this.app.use(parser.json(), this.appUseJsonParser.bind(this))
      this.app.use(this.appUseCall.bind(this))
      // Relay websocket. KVM & SOL use this websocket.
      this.relayWSS.on('connection', this.relayConnection.bind(this))

      this.app.use('/api/v1', this.useAPIv1.bind(this), routes)

      // Handle upgrade on websocket
      this.server.on('upgrade', this.handleUpgrade.bind(this))
    } catch (error) {
      logger.error(`${messages.WEBSERVER_EXCEPTION}: ${error}`)
      process.exit(0)
    }
  }

  appUseJsonParser (err: any, req: Request, res: Response, next: () => void): any {
    if (err instanceof SyntaxError) {
      return res.status(400).send(ErrorResponse(400))
    } else {
      logger.debug(messages.APP_USE_JSON_PARSER_ERROR)
    }
    next()
  }

  appUseCall (req: Request, res: Response, next: NextFunction): void {
    res.on('finish', this.afterResponse.bind(this, req, res))
    res.on('close', this.afterResponse.bind(this, req, res))
    next()
  }

  afterResponse (req: Request, res: Response): void {
    if (req.deviceAction?.ciraHandler?.channel) {
      logger.debug(messages.EOR_CLOSING_CHANNEL)
      req.deviceAction.ciraHandler.channel.CloseChannel()
    }
    res.removeListener('finish', this.afterResponse)
    res.removeListener('close', this.afterResponse)
    // actions after response
  }

  async relayConnection (ws: WebSocket, req: IncomingMessage): Promise<void> {
    try {
      const wsRedirect = new WsRedirect(ws, this.secrets)
      await wsRedirect.handleConnection(req)
    } catch (err) {
      logger.error(`${messages.EXCEPTION_CAUGHT}: `, err)
    }
  }

  async useAPIv1 (req: Request, res: Response, next: NextFunction): Promise<void> {
    const newDB = new DbCreatorFactory()
    req.db = await newDB.getDb()
    req.secrets = this.secrets
    req.certs = this.certs
    next()
  }

  listen (): void {
    // Validate port number
    let port = 3000
    if (Environment.Config.web_port != null) {
      port = Environment.Config.web_port
    } else {
      logger.debug(messages.WEB_PORT_NULL)
    }

    this.server.listen(port, () => {
      logger.info(`${messages.MPS_RUNNING_ON} ${Environment.Config.common_name}:${port}.`)
    }).on('error', function (err: NodeJS.ErrnoException) {
      if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
        logger.error(messages.WEB_PORT_INVALID)
      } else {
        logger.error(JSON.stringify(err))
      }
      process.exit(0)
    })
  }

  // Handle Upgrade - WebSocket
  handleUpgrade (request: IncomingMessage, socket: Socket, head: Buffer): void {
    const pathname = (new URL(request.url, 'http://dummy.com')).pathname
    if (pathname === '/relay/webrelay.ashx') {
      this.relayWSS.handleUpgrade(request, socket, head, (ws) => {
        this.relayWSS.emit('connection', ws, request)
      })
    } else { // Invalid endpoint
      logger.debug(messages.ROUTE_DOES_NOT_EXIST)
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
    }
  }

  verifyClientToken (info): boolean {
    // verify JWT
    try {
      const valid = this.jws.verify(info.req.headers['sec-websocket-protocol'], 'HS256', Environment.Config.jwt_secret)
      if (!valid) {
        return false
      }
    } catch (err) { // reject connection if problem with verify
      return false
    }
    // Test if device has an established KVM session
    const startIndex = info.req.url.indexOf('host=')
    const guid = info.req.url.substring(startIndex + 5, startIndex + 5 + 36)
    if (devices[guid]?.kvmConnect) {
      return false
    } else if (devices[guid] != null) {
      devices[guid].kvmConnect = true
      return true
    } else {
      return false
    }
  }
}
