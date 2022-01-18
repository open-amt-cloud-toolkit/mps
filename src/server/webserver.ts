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
import { connect } from 'tls'
import express, { Request } from 'express'
import { createServer, Server } from 'http'
import * as parser from 'body-parser'
import jws from 'jws'
import { certificatesType, queryParams } from '../models/Config'
import { ErrorResponse } from '../utils/amtHelper'
import { logger as log, logger } from '../utils/logger'
import { constants } from 'crypto'
// import AMTStackFactory from '../amt_libraries/amt-connection-factory'
import routes from '../routes'

import { CreateHttpInterceptor, CreateRedirInterceptor } from '../utils/interceptor'
import WebSocket from 'ws'
import { URL } from 'url'
import cors from 'cors'
import { DbCreatorFactory } from '../factories/DbCreatorFactory'
import { Environment } from '../utils/Environment'
import { ISecretManagerService } from '../interfaces/ISecretManagerService'
import { devices } from './mpsserver'

export class WebServer {
  app: express.Express
  server: Server = null
  relaywss: any = null
  secrets: ISecretManagerService
  certs: certificatesType

  constructor (secrets: ISecretManagerService, certs: certificatesType) {
    try {
      this.secrets = secrets
      this.certs = certs
      this.app = express()
      const options: WebSocket.ServerOptions = {
        noServer: true,
        verifyClient: (info) => {
          // verify JWT
          try {
            const valid = jws.verify(info.req.headers['sec-websocket-protocol'], 'HS256', Environment.Config.jwt_secret)
            if (!valid) {
              return false
            }
          } catch (err) { // reject connection if problem with verify
            return false
          }
          return true
        }
      }
      this.relaywss = new WebSocket.Server(options)

      // Create Server
      this.server = createServer(this.app)
      this.app.use(cors())

      // Handles the Bad JSON exceptions
      this.app.use(parser.json(), (err, req, res, next) => {
        if (err instanceof SyntaxError) {
          return res.status(400).send(ErrorResponse(400))
        }
        next()
      })
      this.app.use(function (req: Request, res, next) {
        const afterResponse = (): void => {
          if (req.deviceAction?.ciraHandler?.channel) {
            logger.debug('end of request, closing channel')
            req.deviceAction.ciraHandler.channel.CloseChannel()
          }
          res.removeListener('finish', afterResponse)
          res.removeListener('close', afterResponse)
          // actions after response
        }
        res.on('finish', afterResponse)
        res.on('close', afterResponse)
        next()
      })
      // Relay websocket. KVM & SOL use this websocket.
      this.relaywss.on('connection', async (ws, req) => {
        try {
          const reqQueryURL = new URL(req.url, 'http://dummy.com')
          const params: queryParams = {
            host: reqQueryURL.searchParams.get('host'),
            port: Number(reqQueryURL.searchParams.get('port')),
            p: Number(reqQueryURL.searchParams.get('p')),
            tls: Number(reqQueryURL.searchParams.get('tls')),
            tls1only: Number(reqQueryURL.searchParams.get('tls1only'))
          }
          ws._socket.pause()
          // console.log('Socket paused', ws._socket);

          // When data is received from the web socket, forward the data into the associated TCP connection.
          // If the TCP connection is pending, buffer up the data until it connects.
          ws.on('message', msg => {
            // Convert a buffer into a string, "msg = msg.toString('ascii');" does not work
            // var msg2 = "";
            // for (var i = 0; i < msg.length; i++) { msg2 += String.fromCharCode(msg[i]); }
            // msg = msg2;
            msg = msg.toString('binary')

            if (ws.interceptor) {
              msg = ws.interceptor.processBrowserData(msg)
            } // Run data thru interceptor
            ws.forwardclient.write(msg) // Forward data to the associated TCP connection.
          })

          // If the web socket is closed, close the associated TCP connection.
          ws.on('close', () => {
            log.debug(
              `Closing web socket connection to  ${params.host}: ${params.port}.`
            )
            if (ws.forwardclient) {
              if (ws.forwardclient.close) {
                ws.forwardclient.close()
              }
              try {
                if (ws.forwardclient.destroy) {
                  ws.forwardclient.destroy()
                }
              } catch (e) {
                log.error(`Exception while destroying AMT CIRA channel: ${e}`)
              }
            }
          })

          // We got a new web socket connection, initiate a TCP connection to the target Intel AMT host/port.
          log.debug(`Opening web socket connection to ${params.host}: ${params.port}.`)

          // Fetch Intel AMT credentials & Setup interceptor
          const credentials = await this.secrets.getAMTCredentials(params.host)
          if (credentials != null) {
            log.debug('Creating credential')
            if (params.p === 1) {
              ws.interceptor = CreateHttpInterceptor({
                host: params.host,
                port: params.port,
                user: credentials[0],
                pass: credentials[1]
              })
            } else if (params.p === 2) {
              ws.interceptor = CreateRedirInterceptor({
                user: credentials[0],
                pass: credentials[1]
              })
            }
          }

          if (params.tls === 0) {
            // If this is TCP (without TLS) set a normal TCP socket
            // check if this is MPS connection
            const uuid = params.host
            const ciraConn = devices[uuid]
            if (uuid && ciraConn) {
              // ws.forwardclient = ciraConn.ciraHandler.SetupCiraChannel(ciraConn.ciraSocket, params.port)

              ws.forwardclient.xtls = 0
              ws.forwardclient.onData = (data): void => {
                // Run data thru interceptor
                if (ws.interceptor) {
                  data = ws.interceptor.processAmtData(data)
                }
                try {
                  ws.send(data)
                } catch (e) {
                  log.error(`Exception while forwarding data to client: ${e}`)
                }
              }

              ws.forwardclient.onStateChange = (ciraconn, state): void => {
                // console.log('Relay CIRA state change:'+state);
                if (state === 0) {
                  try {
                    // console.log("Closing websocket.");
                    ws.close()
                  } catch (e) {
                    log.error(`Exception while closing client websocket connection: ${e}`)
                  }
                }
              }
              ws._socket.resume()
            } else {
              ws.forwardclient = new Socket()
              ws.forwardclient.setEncoding('binary')
              ws.forwardclient.forwardwsocket = ws
            }
          } else {
            // If TLS is going to be used, setup a TLS socket
            log.info('TLS Enabled!')
            const tlsoptions = {
              secureProtocol:
                params.tls1only === 1 ? 'TLSv1_method' : 'SSLv23_method',
              ciphers: 'RSA+AES:!aNULL:!MD5:!DSS',
              secureOptions:
                constants.SSL_OP_NO_SSLv2 |
                constants.SSL_OP_NO_SSLv3 |
                constants.SSL_OP_NO_COMPRESSION |
                constants.SSL_OP_CIPHER_SERVER_PREFERENCE,
              rejectUnauthorized: false
            }
            ws.forwardclient = connect(
              params.port,
              params.host,
              tlsoptions,
              () => {
                // The TLS connection method is the same as TCP, but located a bit differently.
                log.debug(`TLS connected to ${params.host}: ${params.port}.`)
                ws._socket.resume()
              }
            )
            ws.forwardclient.setEncoding('binary')
            ws.forwardclient.forwardwsocket = ws
          }

          // Add handlers to socket.
          if (ws.forwardclient instanceof Socket) {
            // When we receive data on the TCP connection, forward it back into the web socket connection.
            ws.forwardclient.on('data', data => {
              if (ws.interceptor) {
                data = ws.interceptor.processAmtData(data)
              } // Run data thru interceptor
              try {
                ws.send(data)
              } catch (e) {
                log.error(`Exception while forwarding data to client: ${e}`)
              }
            })

            // If the TCP connection closes, disconnect the associated web socket.
            ws.forwardclient.on('close', () => {
              log.debug(
                `TCP disconnected from ${params.host} : ${params.port}.`
              )
              try {
                ws.close()
              } catch (e) { }
            })

            // If the TCP connection causes an error, disconnect the associated web socket.
            ws.forwardclient.on('error', err => {
              log.debug(`TCP disconnected with error from ${params.host}:${params.port}:${err.code},${req.url}`)
              try {
                ws.close()
              } catch (e) { }
            })
          }

          if (params.tls === 0) {
            // TODO: hmm could be important
            // if (!this.mpsService.mpsComputerList[params.host]) {
            //   // A TCP connection to Intel AMT just connected, send any pending data and start forwarding.
            //   ws.forwardclient.connect(params.port, params.host, () => {
            //     log.debug(`TCP connected to ${params.host}:${params.port}.`)
            //     ws._socket.resume()
            //   })
            // }
          }
        } catch (err) {
          log.error('Exception Caught: ', err)
        }
      })

      this.app.use('/api/v1', async (req: Request, res, next) => {
        // req.mpsService = this.mpsService
        const newDB = new DbCreatorFactory()
        req.db = await newDB.getDb()
        req.secrets = this.secrets
        req.certs = this.certs
        next()
      }, routes)

      // Handle upgrade on websocket
      this.server.on('upgrade', (request, socket, head) => {
        this.handleUpgrade(request, socket, head)
      })

      // Start the ExpressJS web server
    } catch (error) {
      log.error(`Exception in webserver: ${error}`)
      process.exit(0)
    }
  }

  listen (): void {
    // Validate port number
    let port = 3000
    if (Environment.Config.web_port != null) {
      port = Environment.Config.web_port
    }

    this.server.listen(port, () => {
      log.info(`MPS Microservice running on ${Environment.Config.common_name}:${port}.`)
    }).on('error', function (err: NodeJS.ErrnoException) {
      if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
        log.error('Chosen web port is invalid or not available')
      } else {
        log.error(JSON.stringify(err))
      }
      process.exit(0)
    })
  }

  // Handle Upgrade - WebSocket
  handleUpgrade (request, socket, head): void {
    const pathname = (new URL(request.url, 'http://dummy.com')).pathname
    if (pathname === '/relay/webrelay.ashx') {
      this.relaywss.handleUpgrade(request, socket, head, (ws) => {
        this.relaywss.emit('connection', ws, request)
      })
    } else { // Invalid endpoint
      log.debug('Route does not exist. Closing connection...')
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
    }
  }
}
