/*********************************************************************
* Copyright (c) Intel Corporation 2018-2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

/**
* @description Intel AMT Web server object
* @author Ylian Saint-Hilaire
* @version v0.2.0c
*/

import * as net from 'net'
import * as tls from 'tls'
import express from 'express'
import * as http from 'http'
import * as parser from 'body-parser'

import { ErrorResponse } from '../utils/ErrorResponse'
import { logger as log } from '../utils/logger'
import { constants } from 'crypto'
import { MPSMicroservice } from '../mpsMicroservice'
import { IDbProvider } from '../interfaces/IDbProvider'
import AMTStackFactory from '../amt_libraries/amt-connection-factory'
import routes from '../routes'

import interceptor from '../utils/interceptor.js'
import WebSocket from 'ws'
import { URL } from 'url'
import cors from 'cors'
import { MPSCertificates, MPSConfig, QueryParams } from '../models'

export class WebServer {
  db: IDbProvider
  app: any
  users: any = {}
  server = null
  notificationwss = null
  relaywss = null
  mpsService: MPSMicroservice
  config: MPSConfig
  certs: MPSCertificates
  sessionParser: any

  constructor (mpsService: MPSMicroservice) {
    try {
      this.mpsService = mpsService
      this.db = this.mpsService.db
      this.config = this.mpsService.config
      this.certs = this.mpsService.certs
      this.app = express()
      this.notificationwss = new WebSocket.Server({ noServer: true })
      this.relaywss = new WebSocket.Server({ noServer: true })

      // Create Server
      this.server = http.createServer(this.app)
      this.app.use(cors())

      // Handles the Bad JSON exceptions
      this.app.use(parser.json(), (err, req, res, next) => {
        if (err instanceof SyntaxError) {
          return res.status(400).send(ErrorResponse(400))
        }
        next()
      })

      // Console connects to this websocket for a persistent connection
      this.notificationwss.on('connection', async (ws, req) => {
        this.users[ws] = ws
        // log.debug("New control websocket.");
        ws.on('message', msg => {
          log.debug(`Incoming control message from browser: ${msg}`)
        })

        ws.on('close', req => {
          // log.debug("Closing control websocket.");
          delete this.users[ws]
        })
      })

      // Relay websocket. KVM & SOL use this websocket.
      this.relaywss.on('connection', async (ws, req) => {
        try {
          const base = `${this.config.https ? 'https' : 'http'}://${this.config.common_name}:${this.config.web_port}/`
          const reqQueryURL = new URL(req.url, base)
          const params: QueryParams = {
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
          const credentials = await this.db.getAmtPassword(params.host)
          // obj.debug("Credential for " + params.host + " is " + JSON.stringify(credentials));

          if (credentials != null) {
            log.debug('Creating credential')
            if (params.p === 1) {
              ws.interceptor = interceptor.CreateHttpInterceptor({
                host: params.host,
                port: params.port,
                user: credentials[0],
                pass: credentials[1]
              })
            } else if (params.p === 2) {
              ws.interceptor = interceptor.CreateRedirInterceptor({
                user: credentials[0],
                pass: credentials[1]
              })
            }
          }

          if (params.tls === 0) {
            // If this is TCP (without TLS) set a normal TCP socket
            // check if this is MPS connection
            const uuid = params.host
            const ciraConn = await this.mpsService.ciraConnectionFactory.getConnection(uuid)
            if (uuid && ciraConn) {
              log.silly(`go setup the CIRA channel for ${uuid}`)
              // Setup CIRA channel for the device
              ws.forwardclient = this.mpsService.mpsserver.SetupCiraChannel(
                ciraConn,
                params.port
              )

              ws.forwardclient.xtls = 0
              ws.forwardclient.onData = (ciraconn, data): void => {
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
              ws.forwardclient = new net.Socket()
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
            ws.forwardclient = tls.connect(
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
          if (ws.forwardclient instanceof net.Socket) {
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
              log.debug(
                `TCP disconnected with error from ${params.host}:${
                  params.port
                }:${err.code},${req.url}`
              )
              try {
                ws.close()
              } catch (e) { }
            })
          }

          if (params.tls === 0) {
            if (!this.mpsService.mpsComputerList[params.host]) {
              // A TCP connection to Intel AMT just connected, send any pending data and start forwarding.
              ws.forwardclient.connect(params.port, params.host, () => {
                log.debug(`TCP connected to ${params.host}:${params.port}.`)
                ws._socket.resume()
              })
            }
          }
        } catch (err) {
          log.error('Exception Caught: ', err)
        }
      })

      this.app.use('/api/v1', (req, res, next) => {
        (req).mpsService = this.mpsService
        next()
      }, (req, res, next) => {
        (req).amtFactory = new AMTStackFactory(this.mpsService)
        next()
      }, routes)

      // Handle upgrade on websocket
      this.server.on('upgrade', (request, socket, head) => {
        this.handleUpgrade(request, socket, head)
      })

      // Validate port number
      let port = 3000
      if (this.config.web_port != null) {
        port = this.config.web_port
      }

      // Start the ExpressJS web server

      this.server.listen(port, () => {
        log.info(`MPS Microservice running on ${this.config.common_name}:${port}.`)
      }).on('error', function (err) {
        if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
          log.error('Chosen web port is invalid or not available')
        } else {
          log.error(err)
        }
        process.exit(0)
      })
    } catch (error) {
      log.error(`Exception in webserver: ${error}`)
      process.exit(0)
    }
  }

  // Handle Upgrade - WebSocket
  handleUpgrade (request, socket, head): void {
    const base = `${this.config.https ? 'https' : 'http'}://${this.config.common_name}:${this.config.web_port}/`
    const pathname = (new URL(request.url, base)).pathname
    if (pathname === '/notifications/control.ashx') {
      this.notificationwss.handleUpgrade(request, socket, head, (ws) => {
        this.notificationwss.emit('connection', ws, request)
      })
    } else if (pathname === '/relay/webrelay.ashx') {
      this.relaywss.handleUpgrade(request, socket, head, (ws) => {
        this.relaywss.emit('connection', ws, request)
      })
    } else { // Invalid endpoint
      log.info('Route does not exist. Closing connection...')
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
    }
  }

  // Notify clients connected through browser web socket
  notifyUsers (msg): void {
    for (const i in this.users) {
      try {
        this.users[i].send(JSON.stringify(msg))
      } catch (error) {
        log.error(error)
      }
    }
  }
}
