/*********************************************************************
 * Copyright (c) Intel Corporation 2018-2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { logger } from '../utils/logger'
import Common from '../utils/common'
import { CIRASocket } from '../models/models'
import { EventEmitter } from 'stream'

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

const APFProcessor = {
  APFEvents: new EventEmitter(),
  // Process one APF command
  processCommand: async (socket: CIRASocket): Promise<number> => {
    const cmd = socket.tag.accumulator.charCodeAt(0)
    const len = socket.tag.accumulator.length
    const data = socket.tag.accumulator
    if (len === 0) {
      return 0
    }

    switch (cmd) {
      case APFProtocol.KEEPALIVE_REQUEST:
        return APFProcessor.keepAliveRequest(socket, len, data)
      case APFProtocol.KEEPALIVE_REPLY:
        return APFProcessor.keepAliveReply(len)
      case APFProtocol.PROTOCOLVERSION:
        return APFProcessor.protocolVersion(socket, len, data)
      case APFProtocol.USERAUTH_REQUEST:
        return APFProcessor.userAuthRequest(socket, len, data)
      case APFProtocol.SERVICE_REQUEST:
        return APFProcessor.serviceRequest(socket, len, data)
      case APFProtocol.GLOBAL_REQUEST:
        return APFProcessor.globalRequest(socket, len, data)
      case APFProtocol.CHANNEL_OPEN:
        return APFProcessor.channelOpen(socket, len, data)
      case APFProtocol.CHANNEL_OPEN_CONFIRMATION:
        return APFProcessor.channelOpenConfirmation(socket, len, data)
      case APFProtocol.CHANNEL_OPEN_FAILURE:
        return APFProcessor.channelOpenFailure(socket, len, data)
      case APFProtocol.CHANNEL_CLOSE:
        return APFProcessor.channelClose(socket, len, data)
      case APFProtocol.CHANNEL_WINDOW_ADJUST:
        return APFProcessor.channelWindowAdjust(socket, len, data)
      case APFProtocol.CHANNEL_DATA:
        return APFProcessor.channelData(socket, len, data)
      case APFProtocol.DISCONNECT:
        return APFProcessor.disconnect(socket, len, data)
      default: {
        logger.warn(`MPS:Unknown CIRA command: ${cmd}`)
        return -1
      }
    }
  },

  disconnect: (socket: CIRASocket, len: number, data: string): number => {
    if (len < 7) return 0
    const ReasonCode: number = Common.ReadInt(data, 1)
    logger.silly(`MPS:DISCONNECT, ${ReasonCode.toString()}`)
    APFProcessor.APFEvents.emit('disconnected', socket.tag.nodeid)
    return 7
  },

  channelData: (socket: CIRASocket, len: number, data: string): number => {
    if (len < 9) return 0
    const RecipientChannel: number = Common.ReadInt(data, 1)
    const LengthOfData: number = Common.ReadInt(data, 5)
    if (len < 9 + LengthOfData) return 0
    logger.silly(`MPS: CHANNEL_DATA, ${RecipientChannel.toString()}, ${LengthOfData.toString()}`)
    const cirachannel = socket.tag.channels[RecipientChannel]
    if (cirachannel == null) {
      logger.error(`MPS Error in CHANNEL_DATA: Unable to find channelid ${RecipientChannel}`)
      return 9 + LengthOfData
    }
    cirachannel.amtpendingcredits += LengthOfData
    if (cirachannel.onData) { cirachannel.onData(data.substring(9, 9 + LengthOfData)) }
    if (cirachannel.amtpendingcredits > cirachannel.ciraWindow / 2) {
      APFProcessor.SendChannelWindowAdjust(cirachannel.socket, cirachannel.amtchannelid, cirachannel.amtpendingcredits) // Adjust the buffer window
      cirachannel.amtpendingcredits = 0
    }
    return 9 + LengthOfData
  },

  channelWindowAdjust: (socket: CIRASocket, len: number, data: string): number => {
    if (len < 9) return 0
    const RecipientChannel = Common.ReadInt(data, 1)
    const ByteToAdd = Common.ReadInt(data, 5)
    const cirachannel = socket.tag.channels[RecipientChannel]
    if (cirachannel == null) {
      logger.error(`MPS Error in CHANNEL_WINDOW_ADJUST: Unable to find channelid ${RecipientChannel}`)
      return 9
    }
    cirachannel.sendcredits += ByteToAdd
    logger.silly(`MPS: CHANNEL_WINDOW_ADJUST, ${RecipientChannel.toString()}, ${ByteToAdd.toString()}, ${cirachannel.sendcredits}`)
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
    return 9
  },

  channelClose: (socket: CIRASocket, len: number, data: string): number => {
    if (len < 5) return 0
    const RecipientChannel: number = Common.ReadInt(data, 1)
    logger.silly(`MPS: CHANNEL_CLOSE ${RecipientChannel.toString()}`)
    const cirachannel = socket.tag.channels[RecipientChannel]
    if (cirachannel == null) {
      logger.error(`MPS Error in CHANNEL_CLOSE: Unable to find channelid ${RecipientChannel}`)
      return 5
    }
    APFProcessor.SendChannelClose(cirachannel.socket, cirachannel.amtchannelid)
    socket.tag.activetunnels--
    if (cirachannel.state > 0) {
      cirachannel.state = 0
      if (cirachannel.onStateChange) {
        cirachannel.onStateChange.emit('stateChange', cirachannel.state)
      }
      delete socket.tag.channels[RecipientChannel]
    }
    return 5
  },

  channelOpenFailure: (socket: CIRASocket, length: number, data: string): number => {
    if (length < 17) return 0
    const recipientChannel = Common.ReadInt(data, 1)
    const reasonCode = Common.ReadInt(data, 5)
    logger.silly(`MPS: CHANNEL_OPEN_FAILURE, ${recipientChannel.toString()}, ${reasonCode.toString()}`)
    const cirachannel = socket.tag.channels[recipientChannel]
    if (cirachannel == null) {
      logger.error(`MPS Error in CHANNEL_OPEN_FAILURE: Unable to find channelid ${recipientChannel}`)
      return 17
    }
    if (cirachannel.state > 0) {
      cirachannel.state = 0
      if (cirachannel.onStateChange) {
        cirachannel.onStateChange.emit('stateChange', cirachannel.state)
      }
      delete socket.tag.channels[recipientChannel]
    }
    return 17
  },

  channelOpenConfirmation: (socket: CIRASocket, length: number, data: string): number => {
    if (length < 17) return 0
    const recipientChannel = Common.ReadInt(data, 1)
    const senderChannel = Common.ReadInt(data, 5)
    const windowSize = Common.ReadInt(data, 9)
    socket.tag.activetunnels++
    const cirachannel = socket.tag.channels[recipientChannel]
    if (cirachannel == null) {
      return 17
    }
    cirachannel.amtchannelid = senderChannel
    cirachannel.sendcredits = cirachannel.amtCiraWindow = windowSize
    logger.silly(`MPS: CHANNEL_OPEN_CONFIRMATION, ${recipientChannel.toString()}, ${senderChannel.toString()}, ${windowSize.toString()}`)
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
    return 17
  },

  channelOpen: (socket: CIRASocket, length: number, data: string): number => {
    if (length < 33) return 0
    const ChannelTypeLength: number = Common.ReadInt(data, 1)
    if (length < 33 + ChannelTypeLength) return 0

    // Decode channel identifiers and window size
    const ChannelType: string = data.substring(5, 5 + ChannelTypeLength)
    const SenderChannel: number = Common.ReadInt(data, 5 + ChannelTypeLength)
    const WindowSize: number = Common.ReadInt(data, 9 + ChannelTypeLength)

    // Decode the target
    const TargetLen: number = Common.ReadInt(data, 17 + ChannelTypeLength)
    if (length < 33 + ChannelTypeLength + TargetLen) return 0
    const Target: string = data.substring(21 + ChannelTypeLength, 21 + ChannelTypeLength + TargetLen)
    const TargetPort: number = Common.ReadInt(data, 21 + ChannelTypeLength + TargetLen)

    // Decode the source
    const SourceLen: number = Common.ReadInt(data, 25 + ChannelTypeLength + TargetLen)
    if (length < 33 + ChannelTypeLength + TargetLen + SourceLen) return 0
    const Source: string = data.substring(29 + ChannelTypeLength + TargetLen, 29 + ChannelTypeLength + TargetLen + SourceLen)
    const SourcePort: number = Common.ReadInt(data, 29 + ChannelTypeLength + TargetLen + SourceLen)

    logger.silly(`MPS: CHANNEL_OPEN, ${ChannelType}, ${SenderChannel.toString()}, ${WindowSize.toString()}, ${Target}:${TargetPort}, ${Source}:${SourcePort}`)

    // Check if we understand this channel type
    // if (ChannelType.toLowerCase() == "direct-tcpip")

    // We don't understand this channel type, send an error back
    APFProcessor.SendChannelOpenFailure(socket, SenderChannel, APFChannelOpenFailureReasonCode.UnknownChannelType)
    return 33 + ChannelTypeLength + TargetLen + SourceLen

    /*
    // This is a correct connection. Lets get it setup
    var MeshAmtEventEndpoint = { ServerChannel: GetNextBindId(), AmtChannel: SenderChannel, MaxWindowSize: 2048, CurrentWindowSize:2048, SendWindow: WindowSize, InfoHeader: "Target: " + Target + ":" + TargetPort + ", Source: " + Source + ":" + SourcePort};
    // TODO: Connect this socket for a WSMAN event
    SendChannelOpenConfirmation(socket, SenderChannel, MeshAmtEventEndpoint.ServerChannel, MeshAmtEventEndpoint.MaxWindowSize);
    */
  },

  globalRequest: (socket: CIRASocket, length: number, data: string): number => {
    if (length < 14) return 0
    const requestLen: number = Common.ReadInt(data, 1)
    if (length < 14 + requestLen) return 0
    const request: string = data.substring(5, 5 + requestLen)
    // const wantResponse: string = data.charCodeAt(5 + requestLen)

    if (request === 'tcpip-forward') {
      const addrLen: number = Common.ReadInt(data, 6 + requestLen)
      if (length < 14 + requestLen + addrLen) return 0
      let addr = data.substring(10 + requestLen, 10 + requestLen + addrLen)
      const port = Common.ReadInt(data, 10 + requestLen + addrLen)
      if (addr === '') addr = undefined
      logger.silly(`MPS: GLOBAL_REQUEST ${socket.tag.nodeid} ${request} ${addr}: ${port}`)
      // this.ChangeHostname(socket, addr)
      if (!socket.tag.boundPorts.includes(port)) {
        socket.tag.boundPorts.push(port)
      }
      APFProcessor.SendTcpForwardSuccessReply(socket, port)
      return 14 + requestLen + addrLen
    }

    if (request === 'cancel-tcpip-forward') {
      const addrLen = Common.ReadInt(data, 6 + requestLen)
      if (length < 14 + requestLen + addrLen) return 0
      const addr = data.substring(10 + requestLen, 10 + requestLen + addrLen)
      const port = Common.ReadInt(data, 10 + requestLen + addrLen)
      logger.silly(`MPS: GLOBAL_REQUEST, ${request}, ${addr}:${port}`)
      const portindex = socket.tag.boundPorts.indexOf(port)
      if (portindex >= 0) {
        socket.tag.boundPorts.splice(portindex, 1)
      }
      APFProcessor.SendTcpForwardCancelReply(socket)
      return 14 + requestLen + addrLen
    }

    if (request === 'udp-send-to@amt.intel.com') {
      const addrLen = Common.ReadInt(data, 6 + requestLen)
      if (length < 26 + requestLen + addrLen) return 0
      const addr = data.substring(10 + requestLen, 10 + requestLen + addrLen)
      const port = Common.ReadInt(data, 10 + requestLen + addrLen)
      const oaddrLen = Common.ReadInt(data, 14 + requestLen + addrLen)
      if (length < 26 + requestLen + addrLen + oaddrLen) return 0
      const oaddr = data.substring(18 + requestLen, 18 + requestLen + addrLen)
      const oport = Common.ReadInt(data, 18 + requestLen + addrLen + oaddrLen)
      const datalen = Common.ReadInt(data, 22 + requestLen + addrLen + oaddrLen)
      if (length < 26 + requestLen + addrLen + oaddrLen + datalen) return 0
      logger.silly(`MPS: GLOBAL_REQUEST, ${request}, ${addr}:${port}, ${oaddr}:${oport}, ${datalen.toString()}`)
      // TODO
      return 26 + requestLen + addrLen + oaddrLen + datalen
    }

    return 6 + requestLen
  },

  serviceRequest: (socket: CIRASocket, length: number, data: string): number => {
    if (length < 5) return 0
    const serviceNameLen: number = Common.ReadInt(data, 1)
    if (length < 5 + serviceNameLen) return 0
    const serviceName = data.substring(5, 5 + serviceNameLen)
    logger.silly(`MPS: SERVICE_REQUEST: ${serviceName}`)
    if (serviceName === 'pfwd@amt.intel.com') {
      APFProcessor.SendServiceAccept(socket, 'pfwd@amt.intel.com')
    }
    if (serviceName === 'auth@amt.intel.com') {
      APFProcessor.SendServiceAccept(socket, 'auth@amt.intel.com')
    }
    return 5 + serviceNameLen
  },

  userAuthRequest: (socket: CIRASocket, length: number, data: string): number => {
    if (length < 13) return 0
    const usernameLen: number = Common.ReadInt(data, 1)
    const username: string = data.substring(5, 5 + usernameLen)
    const serviceNameLen: number = Common.ReadInt(data, 5 + usernameLen)
    const serviceName: string = data.substring(
      9 + usernameLen,
      9 + usernameLen + serviceNameLen
    )
    const methodNameLen: number = Common.ReadInt(
      data,
      9 + usernameLen + serviceNameLen
    )
    const methodName: string = data.substring(
      13 + usernameLen + serviceNameLen,
      13 + usernameLen + serviceNameLen + methodNameLen
    )
    let passwordLen = 0
    let password: string = null
    if (methodName === 'password') {
      passwordLen = Common.ReadInt(data, 14 + usernameLen + serviceNameLen + methodNameLen)
      password = data.substring(18 + usernameLen + serviceNameLen + methodNameLen, 18 + usernameLen + serviceNameLen + methodNameLen + passwordLen)
    }
    logger.silly(`MPS: USERAUTH_REQUEST usernameLen=${usernameLen} serviceNameLen=${serviceNameLen} methodNameLen=${methodNameLen}`)
    logger.silly(`MPS: USERAUTH_REQUEST user=${username} service=${serviceName} method=${methodName}`)

    // Emit event to determine if user is authorized
    // TODO: verify this works correctly
    APFProcessor.APFEvents.emit('userAuthRequest', socket, username, password)

    return 18 + usernameLen + serviceNameLen + methodNameLen + passwordLen
  },

  protocolVersion: (socket: CIRASocket, length: number, data: string): number => {
    if (length < 93) return 0
    socket.tag.MajorVersion = Common.ReadInt(data, 1)
    socket.tag.MinorVersion = Common.ReadInt(data, 5)
    socket.tag.SystemId = APFProcessor.guidToStr(
      Common.Rstr2hex(data.substring(13, 29))
    ).toLowerCase()
    logger.silly(
      `MPS: PROTOCOLVERSION, ${socket.tag.MajorVersion}, ${socket.tag.MinorVersion}, ${socket.tag.SystemId}`
    )
    // TODO: verify this works correctly

    APFProcessor.APFEvents.emit('protocolVersion', socket)

    logger.silly(`device uuid: ${socket.tag.SystemId}`)
    return 93
  },

  keepAliveReply: (length: Number): number => {
    if (length < 5) return 0
    logger.silly('MPS: KEEPALIVE_REPLY')
    return 5
  },

  keepAliveRequest: (socket: CIRASocket, length: number, data: string): number => {
    if (length < 5) {
      return 0
    }
    logger.verbose(`MPS: KEEPALIVE_REQUEST: ${socket.tag.nodeid}`)
    APFProcessor.SendKeepAliveReply(socket, Common.ReadInt(data, 1))
    return 5
  },

  SendKeepAliveReply: (socket: CIRASocket, cookie): void => {
    logger.silly('MPS: SendKeepAliveReply')
    APFProcessor.Write(socket, String.fromCharCode(APFProtocol.KEEPALIVE_REPLY) + Common.IntToStr(cookie))
  },

  SendServiceAccept: (socket: CIRASocket, service: string): void => {
    logger.silly('MPS: SendServiceAccept')
    APFProcessor.Write(socket, String.fromCharCode(APFProtocol.SERVICE_ACCEPT) + Common.IntToStr(service.length) + service)
  },

  SendTcpForwardSuccessReply: (socket: CIRASocket, port): void => {
    logger.silly('MPS: SendTcpForwardSuccessReply')
    APFProcessor.Write(socket, String.fromCharCode(APFProtocol.REQUEST_SUCCESS) + Common.IntToStr(port))
  },

  SendTcpForwardCancelReply: (socket: CIRASocket): void => {
    logger.silly('MPS: SendTcpForwardCancelReply')
    APFProcessor.Write(socket, String.fromCharCode(APFProtocol.REQUEST_SUCCESS))
  },

  SendKeepAliveRequest: (socket: CIRASocket, cookie): void => {
    logger.silly('MPS: SendKeepAliveRequest')
    APFProcessor.Write(socket, String.fromCharCode(APFProtocol.KEEPALIVE_REQUEST) + Common.IntToStr(cookie))
  },

  SendChannelOpenFailure: (socket: CIRASocket, senderChannel, reasonCode): void => {
    logger.silly('MPS: SendChannelOpenFailure')
    APFProcessor.Write(
      socket,
      String.fromCharCode(APFProtocol.CHANNEL_OPEN_FAILURE) +
        Common.IntToStr(senderChannel) +
        Common.IntToStr(reasonCode) +
        Common.IntToStr(0) +
        Common.IntToStr(0)
    )
  },

  SendChannelOpenConfirmation: (socket: CIRASocket, recipientChannelId, senderChannelId, initialWindowSize): void => {
    logger.silly('MPS: SendChannelOpenConfirmation')
    APFProcessor.Write(
      socket,
      String.fromCharCode(APFProtocol.CHANNEL_OPEN_CONFIRMATION) +
        Common.IntToStr(recipientChannelId) +
        Common.IntToStr(senderChannelId) +
        Common.IntToStr(initialWindowSize) +
        Common.IntToStr(-1)
    )
  },

  SendChannelOpen: (socket: CIRASocket, direct: boolean, channelid: number, windowSize: number, target: string, targetPort: number, source: string, sourcePort: number
  ): void => {
    logger.silly('MPS: SendChannelOpen')
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

  SendChannelClose: (socket: CIRASocket, channelid): void => {
    logger.silly(`MPS: SendChannelClose, ${channelid}`)
    APFProcessor.Write(socket, String.fromCharCode(APFProtocol.CHANNEL_CLOSE) + Common.IntToStr(channelid))
  },

  SendChannelData: (socket: CIRASocket, channelid, data): void => {
    logger.silly(`MPS: SendChannelData, ${channelid}`)
    APFProcessor.Write(
      socket,
      String.fromCharCode(APFProtocol.CHANNEL_DATA) +
        Common.IntToStr(channelid) +
        Common.IntToStr(data.length) +
        data
    )
  },

  SendChannelWindowAdjust: (socket: CIRASocket, channelid, bytestoadd): void => {
    logger.silly(`MPS: SendChannelWindowAdjust, ${channelid}, ${bytestoadd}`)
    APFProcessor.Write(
      socket,
      String.fromCharCode(APFProtocol.CHANNEL_WINDOW_ADJUST) +
        Common.IntToStr(channelid) +
        Common.IntToStr(bytestoadd)
    )
  },

  SendDisconnect: (socket: CIRASocket, reasonCode): void => {
    logger.silly(`MPS: SendDisconnect, ${reasonCode}`)
    APFProcessor.Write(
      socket,
      String.fromCharCode(APFProtocol.DISCONNECT) +
        Common.IntToStr(reasonCode) +
        Common.ShortToStr(0)
    )
  },

  SendUserAuthFail: (socket: CIRASocket): void => {
    logger.silly('MPS: SendUserAuthFail')
    APFProcessor.Write(
      socket,
      String.fromCharCode(APFProtocol.USERAUTH_FAILURE) +
        Common.IntToStr(8) +
        'password' +
        Common.ShortToStr(0)
    )
  },

  SendUserAuthSuccess: (socket: CIRASocket): void => {
    logger.silly('MPS: SendUserAuthSuccess')
    APFProcessor.Write(socket, String.fromCharCode(APFProtocol.USERAUTH_SUCCESS))
  },

  Write: (socket: CIRASocket, data): void => {
    socket.write(Buffer.from(data, 'binary'))
  },

  guidToStr: (g): string => {
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
