/*********************************************************************
 * Copyright (c) Intel Corporation 2018-2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

// import httpZ, { HttpZResponseModel } from 'http-z'
import { CIRASocket } from '../models/models'
import APFProcessor from './APFProcessor'
import { connectionParams, HttpHandler } from './HttpHandler'
import { EventEmitter } from 'stream'
import httpZ, { HttpZResponseModel } from 'http-z'
import { parseBody } from '../utils/parseWSManResponseBody'

export class CIRAChannel {
  targetport: number
  channelid: number
  socket: CIRASocket
  state: number
  sendcredits: number
  amtpendingcredits: number
  amtCiraWindow: number
  ciraWindow: number
  write?: (data: string, messageId: string) => Promise<string>
  sendBuffer?: string = null
  amtchannelid?: number
  closing?: number
  onStateChange?: EventEmitter // (state: number) => void
  onData?: any
  sendchannelclose?: any
  rawChunkedData: string = ''
  digestChallenge: string = ''
  resolve: (data) => void
  messages = {}
  constructor (private readonly httpHandler: HttpHandler, targetport: number, socket: CIRASocket) {
    this.targetport = targetport
    this.channelid = socket.tag.nextchannelid++
    this.socket = socket
    this.state = 1
    this.sendcredits = 0
    this.amtpendingcredits = 0
    this.amtCiraWindow = 0
    this.ciraWindow = 32768
    this.onStateChange = new EventEmitter()

    this.onData = (data) => {
      this.rawChunkedData += data
      // For 401 Unauthorized error during digest authentication message ends with </html>, rest all the messages ends with 0\r\n\r\n
      if (this.rawChunkedData.includes('</html>') || this.rawChunkedData.includes('0\r\n\r\n')) {
        try {
          const message = httpZ.parse(this.rawChunkedData) as HttpZResponseModel

          if (message.statusCode === 200) {
            const xmlBody = parseBody(message)
            // pares WSMan xml response to json
            const response = httpHandler.parseXML(xmlBody)
            this.messages[response.Envelope.Header.RelatesTo.toString()](this.rawChunkedData)
          } else {
            this.resolve(this.rawChunkedData)
          }
        } catch (err) {
          console.error(err)
          this.resolve(this.rawChunkedData)
        }
        this.rawChunkedData = ''
      }
    }
  }

  async writeData (data: string, params: connectionParams, messageId: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      this.resolve = this.messages[messageId] = resolve

      const wsmanRequest = this.httpHandler.wrapIt(params, data)
      if (this.state === 0) return reject(new Error('Closed'))// return false
      if (this.state === 1 || this.sendcredits === 0 || this.sendBuffer != null) {
        if (this.sendBuffer == null) {
          this.sendBuffer = wsmanRequest
        } else {
          this.sendBuffer += wsmanRequest
        }
        // return true
      }
      // Compute how much data we can send
      if (wsmanRequest?.length <= this.sendcredits) {
      // Send the entire message
        APFProcessor.SendChannelData(this.socket, this.amtchannelid, wsmanRequest)
        this.sendcredits -= wsmanRequest.length
        // return true
      }
      // Send a part of the message
      this.sendBuffer = wsmanRequest.substring(this.sendcredits)
      APFProcessor.SendChannelData(this.socket, this.amtchannelid, wsmanRequest.substring(0, this.sendcredits))
      this.sendcredits = 0
    })
  }

  CloseChannel (): number {
    if (this.state === 0 || this.closing === 1) return this.state
    if (this.state === 1) {
      this.closing = 1
      this.state = 0
      return this.state
    }
    this.state = 0
    this.closing = 1
    APFProcessor.SendChannelClose(this.socket, this.amtchannelid)
    return this.state
  }
}
