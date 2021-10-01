/*********************************************************************
* Copyright (c) Intel Corporation 2018-2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

/* Construct a Intel AMT MPS server object
    Note:
        Functionality has been modified for standalone operation only (Meshcentral services will not work with this code)
    Parameters:
        parent (mpsMicroservice): parent service invoking this module (provides eventing and wiring services)
        db: database for credential
        config: settings pertaining to the behaviour of this service
        certificates: certificates to use for TLS server creation
*/

/**
* @description Intel AMT MPS server object
* @author Ylian Saint-Hilaire
* @version v0.2.0c
*/

import { logger } from '../utils/logger'
import { MPSMicroservice } from '../mpsMicroservice'

import { Environment } from '../utils/Environment'
import { Server, createServer } from 'net'
import { createServer as tlsCreateServer } from 'tls'
import { APFProcessor } from './APFProcessor'
import { CIRASocket } from '../models/models'
import { CIRAHandler } from './CIRAHandler'
// 90 seconds max idle time, higher than the typical KEEP-ALIVE period of 60 seconds
const MAX_IDLE = 90000

export class MPSServer {
  mpsService: MPSMicroservice
  apf: APFProcessor
  server: Server
  cira: CIRAHandler

  constructor (mpsService: MPSMicroservice) {
    this.mpsService = mpsService
    this.apf = new APFProcessor()
    this.cira = new CIRAHandler(this.apf)
    if (Environment.Config.tls_offload) {
      // Creates a new TCP server
      this.server = createServer((socket) => {
        this.onConnection(socket as any)
      })
    } else {
      // Creates a TLS server for secure connection
      this.server = tlsCreateServer(this.mpsService.certs.mps_tls_config, (socket) => {
        this.onTLSConnection(socket as any)
      })
    }

    this.server.listen(Environment.Config.port, () => {
      const mpsaliasport = (typeof Environment.Config.alias_port === 'undefined') ? `${Environment.Config.port}` : `${Environment.Config.port} alias port ${Environment.Config.alias_port}`
      logger.info(`Intel(R) AMT server running on ${Environment.Config.common_name}:${mpsaliasport}.`)
    })

    this.server.on('error', (err) => {
      logger.error(`ERROR: Intel(R) AMT server port ${Environment.Config.port} is not available.`)
      if (err) logger.error(JSON.stringify(err))
    })
  }

  onTLSConnection = (socket: CIRASocket): void => {
    logger.debug('MPS:New Offloaded-TLS CIRA connection')
    socket.tag = { first: true, clientCert: socket.getPeerCertificate(true), accumulator: '', activetunnels: 0, boundPorts: [], socket: socket, host: null, nextchannelid: 4, channels: {}, nextsourceport: 0, nodeid: null }
    this.addHandlers(socket)
  }

  onConnection = (socket: CIRASocket): void => {
    logger.debug('MPS:New TLS CIRA connection')
    socket.tag = { first: true, clientCert: null, accumulator: '', activetunnels: 0, boundPorts: [], socket: socket, host: null, nextchannelid: 4, channels: {}, nextsourceport: 0, nodeid: null }
    this.addHandlers(socket)
  }

  addHandlers (socket: CIRASocket): void {
    socket.setEncoding('binary')
    socket.setTimeout(MAX_IDLE) // Setup the CIRA keep alive timer
    socket.on('timeout', this.onTimeout.bind(this, socket))
    socket.addListener('data', this.onDataReceived.bind(this, socket))
    socket.addListener('close', this.onClose.bind(this, socket))
    socket.addListener('error', this.onError.bind(this, socket))
  }

  onTimeout = async (socket: CIRASocket): Promise<void> => {
    logger.debug('MPS:CIRA timeout, disconnecting.')
    try {
      socket.end()
      if (this.cira.ciraConnections[socket.tag.nodeid]) {
        delete this.cira.ciraConnections[socket.tag.nodeid]
        if (typeof this.mpsService.CIRADisconnected === 'function') {
          await this.mpsService.CIRADisconnected(socket.tag.nodeid)
        }
      }
    } catch (err) {
      logger.error(`Error from socket timeout: ${err}`)
    }
    logger.debug('MPS:CIRA timeout, disconnected.')
  }

  onDataReceived = async (socket: CIRASocket, data: string): Promise<void> => {
    // TODO: mpsdebug should be added to the config file
    // if (Environment.Config.mpsdebug) {
    //     let buf = Buffer.from(data, "binary");
    //     console.log('MPS <-- (' + buf.length + '):' + buf.toString('hex'));
    // } // Print out received bytes

    socket.tag.accumulator += data

    // Detect if this is an HTTPS request, if it is, return a simple answer and disconnect. This is useful for debugging access to the MPS port.
    if (socket.tag.first) {
      if (socket.tag.accumulator.length < 3) return
      // if (!socket.tag.clientCert.subject) { console.log("MPS Connection, no client cert: " + socket.remoteAddress); socket.write('HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nConnection: close\r\n\r\nMeshCentral2 MPS server.\r\nNo client certificate given.'); socket.end(); return; }
      if (socket.tag.accumulator.substring(0, 3) === 'GET') {
        logger.debug(`MPS Connection, HTTP GET detected: ${socket.remoteAddress}`)
        socket.write('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nConnection: close\r\n\r\n<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>Intel Management Presence Server (MPS).<br />Intel&reg; AMT computers must connect here using CIRA.</body></html>')
        socket.end()
        return
      }
      socket.tag.first = false
    }

    try {
      // Parse all of the APF data we can
      let length = 0
      do {
        length = await this.apf.processCommand(socket)
        if (length > 0) {
          socket.tag.accumulator = socket.tag.accumulator.substring(length)
        }
      } while (length > 0)
      if (length < 0) {
        socket.end()
      }
    } catch (err) {
      logger.error(err)
    }
  }

  onClose = async (socket: CIRASocket): Promise<void> => {
    logger.debug('MPS:CIRA connection closed')
    try {
      if (this.cira.ciraConnections[socket.tag.nodeid]) {
        delete this.cira.ciraConnections[socket.tag.nodeid]
        if (typeof this.mpsService.CIRADisconnected === 'function') {
          await this.mpsService.CIRADisconnected(socket.tag.nodeid)
        }
      }
    } catch (e) {
      logger.error(`Error from socket close: ${e}`)
    }
  }

  onError = (socket: CIRASocket, error: Error): void => {
    // er as anyror "ECONNRESET" means the other side of the TCP conversation abruptly closed its end of the connection.
    if ((error as any).code !== 'ECONNRESET') {
      logger.error(`MPS socket error ${socket.tag.nodeid},  ${socket.remoteAddress}: ${JSON.stringify(error)}`)
    }
  }
}
