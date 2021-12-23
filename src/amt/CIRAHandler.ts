/*********************************************************************
* Copyright (c) Intel Corporation 2018-2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { CIRASocket } from '../models/models'
import APFProcessor from './APFProcessor'
import { connectionParams, HttpHandler } from './HttpHandler'
import { logger } from '../utils/logger'
import httpZ from 'http-z'
import { amtPort } from '../utils/constants'
import { DigestChallenge, Enumerate, Pull } from '@open-amt-cloud-toolkit/wsman-messages/dist/models/common'
import { Common } from '@open-amt-cloud-toolkit/wsman-messages/dist'
export interface CIRAChannel {
  targetport: number
  channelid: number
  socket: CIRASocket
  state: number
  sendcredits: number
  amtpendingcredits: number
  amtCiraWindow: number
  ciraWindow: number
  write?: (data: string) => boolean
  sendBuffer?: any
  amtchannelid?: any
  close?: () => void
  closing?: number
  onStateChange?: any
  onData?: any
  sendchannelclose?: any
}
export class CIRAHandler {
  digestChallenge: DigestChallenge
  rawChunkedData: string = ''
  xml: string
  httpHandler: HttpHandler
  username: string
  password: string
  channel: CIRAChannel
  constructor (httpHandler: HttpHandler, username: string, password: string) {
    this.username = username
    this.password = password
    this.httpHandler = httpHandler
  }

  // Disconnect CIRA tunnel
  async close (socket): Promise<void> {
    try {
      socket.end()
    } catch (err) {
      logger.error(err)
    }
  }

  // Setup CIRA Channel
  SetupCiraChannel (socket: CIRASocket, targetPort: number): CIRAChannel {
    if (this.channel?.state === 2) {
      return this.channel
    }
    const sourcePort = (socket.tag.nextsourceport++ % 30000) + 1024
    this.channel = {
      targetport: targetPort,
      channelid: socket.tag.nextchannelid++,
      socket: socket,
      state: 1,
      sendcredits: 0,
      amtpendingcredits: 0,
      amtCiraWindow: 0,
      ciraWindow: 32768
    }
    APFProcessor.SendChannelOpen(this.channel.socket, false, this.channel.channelid, this.channel.ciraWindow, this.channel.socket.tag.host, this.channel.targetport, '1.2.3.4', sourcePort)

    // This function closes this CIRA channel
    this.channel.close = (): void => {
      if (this.channel.state === 0 || this.channel.closing === 1) return
      if (this.channel.state === 1) {
        this.channel.closing = 1
        this.channel.state = 0
        if (this.channel.onStateChange) {
          this.channel.onStateChange(this.channel, this.channel.state)
        }
        return
      }
      this.channel.state = 0
      this.channel.closing = 1
      APFProcessor.SendChannelClose(this.channel.socket, this.channel.amtchannelid)
      if (this.channel.onStateChange) {
        this.channel.onStateChange(this.channel, this.channel.state)
      }
    }

    this.channel.sendchannelclose = (): void => {
      APFProcessor.SendChannelClose(this.channel.socket, this.channel.amtchannelid)
    }

    socket.tag.channels[this.channel.channelid] = this.channel
    return this.channel
  }

  async Enumerate (socket: CIRASocket, rawXml: string): Promise<Common.Models.Response<Enumerate>> {
    return await this.Send(socket, rawXml)
  }

  async Pull<T>(socket: CIRASocket, rawXml: string): Promise<Common.Models.Response<Pull<T>>> {
    return await this.Send(socket, rawXml)
  }

  async Get<T>(socket: CIRASocket, rawXml: string): Promise<Common.Models.Response<T>> {
    return await this.Send(socket, rawXml)
  }

  async Send (socket: CIRASocket, rawXml: string): Promise<any> {
    let result
    try {
      result = await this.Go(this.SetupCiraChannel(socket, amtPort), rawXml)
    } catch (error) {
      if (error.message === 'Unauthorized') {
        this.channel.state = 0
        result = await this.Go(this.SetupCiraChannel(socket, amtPort), rawXml)
      } else {
        throw error
      }
    }
    return result
  }

  private async Go (channel: CIRAChannel, rawXml: string): Promise<Enumerate | any> {
    return await new Promise((resolve, reject) => {
      // Set up the timeout
      const timer = setTimeout(() => {
        reject(new Error('Promise timed out after 5000 ms'))
      }, 5000)
      channel.onData = (data: string = ''): void => {
        this.rawChunkedData += data
        if (this.rawChunkedData.includes('401 Unauthorized') && (this.rawChunkedData.includes('</html>'))) {
          this.digestChallenge = this.handleAuth(this.rawChunkedData)
          if (this.digestChallenge != null) {
            // resend original message
            // if (item.name === 'Content-Length' && message.bodySize === parseInt(item.value)) {
            clearTimeout(timer)
            reject(new Error('Unauthorized')) // could be better
          }
        } else if (this.rawChunkedData.includes('0\r\n\r\n')) {
          const response = this.parseBody(this.rawChunkedData)
          clearTimeout(timer)
          resolve(response)
        }
      }

      this.writeData(channel, rawXml)
    })
  }

  handleAuth (content: string): DigestChallenge {
    logger.debug(content)
    const message = httpZ.parse(content)
    this.rawChunkedData = ''
    const found = message.headers.find(item => item.name === 'Www-Authenticate')
    if (found != null) {
      return this.httpHandler.parseAuthenticateResponseHeader(found.value)
    }
    return null
  }

  parseBody (body: string): any {
    let xmlBody: string = ''
    const message = httpZ.parse(body)
    this.rawChunkedData = ''
    logger.debug(body)
    // parse the body until its length is greater than 5, because body ends with '0\r\n\r\n'
    while (message.body.text.length > 5) {
      const clen = message.body.text.indexOf('\r\n')
      if (clen < 0) {
        return
      }
      // converts hexadecimal chunk size to integer
      const csize: number = parseInt(message.body.text.substring(0, clen), 16)
      if (message.body.text.length < clen + 2 + csize + 2) {
        return
      }
      const data = message.body.text.substring(clen + 2, clen + 2 + csize)
      message.body.text = message.body.text.substring(clen + 2 + csize + 2)
      xmlBody += data
    }
    // pares WSMan xml response to json

    return this.httpHandler.parseXML(xmlBody)
  }

  writeData (channel: CIRAChannel, rawXML: string): boolean {
    this.rawChunkedData = ''
    const params: connectionParams = {
      guid: channel.socket.tag.nodeid,
      port: amtPort,
      digestChallenge: this.digestChallenge,
      username: this.username,
      password: this.password
    }
    const wsmanrequest = this.httpHandler.wrapIt(params, rawXML)

    if (channel.state === 0) return false
    if (channel.state === 1 || channel.sendcredits === 0 || channel.sendBuffer != null) {
      if (channel.sendBuffer == null) {
        channel.sendBuffer = wsmanrequest
      } else {
        channel.sendBuffer += wsmanrequest
      }
      return true
    }
    // Compute how much data we can send
    if (wsmanrequest.length <= channel.sendcredits) {
      // Send the entire message
      APFProcessor.SendChannelData(channel.socket, channel.amtchannelid, wsmanrequest)
      channel.sendcredits -= wsmanrequest.length
      return true
    }
    // Send a part of the message
    channel.sendBuffer = wsmanrequest.substring(channel.sendcredits)
    APFProcessor.SendChannelData(channel.socket, channel.amtchannelid, wsmanrequest.substring(0, channel.sendcredits))
    channel.sendcredits = 0
    return false
  }
}
