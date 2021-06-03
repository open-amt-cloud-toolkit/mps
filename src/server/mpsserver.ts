/*********************************************************************
* Copyright (c) Intel Corporation 2018-2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

/* Construct a Intel AMT MPS server object
    Note:
        Functionality has been modified for standalone operation only (Meshcentral services will not work with this code)
    Parameters:
        parent (mpsMicroservice): parent service invoking this module (provides eventing and wiring services)
        db: database for credential and allowlisting
        config: settings pertaining to the behaviour of this service
        certificates: certificates to use for TLS server creation
*/

/**
* @description Intel AMT MPS server object
* @author Ylian Saint-Hilaire
* @version v0.2.0c
*/

import * as net from 'net'
import * as tls from 'tls'

import { configType, certificatesType } from '../models/Config'
import { APFProtocol, APFChannelOpenFailureReasonCode } from '../models/Mps'
import { logger as log } from '../utils/logger'
import { MPSMicroservice } from '../mpsMicroservice'
import { IDbProvider } from '../models/IDbProvider'

import * as common from '../utils/common.js'
// 90 seconds max idle time, higher than the typical KEEP-ALIVE period of 60 seconds
const MAX_IDLE = 90000

export class MPSServer {
  db: IDbProvider
  mpsService: MPSMicroservice
  config: configType
  certs: certificatesType
  ciraConnections = {}
  server: any

  constructor (mpsService: MPSMicroservice) {
    this.mpsService = mpsService
    this.db = mpsService.db
    this.config = mpsService.config
    this.certs = mpsService.certs

    if (this.config.tls_offload) {
      // Creates a new TCP server
      this.server = net.createServer((socket) => {
        this.onConnection(socket)
      })
    } else {
      // Creates a TLS server for secure connection
      this.server = tls.createServer(this.certs.mps_tls_config, (socket) => {
        this.onConnection(socket)
      })
    }

    this.server.listen(this.config.port, () => {
      const mpsaliasport = (typeof this.config.alias_port === 'undefined') ? `${this.config.port}` : `${this.config.port} alias port ${this.config.alias_port}`
      log.info(`Intel(R) AMT server running on ${this.config.common_name}:${mpsaliasport}.`)
    })

    this.server.on('error', (err) => {
      log.error(`ERROR: Intel(R) AMT server port ${this.config.port} is not available.`)
      if (err)log.error(err)
      // if (this.config.exactports) {
      //     process.exit();
      // }
    })
  }

  onConnection = (socket): void => {
    if (this.config.tls_offload) {
      socket.tag = { first: true, clientCert: null, accumulator: '', activetunnels: 0, boundPorts: [], socket: socket, host: null, nextchannelid: 4, channels: {}, nextsourceport: 0 }
    } else {
      socket.tag = { first: true, clientCert: socket.getPeerCertificate(true), accumulator: '', activetunnels: 0, boundPorts: [], socket: socket, host: null, nextchannelid: 4, channels: {}, nextsourceport: 0 }
    }
    socket.setEncoding('binary')
    this.debug(1, 'MPS:New CIRA connection')

    // Setup the CIRA keep alive timer
    socket.setTimeout(MAX_IDLE)
    socket.on('timeout', async (): Promise<void> => {
      this.debug(1, 'MPS:CIRA timeout, disconnecting.')
      try {
        socket.end()
        if (this.ciraConnections[socket.tag.nodeid]) {
          delete this.ciraConnections[socket.tag.nodeid]
          if (typeof this.mpsService.CIRADisconnected === 'function') {
            await this.mpsService.CIRADisconnected(socket.tag.nodeid)
          }
        }
      } catch (e) {
        log.error(`Error from socket timeout: ${e}`)
      }
      this.debug(1, 'MPS:CIRA timeout, disconnected.')
    })

    socket.addListener('data', async (data: string): Promise<void> => {
      // TODO: mpsdebug should be added to the config file
      // if (this.config.mpsdebug) {
      //     let buf = Buffer.from(data, "binary");
      //     console.log('MPS <-- (' + buf.length + '):' + buf.toString('hex'));
      // } // Print out received bytes

      socket.tag.accumulator += data

      // Detect if this is an HTTPS request, if it is, return a simple answer and disconnect. This is useful for debugging access to the MPS port.
      if (socket.tag.first === true) {
        if (socket.tag.accumulator.length < 3) return
        // if (!socket.tag.clientCert.subject) { console.log("MPS Connection, no client cert: " + socket.remoteAddress); socket.write('HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nConnection: close\r\n\r\nMeshCentral2 MPS server.\r\nNo client certificate given.'); socket.end(); return; }
        if (socket.tag.accumulator.substring(0, 3) === 'GET') {
          log.debug(`MPS Connection, HTTP GET detected: ${socket.remoteAddress}`)
          socket.write('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nConnection: close\r\n\r\n<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>Intel Management Presence Server (MPS).<br />Intel&reg; AMT computers must connect here using CIRA.</body></html>')
          socket.end()
          return
        }
        socket.tag.first = false

        // Setup this node with certificate authentication
        if (socket.tag.clientCert?.subject?.O) {
          // This is a node where the organization is indicated within the CIRA certificate
          this.db.IsOrgApproved(socket.tag.clientCert.subject.O, (allowed) => {
            if (allowed) {
              this.debug(1, `CIRA connection for organization: ${socket.tag.clientCert.subject.O}`)
              socket.tag.certauth = true
            } else {
              this.debug(1, `CIRA connection for unknown node with incorrect organization: ${socket.tag.clientCert.subject.O}`)
              socket.end()
            }
          })
        } else {
          // This node connected without certificate authentication, use password auth
          this.debug(1, 'Intel AMT CIRA trying to connect without certificate authentication')
        }
      }

      try {
        // Parse all of the APF data we can
        let l = 0
        do {
          l = await this.processCommand(socket)
          if (l > 0) {
            socket.tag.accumulator = socket.tag.accumulator.substring(l)
          }
        } while (l > 0)
        if (l < 0) {
          socket.end()
        }
      } catch (e) {
        log.error(e)
      }
    })

    socket.addListener('close', async (): Promise<void> => {
      this.debug(1, 'MPS:CIRA connection closed')
      try {
        if (this.ciraConnections[socket.tag.nodeid]) {
          delete this.ciraConnections[socket.tag.nodeid]
          if (typeof this.mpsService.CIRADisconnected === 'function') {
            await this.mpsService.CIRADisconnected(socket.tag.nodeid)
          }
        }
      } catch (e) {
        log.error(`Error from socket close: ${e}`)
      }
    })

    socket.addListener('error', (error
    ) => {
      log.error(`MPS socket error ${socket.tag.nodeid},  ${socket.remoteAddress}: ${error}`)
    })
  }

  // Process one APF command
  processCommand = async (socket): Promise<number> => {
    const cmd = socket.tag.accumulator.charCodeAt(0)
    const len = socket.tag.accumulator.length
    const data = socket.tag.accumulator
    if (len === 0) {
      return 0
    }

    switch (cmd) {
      case APFProtocol.KEEPALIVE_REQUEST: {
        if (len < 5) {
          return 0
        }
        log.debug(`MPS: KEEPALIVE_REQUEST: ${socket.tag.nodeid}`)
        this.SendKeepAliveReply(socket, common.ReadInt(data, 1))
        return 5
      }
      case APFProtocol.KEEPALIVE_REPLY: {
        if (len < 5) return 0
        this.debug(3, 'MPS:KEEPALIVE_REPLY')
        return 5
      }
      case APFProtocol.PROTOCOLVERSION: {
        if (len < 93) return 0
        socket.tag.MajorVersion = common.ReadInt(data, 1)
        socket.tag.MinorVersion = common.ReadInt(data, 5)
        socket.tag.SystemId = this.guidToStr(common.rstr2hex(data.substring(13, 29))).toLowerCase()
        this.debug(3, 'MPS:PROTOCOLVERSION', socket.tag.MajorVersion, socket.tag.MinorVersion, socket.tag.SystemId)

        this.db.IsGUIDApproved(socket.tag.SystemId, async (allowed): Promise<void> => {
          socket.tag.nodeid = socket.tag.SystemId
          if (allowed) {
            if (socket.tag.certauth) {
              this.ciraConnections[socket.tag.SystemId] = socket
              await this.mpsService.CIRAConnected(socket.tag.nodeid)
            }
          } else {
            try {
              this.debug(1, `MPS:GUID ${socket.tag.SystemId} is not allowed to connect.`)
              socket.end()
            } catch (e) { }
          }
        })

        log.debug(`device uuid: ${socket.tag.SystemId}`)
        return 93
      }
      case APFProtocol.USERAUTH_REQUEST: {
        if (len < 13) return 0
        const usernameLen: number = common.ReadInt(data, 1)
        const username: string = data.substring(5, 5 + usernameLen)
        const serviceNameLen: number = common.ReadInt(data, 5 + usernameLen)
        const serviceName: string = data.substring(9 + usernameLen, 9 + usernameLen + serviceNameLen)
        const methodNameLen: number = common.ReadInt(data, 9 + usernameLen + serviceNameLen)
        const methodName: string = data.substring(13 + usernameLen + serviceNameLen, 13 + usernameLen + serviceNameLen + methodNameLen)
        let passwordLen = 0; let password: string = null
        if (methodName === 'password') {
          passwordLen = common.ReadInt(data, 14 + usernameLen + serviceNameLen + methodNameLen)
          password = data.substring(18 + usernameLen + serviceNameLen + methodNameLen, 18 + usernameLen + serviceNameLen + methodNameLen + passwordLen)
        }
        this.debug(3, `MPS:USERAUTH_REQUEST usernameLen=${usernameLen} serviceNameLen=${serviceNameLen} methodNameLen=${methodNameLen}`)
        this.debug(3, `MPS:USERAUTH_REQUEST user=${username} service=${serviceName} method=${methodName} password=${password}`)
        // Authenticate device connection using username and password
        this.db.CIRAAuth(socket.tag.SystemId, username, password, async (allowed): Promise<void> => {
          if (allowed) {
            this.debug(1, 'MPS:CIRA Authentication successful for ', username)
            this.ciraConnections[socket.tag.SystemId] = socket
            await this.mpsService.CIRAConnected(socket.tag.SystemId) // Notify that a connection is successful to console
            this.SendUserAuthSuccess(socket) // Notify the auth success on the CIRA connection
          } else {
            log.warn(`MPS: CIRA Authentication failed for: ${username} `)
            this.SendUserAuthFail(socket)
          }
        })
        return 18 + usernameLen + serviceNameLen + methodNameLen + passwordLen
      }
      case APFProtocol.SERVICE_REQUEST: {
        if (len < 5) return 0
        const serviceNameLen: number = common.ReadInt(data, 1)
        if (len < 5 + serviceNameLen) return 0
        const serviceName = data.substring(5, 5 + serviceNameLen)
        this.debug(3, 'MPS:SERVICE_REQUEST', serviceName)
        if (serviceName === 'pfwd@amt.intel.com') {
          this.SendServiceAccept(socket, 'pfwd@amt.intel.com')
        }
        if (serviceName === 'auth@amt.intel.com') {
          this.SendServiceAccept(socket, 'auth@amt.intel.com')
        }
        return 5 + serviceNameLen
      }
      case APFProtocol.GLOBAL_REQUEST: {
        if (len < 14) return 0
        const requestLen: number = common.ReadInt(data, 1)
        if (len < 14 + requestLen) return 0
        const request: string = data.substring(5, 5 + requestLen)
        // const wantResponse: string = data.charCodeAt(5 + requestLen)

        if (request === 'tcpip-forward') {
          const addrLen: number = common.ReadInt(data, 6 + requestLen)
          if (len < 14 + requestLen + addrLen) return 0
          let addr = data.substring(10 + requestLen, 10 + requestLen + addrLen)
          const port = common.ReadInt(data, 10 + requestLen + addrLen)
          if (addr === '') addr = undefined
          log.debug(`MPS: GLOBAL_REQUEST ${socket.tag.nodeid} ${request} ${addr}: ${port} `)
          this.ChangeHostname(socket, addr)
          if (socket.tag.boundPorts.indexOf(port) === -1) {
            socket.tag.boundPorts.push(port)
          }
          this.SendTcpForwardSuccessReply(socket, port)
          return 14 + requestLen + addrLen
        }

        if (request === 'cancel-tcpip-forward') {
          const addrLen: number = common.ReadInt(data, 6 + requestLen)
          if (len < 14 + requestLen + addrLen) return 0
          const addr: string = data.substring(10 + requestLen, 10 + requestLen + addrLen)
          const port: number = common.ReadInt(data, 10 + requestLen + addrLen)
          this.debug(2, 'MPS:GLOBAL_REQUEST', request, `${addr}:${port}`)
          const portindex = socket.tag.boundPorts.indexOf(port)
          if (portindex >= 0) {
            socket.tag.boundPorts.splice(portindex, 1)
          }
          this.SendTcpForwardCancelReply(socket)
          return 14 + requestLen + addrLen
        }

        if (request === 'udp-send-to@amt.intel.com') {
          const addrLen: number = common.ReadInt(data, 6 + requestLen)
          if (len < 26 + requestLen + addrLen) return 0
          const addr: string = data.substring(10 + requestLen, 10 + requestLen + addrLen)
          const port: number = common.ReadInt(data, 10 + requestLen + addrLen)
          const oaddrLen: number = common.ReadInt(data, 14 + requestLen + addrLen)
          if (len < 26 + requestLen + addrLen + oaddrLen) return 0
          const oaddr: string = data.substring(18 + requestLen, 18 + requestLen + addrLen)
          const oport: number = common.ReadInt(data, 18 + requestLen + addrLen + oaddrLen)
          const datalen: number = common.ReadInt(data, 22 + requestLen + addrLen + oaddrLen)
          if (len < 26 + requestLen + addrLen + oaddrLen + datalen) return 0
          this.debug(2, 'MPS:GLOBAL_REQUEST', request, `${addr}:${port}`, `${oaddr}:${oport}`, datalen.toString())
          // TODO
          return 26 + requestLen + addrLen + oaddrLen + datalen
        }

        return 6 + requestLen
      }
      case APFProtocol.CHANNEL_OPEN: {
        if (len < 33) return 0
        const ChannelTypeLength: number = common.ReadInt(data, 1)
        if (len < (33 + ChannelTypeLength)) return 0

        // Decode channel identifiers and window size
        const ChannelType: string = data.substring(5, 5 + ChannelTypeLength)
        const SenderChannel: number = common.ReadInt(data, 5 + ChannelTypeLength)
        const WindowSize: number = common.ReadInt(data, 9 + ChannelTypeLength)

        // Decode the target
        const TargetLen: number = common.ReadInt(data, 17 + ChannelTypeLength)
        if (len < (33 + ChannelTypeLength + TargetLen)) return 0
        const Target: string = data.substring(21 + ChannelTypeLength, 21 + ChannelTypeLength + TargetLen)
        const TargetPort: number = common.ReadInt(data, 21 + ChannelTypeLength + TargetLen)

        // Decode the source
        const SourceLen: number = common.ReadInt(data, 25 + ChannelTypeLength + TargetLen)
        if (len < (33 + ChannelTypeLength + TargetLen + SourceLen)) return 0
        const Source: string = data.substring(29 + ChannelTypeLength + TargetLen, 29 + ChannelTypeLength + TargetLen + SourceLen)
        const SourcePort: number = common.ReadInt(data, 29 + ChannelTypeLength + TargetLen + SourceLen)

        this.debug(3, 'MPS:CHANNEL_OPEN', ChannelType, SenderChannel.toString(), WindowSize.toString(), `${Target}:${TargetPort}`, `${Source}:${SourcePort}`)

        // Check if we understand this channel type
        // if (ChannelType.toLowerCase() == "direct-tcpip")

        // We don't understand this channel type, send an error back
        this.SendChannelOpenFailure(socket, SenderChannel, APFChannelOpenFailureReasonCode.UnknownChannelType)
        return 33 + ChannelTypeLength + TargetLen + SourceLen

        /*
        // This is a correct connection. Lets get it setup
        var MeshAmtEventEndpoint = { ServerChannel: GetNextBindId(), AmtChannel: SenderChannel, MaxWindowSize: 2048, CurrentWindowSize:2048, SendWindow: WindowSize, InfoHeader: "Target: " + Target + ":" + TargetPort + ", Source: " + Source + ":" + SourcePort};
        // TODO: Connect this socket for a WSMAN event
        SendChannelOpenConfirmation(socket, SenderChannel, MeshAmtEventEndpoint.ServerChannel, MeshAmtEventEndpoint.MaxWindowSize);
        */
      }
      case APFProtocol.CHANNEL_OPEN_CONFIRMATION: {
        if (len < 17) return 0
        const RecipientChannel: number = common.ReadInt(data, 1)
        const SenderChannel: number = common.ReadInt(data, 5)
        const WindowSize: number = common.ReadInt(data, 9)
        socket.tag.activetunnels++
        const cirachannel = socket.tag.channels[RecipientChannel]
        if (cirachannel == null) {
          /* console.log("MPS Error in CHANNEL_OPEN_CONFIRMATION: Unable to find channelid " + RecipientChannel); */
          return 17
        }
        cirachannel.amtchannelid = SenderChannel
        cirachannel.sendcredits = cirachannel.amtCiraWindow = WindowSize
        this.debug(3, 'MPS:CHANNEL_OPEN_CONFIRMATION', RecipientChannel.toString(), SenderChannel.toString(), WindowSize.toString())
        if (cirachannel.closing === 1) {
          // Close this channel
          this.SendChannelClose(cirachannel.socket, cirachannel.amtchannelid)
        } else {
          cirachannel.state = 2
          // Send any pending data
          if (cirachannel.sendBuffer != null) {
            if (cirachannel.sendBuffer.length <= cirachannel.sendcredits) {
              // Send the entire pending buffer
              this.SendChannelData(cirachannel.socket, cirachannel.amtchannelid, cirachannel.sendBuffer)
              cirachannel.sendcredits -= cirachannel.sendBuffer.length
              delete cirachannel.sendBuffer
              if (cirachannel.onSendOk) {
                cirachannel.onSendOk(cirachannel)
              }
            } else {
              // Send a part of the pending buffer
              this.SendChannelData(cirachannel.socket, cirachannel.amtchannelid, cirachannel.sendBuffer.substring(0, cirachannel.sendcredits))
              cirachannel.sendBuffer = cirachannel.sendBuffer.substring(cirachannel.sendcredits)
              cirachannel.sendcredits = 0
            }
          }
          // Indicate the channel is open
          if (cirachannel.onStateChange) {
            cirachannel.onStateChange(cirachannel, cirachannel.state)
          }
        }
        return 17
      }
      case APFProtocol.CHANNEL_OPEN_FAILURE: {
        if (len < 17) return 0
        const RecipientChannel: number = common.ReadInt(data, 1)
        const ReasonCode: number = common.ReadInt(data, 5)
        this.debug(3, 'MPS:CHANNEL_OPEN_FAILURE', RecipientChannel.toString(), ReasonCode.toString())
        const cirachannel = socket.tag.channels[RecipientChannel]
        if (cirachannel == null) {
          log.debug(`MPS Error in CHANNEL_OPEN_FAILURE: Unable to find channelid ${RecipientChannel}`); return 17
        }
        if (cirachannel.state > 0) {
          cirachannel.state = 0
          if (cirachannel.onStateChange) {
            cirachannel.onStateChange(cirachannel, cirachannel.state)
          }
          delete socket.tag.channels[RecipientChannel]
        }
        return 17
      }
      case APFProtocol.CHANNEL_CLOSE: {
        if (len < 5) return 0
        const RecipientChannel: number = common.ReadInt(data, 1)
        this.debug(3, 'MPS:CHANNEL_CLOSE', RecipientChannel.toString())
        const cirachannel = socket.tag.channels[RecipientChannel]
        if (cirachannel == null) {
          log.debug(`MPS Error in CHANNEL_CLOSE: Unable to find channelid ${RecipientChannel}`); return 5
        }
        this.SendChannelClose(cirachannel.socket, cirachannel.amtchannelid)
        socket.tag.activetunnels--
        if (cirachannel.state > 0) {
          cirachannel.state = 0
          if (cirachannel.onStateChange) {
            cirachannel.onStateChange(cirachannel, cirachannel.state)
          }
          delete socket.tag.channels[RecipientChannel]
        }
        return 5
      }
      case APFProtocol.CHANNEL_WINDOW_ADJUST: {
        if (len < 9) return 0
        const RecipientChannel: number = common.ReadInt(data, 1)
        const ByteToAdd: number = common.ReadInt(data, 5)
        const cirachannel = socket.tag.channels[RecipientChannel]
        if (cirachannel == null) {
          log.debug(`MPS Error in CHANNEL_WINDOW_ADJUST: Unable to find channelid ${RecipientChannel}`); return 9
        }
        cirachannel.sendcredits += ByteToAdd
        this.debug(3, 'MPS:CHANNEL_WINDOW_ADJUST', RecipientChannel.toString(), ByteToAdd.toString(), cirachannel.sendcredits)
        if (cirachannel.state === 2 && cirachannel.sendBuffer != null) {
          // Compute how much data we can send
          if (cirachannel.sendBuffer.length <= cirachannel.sendcredits) {
            // Send the entire pending buffer
            this.SendChannelData(cirachannel.socket, cirachannel.amtchannelid, cirachannel.sendBuffer)
            cirachannel.sendcredits -= cirachannel.sendBuffer.length
            delete cirachannel.sendBuffer
            if (cirachannel.onSendOk) {
              cirachannel.onSendOk(cirachannel)
            }
          } else {
            // Send a part of the pending buffer
            this.SendChannelData(cirachannel.socket, cirachannel.amtchannelid, cirachannel.sendBuffer.substring(0, cirachannel.sendcredits))
            cirachannel.sendBuffer = cirachannel.sendBuffer.substring(cirachannel.sendcredits)
            cirachannel.sendcredits = 0
          }
        }
        return 9
      }
      case APFProtocol.CHANNEL_DATA: {
        if (len < 9) return 0
        const RecipientChannel: number = common.ReadInt(data, 1)
        const LengthOfData: number = common.ReadInt(data, 5)
        if (len < (9 + LengthOfData)) return 0
        this.debug(4, 'MPS:CHANNEL_DATA', RecipientChannel.toString(), LengthOfData.toString())
        const cirachannel = socket.tag.channels[RecipientChannel]
        if (cirachannel == null) {
          log.debug(`MPS Error in CHANNEL_DATA: Unable to find channelid ${RecipientChannel}`); return 9 + LengthOfData
        }
        cirachannel.amtpendingcredits += LengthOfData
        if (cirachannel.onData) cirachannel.onData(cirachannel, data.substring(9, 9 + LengthOfData))
        if (cirachannel.amtpendingcredits > (cirachannel.ciraWindow / 2)) {
          this.SendChannelWindowAdjust(cirachannel.socket, cirachannel.amtchannelid, cirachannel.amtpendingcredits) // Adjust the buffer window
          cirachannel.amtpendingcredits = 0
        }
        return 9 + LengthOfData
      }
      case APFProtocol.DISCONNECT: {
        if (len < 7) return 0
        const ReasonCode: number = common.ReadInt(data, 1)
        this.debug(3, 'MPS:DISCONNECT', ReasonCode.toString())
        try {
          delete this.ciraConnections[socket.tag.nodeid]
        } catch (e) { }
        await this.mpsService.CIRADisconnected(socket.tag.nodeid)
        return 7
      }
      default: {
        this.debug(1, `MPS:Unknown CIRA command: ${cmd}`)
        return -1
      }
    }
  }

  // Disconnect CIRA tunnel
  async close (socket): Promise<void> {
    try {
      socket.end()
    } catch (e) { }
    try {
      delete this.ciraConnections[socket.tag.nodeid]
    } catch (e) { }
    if (this.mpsService) {
      await this.mpsService.CIRADisconnected(socket.tag.nodeid)
    }
  }

  SendServiceAccept (socket, service: string): void {
    this.Write(
      socket,
      String.fromCharCode(APFProtocol.SERVICE_ACCEPT) +
            common.IntToStr(service.length) +
            service
    )
  }

  SendTcpForwardSuccessReply (socket, port): void {
    this.Write(
      socket,
      String.fromCharCode(APFProtocol.REQUEST_SUCCESS) + common.IntToStr(port)
    )
  }

  SendTcpForwardCancelReply (socket): void {
    this.Write(socket, String.fromCharCode(APFProtocol.REQUEST_SUCCESS))
  }

  SendKeepAliveRequest (socket, cookie): void {
    this.Write(
      socket,
      String.fromCharCode(APFProtocol.KEEPALIVE_REQUEST) +
            common.IntToStr(cookie)
    )
  }

  SendKeepAliveReply (socket, cookie): void {
    this.Write(
      socket,
      String.fromCharCode(APFProtocol.KEEPALIVE_REPLY) + common.IntToStr(cookie)
    )
  }

  SendChannelOpenFailure (socket, senderChannel, reasonCode): void {
    this.Write(
      socket,
      String.fromCharCode(APFProtocol.CHANNEL_OPEN_FAILURE) +
            common.IntToStr(senderChannel) +
            common.IntToStr(reasonCode) +
            common.IntToStr(0) +
            common.IntToStr(0)
    )
  }

  SendChannelOpenConfirmation (socket, recipientChannelId, senderChannelId, initialWindowSize): void {
    this.Write(
      socket,
      String.fromCharCode(APFProtocol.CHANNEL_OPEN_CONFIRMATION) +
            common.IntToStr(recipientChannelId) +
            common.IntToStr(senderChannelId) +
            common.IntToStr(initialWindowSize) +
            common.IntToStr(-1)
    )
  }

  SendChannelOpen (socket, direct, channelid: number, windowSize: number, target: string, targetPort: number, source: string, sourcePort: number): void {
    const connectionType = direct === true ? 'direct-tcpip' : 'forwarded-tcpip'
    // TODO: Reports of target being undefined that causes target.length to fail. This is a hack.
    if (target == null || typeof target === 'undefined') target = ''
    this.Write(
      socket,
      String.fromCharCode(APFProtocol.CHANNEL_OPEN) +
            common.IntToStr(connectionType.length) +
            connectionType +
            common.IntToStr(channelid) +
            common.IntToStr(windowSize) +
            common.IntToStr(-1) +
            common.IntToStr(target.length) +
            target +
            common.IntToStr(targetPort) +
            common.IntToStr(source.length) +
            source +
            common.IntToStr(sourcePort)
    )
  }

  SendChannelClose (socket, channelid): void {
    this.debug(2, 'MPS:SendChannelClose', channelid)
    this.Write(
      socket,
      String.fromCharCode(APFProtocol.CHANNEL_CLOSE) +
            common.IntToStr(channelid)
    )
  }

  SendChannelData (socket, channelid, data): void {
    this.Write(
      socket,
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      String.fromCharCode(APFProtocol.CHANNEL_DATA) +
            common.IntToStr(channelid) +
            common.IntToStr(data.length) +
            data
    )
  }

  SendChannelWindowAdjust (socket, channelid, bytestoadd): void {
    this.debug(3, 'MPS:SendChannelWindowAdjust', channelid, bytestoadd)
    this.Write(
      socket,
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      String.fromCharCode(APFProtocol.CHANNEL_WINDOW_ADJUST) +
            common.IntToStr(channelid) +
            common.IntToStr(bytestoadd)
    )
  }

  SendDisconnect (socket, reasonCode): void {
    this.Write(
      socket,
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      String.fromCharCode(APFProtocol.DISCONNECT) +
            common.IntToStr(reasonCode) +
            common.ShortToStr(0)
    )
  }

  SendUserAuthFail (socket): void {
    this.Write(
      socket,
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      String.fromCharCode(APFProtocol.USERAUTH_FAILURE) +
            common.IntToStr(8) +
            'password' +
            common.ShortToStr(0)
    )
  }

  SendUserAuthSuccess (socket): void {
    this.Write(socket, String.fromCharCode(APFProtocol.USERAUTH_SUCCESS))
  }

  Write (socket, data): void {
    // TODO: Add mpsdebug to config file.
    // if (this.config.mpsdebug) {
    //   // Print out sent bytes
    //   var buf = Buffer.from(data, "binary");
    //   console.log("MPS --> (" + buf.length + "):" + buf.toString("hex"));
    //   socket.write(buf);
    // } else {
    socket.write(Buffer.from(data, 'binary'))
    // }
  }

  SetupCommunication = (host, port): any => {
    const ciraconn = this.ciraConnections[host]
    const socket = this.SetupCiraChannel(ciraconn, port)
    return socket
  }

  // Setup CIRA Channel
  SetupCiraChannel (socket, targetport): any {
    const sourceport = (socket.tag.nextsourceport++ % 30000) + 1024
    const cirachannel = {
      targetport: targetport,
      channelid: socket.tag.nextchannelid++,
      socket: socket,
      state: 1,
      sendcredits: 0,
      amtpendingcredits: 0,
      amtCiraWindow: 0,
      ciraWindow: 32768,
      write: undefined,
      sendBuffer: undefined,
      amtchannelid: undefined,
      close: undefined,
      closing: undefined,
      onStateChange: undefined,
      sendchannelclose: undefined
    }
    this.SendChannelOpen(
      socket,
      false,
      cirachannel.channelid,
      cirachannel.ciraWindow,
      socket.tag.host,
      targetport,
      '1.2.3.4',
      sourceport
    )

    // This function writes data to this CIRA channel
    cirachannel.write = (data: string): boolean => {
      if (cirachannel.state === 0) return false
      if (cirachannel.state === 1 || cirachannel.sendcredits === 0 || cirachannel.sendBuffer != null) {
        if (cirachannel.sendBuffer == null) {
          cirachannel.sendBuffer = data
        } else {
          cirachannel.sendBuffer += data
        }
        return true
      }
      // Compute how much data we can send
      if (data.length <= cirachannel.sendcredits) {
        // Send the entire message
        this.SendChannelData(cirachannel.socket, cirachannel.amtchannelid, data)
        cirachannel.sendcredits -= data.length
        return true
      }
      // Send a part of the message
      cirachannel.sendBuffer = data.substring(cirachannel.sendcredits)
      this.SendChannelData(
        cirachannel.socket,
        cirachannel.amtchannelid,
        data.substring(0, cirachannel.sendcredits)
      )
      cirachannel.sendcredits = 0
      return false
    }

    // This function closes this CIRA channel
    cirachannel.close = (): void => {
      if (cirachannel.state === 0 || cirachannel.closing === 1) return
      if (cirachannel.state === 1) {
        cirachannel.closing = 1
        cirachannel.state = 0
        if (cirachannel.onStateChange) {
          cirachannel.onStateChange(cirachannel, cirachannel.state)
        }
        return
      }
      cirachannel.state = 0
      cirachannel.closing = 1
      this.SendChannelClose(cirachannel.socket, cirachannel.amtchannelid)
      if (cirachannel.onStateChange) {
        cirachannel.onStateChange(cirachannel, cirachannel.state)
      }
    }

    cirachannel.sendchannelclose = (): void => {
      this.SendChannelClose(cirachannel.socket, cirachannel.amtchannelid)
    }

    socket.tag.channels[cirachannel.channelid] = cirachannel
    return cirachannel
  }

  ChangeHostname (socket, host): void {
    let computerEntry = {
      name: undefined,
      host: undefined,
      amtuser: undefined
    }
    if (socket.tag.host === host) return // Nothing to change
    this.debug(3, 'Change hostname to ', host)
    socket.tag.host = host
    if (this.mpsService.mpsComputerList[socket.tag.nodeid]) {
      computerEntry = this.mpsService.mpsComputerList[socket.tag.nodeid]
      computerEntry.name = host
      computerEntry.host = socket.tag.nodeid
      this.mpsService.mpsComputerList[socket.tag.nodeid] = computerEntry
    } else {
      computerEntry = {
        name: host,
        host: socket.tag.nodeid,
        amtuser: 'admin'
      }

      this.mpsService.mpsComputerList[socket.tag.nodeid] = computerEntry
    }
  }

  guidToStr (g): string {
    return (
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      g.substring(6, 8) +
            g.substring(4, 6) +
            g.substring(2, 4) +
            g.substring(0, 2) +
            '-' +
            g.substring(10, 12) +
            g.substring(8, 10) +
            '-' +
            g.substring(14, 16) +
            g.substring(12, 14) +
            '-' +
            g.substring(16, 20) +
            '-' +
            g.substring(20)
    )
  }

  // Debug
  debug (lvl: number, ...argArray: string[]): void {
    if (lvl > this.mpsService.debugLevel) return
    if (argArray.length === 1) {
      log.debug(argArray[0])
    } else if (argArray.length === 2) {
      log.debug(`${argArray[0]} ${argArray[1]}`)
    } else if (argArray.length === 3) {
      log.debug(`${argArray[0]} ${argArray[1]} ${argArray[2]}`)
    } else if (argArray.length === 4) {
      log.debug(`${argArray[0]} ${argArray[1]} ${argArray[2]} ${argArray[3]}`)
    } else if (argArray.length === 5) {
      log.debug(`${argArray[0]} ${argArray[1]} ${argArray[2]} ${argArray[3]} ${argArray[4]}`)
    } else if (argArray.length === 6) {
      log.debug(`${argArray[0]} ${argArray[1]} ${argArray[2]} ${argArray[3]} ${argArray[4]} ${argArray[5]}`)
    }
  }
}
