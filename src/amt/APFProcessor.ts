/*********************************************************************
 * Copyright (c) Intel Corporation 2018-2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { logger, messages } from '../logging'
import Common from '../utils/common'
import { CIRASocket } from '../models/models'
import { EventEmitter } from 'stream'

const KEEPALIVE_INTERVAL = 30 // 30 seconds is typical keepalive interval for AMT CIRA connection

export enum APFProtocol {
  UNKNOWN = 0,
  DISCONNECT = 1,
  SERVICE_REQUEST = 5,
  SERVICE_ACCEPT = 6,
  USERAUTH_REQUEST = 50,
  USERAUTH_FAILURE = 51,
  USERAUTH_SUCCESS = 52,
  GLOBAL_REQUEST = 80,
  REQUEST_SUCCESS = 81,
  REQUEST_FAILURE = 82,
  CHANNEL_OPEN = 90,
  CHANNEL_OPEN_CONFIRMATION = 91,
  CHANNEL_OPEN_FAILURE = 92,
  CHANNEL_WINDOW_ADJUST = 93,
  CHANNEL_DATA = 94,
  CHANNEL_CLOSE = 97,
  PROTOCOLVERSION = 192,
  KEEPALIVE_REQUEST = 208,
  KEEPALIVE_REPLY = 209,
  KEEPALIVE_OPTIONS_REQUEST = 210,
  KEEPALIVE_OPTIONS_REPLY = 211,
}

export enum APFDisconnectCode {
  HOST_NOT_ALLOWED_TO_CONNECT = 1,
  PROTOCOL_ERROR = 2,
  KEY_EXCHANGE_FAILED = 3,
  RESERVED = 4,
  MAC_ERROR = 5,
  COMPRESSION_ERROR = 6,
  SERVICE_NOT_AVAILABLE = 7,
  PROTOCOL_VERSION_NOT_SUPPORTED = 8,
  HOST_KEY_NOT_VERIFIABLE = 9,
  CONNECTION_LOST = 10,
  BY_APPLICATION = 11,
  TOO_MANY_CONNECTIONS = 12,
  AUTH_CANCELLED_BY_USER = 13,
  NO_MORE_AUTH_METHODS_AVAILABLE = 14,
  INVALID_CREDENTIALS = 15,
  CONNECTION_TIMED_OUT = 16,
  BY_POLICY = 17,
  TEMPORARILY_UNAVAILABLE = 18,
}

export enum APFChannelOpenFailCodes {
  ADMINISTRATIVELY_PROHIBITED = 1,
  CONNECT_FAILED = 2,
  UNKNOWN_CHANNEL_TYPE = 3,
  RESOURCE_SHORTAGE = 4,
}

export enum APFChannelOpenFailureReasonCode {
  AdministrativelyProhibited = 1,
  ConnectFailed = 2,
  UnknownChannelType = 3,
  ResourceShortage = 4,
}

export const APFPropValueMaxLength = 2048
export const APFBulkDataMaxLength = 1048576

const APFProcessor = {
  APFEvents: new EventEmitter(),
  // Process one APF command
  processCommand: async (socket: CIRASocket): Promise<number> => {
    const data = socket.tag.accumulator
    if (data.length === 0) {
      return 0
    }
    const cmd = socket.tag.accumulator.charCodeAt(0)
    switch (cmd) {
      case APFProtocol.KEEPALIVE_REQUEST:
        return APFProcessor.keepAliveRequest(socket, data.length, data)
      case APFProtocol.KEEPALIVE_REPLY:
        return APFProcessor.keepAliveReply(data.length, data)
      case APFProtocol.KEEPALIVE_OPTIONS_REPLY:
        return APFProcessor.keepAliveOptionsReply(data.length, data)
      case APFProtocol.PROTOCOLVERSION:
        return APFProcessor.protocolVersion(socket, data.length, data)
      case APFProtocol.USERAUTH_REQUEST:
        return APFProcessor.userAuthRequest(socket, data.length, data)
      case APFProtocol.SERVICE_REQUEST:
        return APFProcessor.serviceRequest(socket, data.length, data)
      case APFProtocol.GLOBAL_REQUEST:
        return APFProcessor.globalRequest(socket, data.length, data)
      case APFProtocol.CHANNEL_OPEN:
        return APFProcessor.channelOpen(socket, data.length, data)
      case APFProtocol.CHANNEL_OPEN_CONFIRMATION:
        return APFProcessor.channelOpenConfirmation(socket, data.length, data)
      case APFProtocol.CHANNEL_OPEN_FAILURE:
        return APFProcessor.channelOpenFailure(socket, data.length, data)
      case APFProtocol.CHANNEL_CLOSE:
        return APFProcessor.channelClose(socket, data.length, data)
      case APFProtocol.CHANNEL_WINDOW_ADJUST:
        return APFProcessor.channelWindowAdjust(socket, data.length, data)
      case APFProtocol.CHANNEL_DATA:
        return APFProcessor.channelData(socket, data.length, data)
      case APFProtocol.DISCONNECT:
        return APFProcessor.disconnect(socket, data.length, data)
      default: {
        logger.warn(`${messages.MPS_UNKNOWN_CIRA_COMMAND}: ${cmd}`)
        return -1
      }
    }
  },

  disconnect: (socket: CIRASocket, dataLen: number, data: string): number => {
    if (dataLen < 7) return 0
    let parseIndex: number = 1
    const reasonCode: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    // reserved short
    const reserved: number = Common.ReadShort(data, parseIndex)
    parseIndex += 2
    if (reserved !== 0) {
      logger.warn(`${messages.MPS_WARN_RESERVED_VALUE}, ${reserved.toString()}`)
    }
    logger.silly(`${messages.MPS_DISCONNECT}, ${reasonCode.toString()}`)
    APFProcessor.APFEvents.emit('disconnected', socket.tag.nodeid)
    return parseIndex
  },

  channelData: (socket: CIRASocket, dataLen: number, data: string): number => {
    if (dataLen < 9) {
      return 0
    }
    let parseIndex: number = 1
    const recipientChnlId: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    const chnlDataLen: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    if (chnlDataLen > APFBulkDataMaxLength) {
      logger.warn(`${messages.MPS_ERR_MAXLEN} ${APFBulkDataMaxLength} ` +
        `channelData:chnlDataLen: ${chnlDataLen} `)
      return -1
    }
    if (dataLen < parseIndex + chnlDataLen) {
      return 0
    }
    const chnlData: string = data.substring(parseIndex, parseIndex + chnlDataLen)
    parseIndex += chnlDataLen
    logger.silly(`${messages.MPS_CHANNEL_DATA}, ${recipientChnlId.toString()}, ${chnlDataLen.toString()}`)
    const cirachannel = socket.tag.channels[recipientChnlId]
    if (cirachannel == null) {
      logger.error(`${messages.DATA_NO_CHANNEL_ID} ${recipientChnlId}`)
      return parseIndex
    }
    cirachannel.amtpendingcredits += chnlDataLen
    if (cirachannel.onData) {
      cirachannel.onData(chnlData)
    }
    if (cirachannel.amtpendingcredits > cirachannel.ciraWindow / 2) {
      // Adjust the buffer window
      APFProcessor.SendChannelWindowAdjust(cirachannel.socket,
        cirachannel.amtchannelid,
        cirachannel.amtpendingcredits)
      cirachannel.amtpendingcredits = 0
    }
    return parseIndex
  },

  channelWindowAdjust: (socket: CIRASocket, dataLen: number, data: string): number => {
    if (dataLen < 9) return 0
    let parseIndex: number = 1
    const recipientChnlId: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    const bytesToAdd: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4

    const cirachannel = socket.tag.channels[recipientChnlId]
    if (cirachannel == null) {
      logger.error(`${messages.WINDOW_ADJUST_NO_CHANNEL_ID} ${recipientChnlId}`)
      return parseIndex
    }
    cirachannel.sendcredits += bytesToAdd
    logger.silly(`${messages.MPS_WINDOW_ADJUST}, ${recipientChnlId.toString()}, ${bytesToAdd.toString()}, ${cirachannel.sendcredits}`)
    if (cirachannel.state === 2 && cirachannel.sendBuffer != null) {
      // Compute how much data we can send
      if (cirachannel.sendBuffer.length <= cirachannel.sendcredits) {
        // Send the entire pending buffer
        APFProcessor.SendChannelData(cirachannel.socket, cirachannel.amtchannelid, cirachannel.sendBuffer)
        cirachannel.sendcredits -= cirachannel.sendBuffer.length
        delete cirachannel.sendBuffer
      } else {
        // Send a part of the pending buffer
        APFProcessor.SendChannelData(cirachannel.socket, cirachannel.amtchannelid, cirachannel.sendBuffer.substring(0, cirachannel.sendcredits))
        cirachannel.sendBuffer = cirachannel.sendBuffer.substring(cirachannel.sendcredits)
        cirachannel.sendcredits = 0
      }
    }
    return parseIndex
  },

  channelClose: (socket: CIRASocket, dataLen: number, data: string): number => {
    if (dataLen < 5) return 0
    let parseIndex: number = 1
    const recipientChnlId: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    logger.silly(`${messages.MPS_CHANNEL_CLOSE} ${recipientChnlId.toString()}`)

    const cirachannel = socket.tag.channels[recipientChnlId]
    if (cirachannel == null) {
      logger.error(`${messages.CHANNEL_CLOSE_NO_CHANNEL_ID} ${recipientChnlId}`)
      return parseIndex
    }
    APFProcessor.SendChannelClose(cirachannel.socket, cirachannel.amtchannelid)
    socket.tag.activetunnels--
    if (cirachannel.state > 0) {
      cirachannel.state = 0
      if (cirachannel.onStateChange) {
        cirachannel.onStateChange.emit('stateChange', cirachannel.state)
      }
      delete socket.tag.channels[recipientChnlId]
    }
    return parseIndex
  },

  channelOpenFailure: (socket: CIRASocket, dataLen: number, data: string): number => {
    if (dataLen < 17) {
      return 0
    }
    let parseIndex: number = 1
    const recipientChnlId: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    const reasonCode = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    // reserved 4 bytes
    parseIndex += 4
    // reserved 4 bytes
    parseIndex += 4
    logger.silly(`${messages.MPS_CHANNEL_OPEN_FAILURE}, ${recipientChnlId.toString()}, ${reasonCode.toString()}`)

    const cirachannel = socket.tag.channels[recipientChnlId]
    if (cirachannel == null) {
      logger.error(`${messages.CHANNEL_OPEN_FAILURE_NO_CHANNEL_ID} ${recipientChnlId}`)
      return parseIndex
    }
    if (cirachannel.state > 0) {
      cirachannel.state = 0
      if (cirachannel.onStateChange) {
        cirachannel.onStateChange.emit('stateChange', cirachannel.state)
      }
      delete socket.tag.channels[recipientChnlId]
    }
    return parseIndex
  },

  channelOpenConfirmation: (socket: CIRASocket, dataLen: number, data: string): number => {
    if (dataLen < 17) return 0
    let parseIndex: number = 1
    const recipientChnlId: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    const senderChnlId = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    const windowSize = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    // reserved 4 bytes
    parseIndex += 4

    socket.tag.activetunnels++
    const cirachannel = socket.tag.channels[recipientChnlId]
    if (cirachannel == null) {
      return parseIndex
    }
    cirachannel.amtchannelid = senderChnlId
    cirachannel.sendcredits = cirachannel.amtCiraWindow = windowSize
    logger.silly(`${messages.MPS_CHANNEL_OPEN_CONFIRMATION}, ${recipientChnlId.toString()}, ${senderChnlId.toString()}, ${windowSize.toString()}`)
    if (cirachannel.closing === 1) {
      // Close this channel
      APFProcessor.SendChannelClose(cirachannel.socket, cirachannel.amtchannelid)
    } else {
      cirachannel.state = 2
      // Send any pending data
      if (cirachannel.sendBuffer != null) {
        if (cirachannel.sendBuffer.length <= cirachannel.sendcredits) {
          // Send the entire pending buffer
          APFProcessor.SendChannelData(cirachannel.socket, cirachannel.amtchannelid, cirachannel.sendBuffer)
          cirachannel.sendcredits -= cirachannel.sendBuffer.length
          delete cirachannel.sendBuffer
        } else {
          // Send a part of the pending buffer
          APFProcessor.SendChannelData(cirachannel.socket, cirachannel.amtchannelid, cirachannel.sendBuffer.substring(0, cirachannel.sendcredits))
          cirachannel.sendBuffer = cirachannel.sendBuffer.substring(cirachannel.sendcredits)
          cirachannel.sendcredits = 0
        }
      }
      // Indicate the channel is open
      if (cirachannel.onStateChange) {
        cirachannel.onStateChange.emit('stateChange', cirachannel.state)
      }
    }
    return parseIndex
  },

  channelOpen: (socket: CIRASocket, dataLen: number, data: string): number => {
    if (dataLen < 5) return 0
    let parseIndex: number = 1
    // Channel Type
    const chnlTypeLen: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    if (chnlTypeLen > APFPropValueMaxLength) {
      logger.warn(`${messages.MPS_ERR_MAXLEN} ${APFPropValueMaxLength} ` +
        `channelOpen:chnlTypeLen: ${chnlTypeLen} `)
      return -1
    }
    // add len check here for the next couple of fields too
    if (dataLen < parseIndex + chnlTypeLen + (4 * 4)) {
      return 0
    }
    const chnlType: string = data.substring(parseIndex, parseIndex + chnlTypeLen)
    parseIndex += chnlTypeLen

    // Decode channel identifiers and window size
    const senderChnlId: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    const windowSize: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    // reserved 4 bytes
    parseIndex += 4
    const connectedAddrLen: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    if (connectedAddrLen > APFPropValueMaxLength) {
      logger.warn(`${messages.MPS_ERR_MAXLEN} ${APFPropValueMaxLength} ` +
        `channelOpen:connectedAddrLen: ${connectedAddrLen} `)
      return -1
    }
    if (dataLen < parseIndex + connectedAddrLen + (4 * 2)) {
      return 0
    }
    const connectedAddr: string = data.substring(parseIndex, parseIndex + connectedAddrLen)
    parseIndex += connectedAddrLen
    const connectedPort: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4

    const originatorAddrLen: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    if (originatorAddrLen > APFPropValueMaxLength) {
      logger.warn(`${messages.MPS_ERR_MAXLEN} ${APFPropValueMaxLength} ` +
        `channelOpen:originatorAddrLen: ${originatorAddrLen} `)
      return -1
    }
    if (dataLen < parseIndex + originatorAddrLen + 4) {
      return 0
    }
    const originatorAddr: string = data.substring(parseIndex, parseIndex + originatorAddrLen)
    parseIndex += originatorAddrLen
    const originatorPort: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4

    logger.silly(`${messages.MPS_CHANNEL_OPEN}, ` +
      `${chnlType}, ${senderChnlId.toString()}, ${windowSize.toString()}, ` +
      `${connectedAddr}:${connectedPort}, ${originatorAddr}:${originatorPort}`)

    // Check if we understand this channel type
    // if (ChannelType.toLowerCase() == "direct-tcpip")

    // We don't understand this channel type, send an error back
    APFProcessor.SendChannelOpenFailure(socket, senderChnlId, APFChannelOpenFailureReasonCode.UnknownChannelType)

    // // This is a correct connection. Lets get it setup
    // var MeshAmtEventEndpoint = { ServerChannel: GetNextBindId(), AmtChannel: SenderChannel,
    // MaxWindowSize: APFPropValueMaxLength, CurrentWindowSize:APFPropValueMaxLength, SendWindow: WindowSize,
    // InfoHeader: "Target: " + Target + ":" + TargetPort + ", Source: " + Source + ":" + SourcePort};
    // // TODO: Connect this socket for a WSMAN event
    // SendChannelOpenConfirmation(socket, SenderChannel, MeshAmtEventEndpoint.ServerChannel,
    // MeshAmtEventEndpoint.MaxWindowSize);
    return parseIndex
  },

  globalRequest: (socket: CIRASocket, dataLen: number, data: string): number => {
    // check bounds and parse the request
    if (dataLen < 5) {
      return 0
    }
    let parseIndex: number = 1
    const reqLen: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    if (reqLen > APFPropValueMaxLength) {
      logger.warn(`${messages.MPS_ERR_MAXLEN} ${APFPropValueMaxLength} ` +
        `globalRequest:reqLen: ${reqLen} `)
      return -1
    }
    if (dataLen < parseIndex + reqLen) {
      return 0
    }
    const request: string = data.substring(parseIndex, parseIndex + reqLen)
    parseIndex += reqLen
    // wantResponse is 1 byte, but currently unused
    parseIndex += 1
    // check bounds and parse the host
    if (dataLen < parseIndex + 4) {
      return 0
    }
    // host and port parsed here are common fields to all the messages
    const hostLen = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    if (hostLen > APFPropValueMaxLength) {
      logger.warn(`${messages.MPS_ERR_MAXLEN} ${APFPropValueMaxLength} ` +
        `globalRequest:hostLen: ${hostLen} `)
      return -1
    }
    if (dataLen < parseIndex + hostLen) {
      return 0
    }
    const host = data.substring(parseIndex, parseIndex + hostLen)
    parseIndex += hostLen

    // check bounds and parse the port
    if (dataLen < parseIndex + 4) {
      return 0
    }
    const port = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    logger.silly(`${messages.MPS_GLOBAL_REQUEST} ${socket.tag.nodeid} ${request} ${host}: ${port}`)

    if (request === 'tcpip-forward') {
      // this.ChangeHostname(socket, host)
      if (!socket.tag.boundPorts.includes(port)) {
        socket.tag.boundPorts.push(port)
      }
      logger.silly(`${messages.MPS_GLOBAL_REQUEST_TCPIPFWD_PORTS} ${socket.tag.boundPorts}`)
      APFProcessor.SendTcpForwardSuccessReply(socket, port)
      // 5900 port is the last TCP port on which connections for forwarding are to be cancelled.
      // Ports order: 16993, 16992, 664, 623, 16995, 16994, 5900
      // Request keepalive interval time
      if (port === 5900) {
        APFProcessor.SendKeepaliveOptionsRequest(socket, KEEPALIVE_INTERVAL, 0)
      }
    }

    if (request === 'cancel-tcpip-forward') {
      const portindex = socket.tag.boundPorts.indexOf(port)
      if (portindex >= 0) {
        socket.tag.boundPorts.splice(portindex, 1)
      }
      logger.silly(`${messages.MPS_GLOBAL_REQUEST_TCPIPFWD_PORTS} ${socket.tag.boundPorts}`)
      APFProcessor.SendTcpForwardCancelReply(socket)
    }

    if (request === 'udp-send-to@amt.intel.com') {
      // check bounds and parse the email host
      if (dataLen < parseIndex + 4) {
        return 0
      }
      const originatorAddrLen = Common.ReadInt(data, parseIndex)
      parseIndex += 4
      if (originatorAddrLen > APFPropValueMaxLength) {
        logger.warn(`${messages.MPS_ERR_MAXLEN} ${APFPropValueMaxLength} ` +
          `globalRequest:udpSendToHostLen: ${originatorAddrLen} `)
        return -1
      }
      if (dataLen < parseIndex + originatorAddrLen) {
        return 0
      }
      const originatorAddr = data.substring(parseIndex, parseIndex + originatorAddrLen)
      parseIndex += originatorAddrLen
      // check bounds and parse the email port
      if (dataLen < parseIndex + 4) {
        return 0
      }
      const originatorPort = Common.ReadInt(data, parseIndex)
      parseIndex += 4
      // check bounds and parse the email message
      if (dataLen < parseIndex + 4) {
        return 0
      }
      const udpMsgLen = Common.ReadInt(data, parseIndex)
      parseIndex += 4
      // max message size is 64KB
      const maxUdpMsgLen = 65536
      if (udpMsgLen > maxUdpMsgLen) {
        logger.warn(`${messages.MPS_ERR_MAXLEN} ${maxUdpMsgLen} ` +
          `globalRequest:udpSendToMsg: ${udpMsgLen} `)
        return -1
      }
      if (dataLen < parseIndex + udpMsgLen) {
        return 0
      }
      const msgEmail = data.substring(parseIndex, parseIndex + udpMsgLen)
      parseIndex += udpMsgLen
      logger.silly(`${messages.MPS_GLOBAL_REQUEST}, 
      ${originatorAddr}:${originatorPort}, 
      ${udpMsgLen.toString()}, ${msgEmail}`)
      // TODO
    }

    return parseIndex
  },

  serviceRequest: (socket: CIRASocket, dataLen: number, data: string): number => {
    if (dataLen < 5) return 0
    let parseIndex: number = 1
    const serviceNameLen: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    if (serviceNameLen > APFPropValueMaxLength) {
      logger.warn(`${messages.MPS_ERR_MAXLEN} ${APFPropValueMaxLength} ` +
        `serviceRequest:svcNameLen: ${serviceNameLen} `)
      return -1
    }
    if (dataLen < parseIndex + serviceNameLen) {
      return 0
    }
    const serviceName: string = data.substring(parseIndex, parseIndex + serviceNameLen)
    parseIndex += serviceNameLen
    logger.silly(`${messages.MPS_SERVICE_REQUEST}: ${serviceName}`)
    if (serviceName === 'pfwd@amt.intel.com') {
      APFProcessor.SendServiceAccept(socket, 'pfwd@amt.intel.com')
    }
    if (serviceName === 'auth@amt.intel.com') {
      APFProcessor.SendServiceAccept(socket, 'auth@amt.intel.com')
    }
    return parseIndex
  },

  userAuthRequest: (socket: CIRASocket, dataLen: number, data: string): number => {
    if (dataLen < 5) {
      return 0
    }
    const maxLen64: number = 64
    let parseIndex: number = 1
    // username ASCII encoding, maximum allowed size is 64 bytes.
    const userLen: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    if (userLen > maxLen64) {
      logger.warn(`${messages.MPS_ERR_MAXLEN} ${maxLen64} ` +
        `userAuthRequest:userLen: ${userLen} `)
      return -1
    }
    if (dataLen < parseIndex + userLen + 4) {
      return 0
    }
    const user: string = data.substring(parseIndex, parseIndex + userLen)
    parseIndex += userLen
    // service name: only supported name is "pfwd@amt.intel.com"
    const serviceLen: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    if (serviceLen > APFPropValueMaxLength) {
      logger.warn(`${messages.MPS_ERR_MAXLEN} ${APFPropValueMaxLength} ` +
        `userAuthRequest:serviceLen: ${serviceLen} `)
      return -1
    }
    if (dataLen < parseIndex + serviceLen + 4) {
      return 0
    }
    const service: string = data.substring(parseIndex, parseIndex + serviceLen)
    parseIndex += serviceLen
    // authentication method only defined methods are "none" and "password".
    const authMethodLen: number = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    if (authMethodLen > APFPropValueMaxLength) {
      logger.warn(`${messages.MPS_ERR_MAXLEN} ${APFPropValueMaxLength} ` +
        `userAuthRequest:authMethodLen: ${authMethodLen} `)
      return -1
    }
    if (dataLen < parseIndex + authMethodLen) {
      return 0
    }
    const authMethod: string = data.substring(parseIndex, parseIndex + authMethodLen)
    parseIndex += authMethodLen

    let password: string = null
    if (authMethod === 'password') {
      // password plaintext ASCII encoding, maximum allowed size is 64 bytes.
      if (dataLen < parseIndex + 5) {
        return 0
      }
      // reserved byte
      const reserved: number = data.charCodeAt(parseIndex)
      parseIndex += 1
      if (reserved !== 0) {
        logger.warn(`${messages.MPS_WARN_RESERVED_VALUE}, ${reserved.toString()}`)
      }
      const passwordLen: number = Common.ReadInt(data, parseIndex)
      parseIndex += 4
      if (passwordLen > maxLen64) {
        logger.warn(`${messages.MPS_ERR_MAXLEN} ${maxLen64} userAuthRequest:password`)
        return -1
      }
      if (dataLen < parseIndex + passwordLen) {
        return 0
      }
      password = data.substring(parseIndex, parseIndex + passwordLen)
      parseIndex += passwordLen
      logger.silly(`${messages.MPS_USER_AUTH_REQUEST} userAuthRequest:password has been parsed`)
    }
    logger.silly(`${messages.MPS_USER_AUTH_REQUEST} user=${user} service=${service} method=${authMethod}`)

    // Emit event to determine if user is authorized
    // TODO: verify this works correctly
    APFProcessor.APFEvents.emit('userAuthRequest', socket, user, password)

    return parseIndex
  },

  protocolVersion: (socket: CIRASocket, dataLen: number, data: string): number => {
    if (dataLen < 93) return 0
    let parseIndex = 1
    const majorVersion = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    const minorVersion = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    // reserved 4 bytes
    parseIndex += 4
    const rstr = data.substring(parseIndex, parseIndex + 16)
    parseIndex += 16
    // reserved 64 bytes
    parseIndex += 64

    socket.tag.MajorVersion = majorVersion
    socket.tag.MinorVersion = minorVersion
    socket.tag.SystemId = APFProcessor.guidToStr(Common.Rstr2hex(rstr)).toLowerCase()

    logger.silly(`${messages.MPS_PROTOCOL_VERSION}, ` +
      `${socket.tag.MajorVersion}, ` +
      `${socket.tag.MinorVersion}, ` +
      `${socket.tag.SystemId}`
    )
    // TODO: verify this works correctly
    APFProcessor.APFEvents.emit('protocolVersion', socket)
    logger.silly(`device uuid: ${socket.tag.SystemId} and socketid : ${socket.tag.id}`)
    return parseIndex
  },

  keepAliveReply: (dataLen: number, data: string): number => {
    if (dataLen < 5) {
      return 0
    }
    let parseIndex = 1
    const cookie = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    logger.silly(`${messages.MPS_KEEPALIVE_REPLY}: ${cookie}`)
    return parseIndex
  },

  keepAliveOptionsReply: (dataLen: number, data: string): number => {
    if (dataLen < 9) return 0
    let parseIndex = 1
    const keepAliveInterval = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    const readTimeout = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    logger.silly(`KEEPALIVE_OPTIONS_REPLY, Keepalive Interval=${keepAliveInterval} Timeout=${readTimeout}`)
    return parseIndex
  },

  keepAliveRequest: (socket: CIRASocket, dataLen: number, data: string): number => {
    if (dataLen < 5) {
      return 0
    }
    let parseIndex = 1
    const cookie = Common.ReadInt(data, parseIndex)
    parseIndex += 4
    logger.verbose(`${messages.MPS_KEEPALIVE_REQUEST}: ${socket.tag.nodeid} ${cookie}`)
    APFProcessor.SendKeepAliveReply(socket, cookie)
    return parseIndex
  },

  SendKeepaliveOptionsRequest: (socket: CIRASocket, keepaliveTime: number, timeout: number): void => {
    logger.silly(messages.MPS_SEND_KEEPALIVE_OPTIONS_REQUEST)
    APFProcessor.Write(
      socket,
      String.fromCharCode(APFProtocol.KEEPALIVE_OPTIONS_REQUEST) +
      Common.IntToStr(keepaliveTime) +
      Common.IntToStr(timeout)
    )
  },

  SendKeepAliveReply: (socket: CIRASocket, cookie: number): void => {
    logger.silly(messages.MPS_SEND_KEEPALIVE_REPLY)
    APFProcessor.Write(socket, String.fromCharCode(APFProtocol.KEEPALIVE_REPLY) + Common.IntToStr(cookie))
  },

  SendServiceAccept: (socket: CIRASocket, service: string): void => {
    logger.silly(messages.MPS_SEND_SERVICE_ACCEPT)
    APFProcessor.Write(socket, String.fromCharCode(APFProtocol.SERVICE_ACCEPT) + Common.IntToStr(service.length) + service)
  },

  SendTcpForwardSuccessReply: (socket: CIRASocket, port: number): void => {
    logger.silly(messages.MPS_SEND_TCP_FORWARD_SUCCESS_REPLY)
    APFProcessor.Write(socket, String.fromCharCode(APFProtocol.REQUEST_SUCCESS) + Common.IntToStr(port))
  },

  SendTcpForwardCancelReply: (socket: CIRASocket): void => {
    logger.silly(messages.MPS_SEND_TCP_FORWARD_CANCEL_REPLY)
    APFProcessor.Write(socket, String.fromCharCode(APFProtocol.REQUEST_SUCCESS))
  },

  SendKeepAliveRequest: (socket: CIRASocket, cookie: number): void => {
    logger.silly(messages.MPS_SEND_KEEP_ALIVE_REQUEST)
    APFProcessor.Write(socket, String.fromCharCode(APFProtocol.KEEPALIVE_REQUEST) + Common.IntToStr(cookie))
  },

  SendChannelOpenFailure: (socket: CIRASocket, senderChannel, reasonCode: number): void => {
    logger.silly(messages.MPS_SEND_CHANNEL_OPEN_FAILURE)
    APFProcessor.Write(
      socket,
      String.fromCharCode(APFProtocol.CHANNEL_OPEN_FAILURE) +
      Common.IntToStr(senderChannel) +
      Common.IntToStr(reasonCode) +
      Common.IntToStr(0) +
      Common.IntToStr(0)
    )
  },

  SendChannelOpenConfirmation: (socket: CIRASocket,
    recipientChannelId: number,
    senderChannelId: number,
    initialWindowSize: number): void => {
    logger.silly(messages.MPS_SEND_CHANNEL_OPEN_CONFIRMATION)
    APFProcessor.Write(
      socket,
      String.fromCharCode(APFProtocol.CHANNEL_OPEN_CONFIRMATION) +
      Common.IntToStr(recipientChannelId) +
      Common.IntToStr(senderChannelId) +
      Common.IntToStr(initialWindowSize) +
      Common.IntToStr(-1)
    )
  },

  SendChannelOpen: (socket: CIRASocket,
    direct: boolean,
    channelid: number,
    windowSize: number,
    target: string,
    targetPort: number,
    source: string,
    sourcePort: number): void => {
    logger.silly(messages.MPS_SEND_CHANNEL_OPEN)
    const connectionType = direct ? 'direct-tcpip' : 'forwarded-tcpip'
    // TODO: Reports of target being undefined that causes target.length to fail. This is a hack.
    if (target == null || typeof target === 'undefined') target = ''
    APFProcessor.Write(
      socket,
      String.fromCharCode(APFProtocol.CHANNEL_OPEN) +
      Common.IntToStr(connectionType.length) +
      connectionType +
      Common.IntToStr(channelid) +
      Common.IntToStr(windowSize) +
      Common.IntToStr(-1) +
      Common.IntToStr(target.length) +
      target +
      Common.IntToStr(targetPort) +
      Common.IntToStr(source.length) +
      source +
      Common.IntToStr(sourcePort)
    )
  },

  SendChannelClose: (socket: CIRASocket, channelid: number): void => {
    logger.silly(`${messages.MPS_SEND_CHANNEL_CLOSE}, ${channelid}`)
    APFProcessor.Write(socket, String.fromCharCode(APFProtocol.CHANNEL_CLOSE) + Common.IntToStr(channelid))
  },

  SendChannelData: (socket: CIRASocket, channelid: number, data: string): void => {
    logger.silly(`${messages.MPS_SEND_CHANNEL_DATA}, ${channelid}`)
    APFProcessor.Write(
      socket,
      String.fromCharCode(APFProtocol.CHANNEL_DATA) +
      Common.IntToStr(channelid) +
      Common.IntToStr(data.length) +
      data
    )
  },

  SendChannelWindowAdjust: (socket: CIRASocket, channelid: number, bytestoadd: number): void => {
    logger.silly(`${messages.MPS_SEND_CHANNEL_WINDOW_ADJUST}, ${channelid}, ${bytestoadd}`)
    APFProcessor.Write(
      socket,
      String.fromCharCode(APFProtocol.CHANNEL_WINDOW_ADJUST) +
      Common.IntToStr(channelid) +
      Common.IntToStr(bytestoadd)
    )
  },

  SendDisconnect: (socket: CIRASocket, reasonCode: number): void => {
    logger.silly(`${messages.MPS_SEND_CHANNEL_DISCONNECT}, ${reasonCode}`)
    APFProcessor.Write(
      socket,
      String.fromCharCode(APFProtocol.DISCONNECT) +
      Common.IntToStr(reasonCode) +
      Common.ShortToStr(0)
    )
  },

  SendUserAuthFail: (socket: CIRASocket): void => {
    logger.silly(messages.MPS_SEND_USER_AUTH_FAIL)
    APFProcessor.Write(
      socket,
      String.fromCharCode(APFProtocol.USERAUTH_FAILURE) +
      Common.IntToStr(8) +
      'password' +
      String.fromCharCode(0)
    )
  },

  SendUserAuthSuccess: (socket: CIRASocket): void => {
    logger.silly(messages.MPS_SEND_USER_AUTH_SUCCESS)
    APFProcessor.Write(socket, String.fromCharCode(APFProtocol.USERAUTH_SUCCESS))
  },

  Write: (socket: CIRASocket, data: string): void => {
    socket.write(Buffer.from(data, 'binary'))
  },

  guidToStr: (g: string): string => {
    return (
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
}

export default APFProcessor
