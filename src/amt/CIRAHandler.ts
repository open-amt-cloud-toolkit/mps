/*********************************************************************
 * Copyright (c) Intel Corporation 2018-2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { CIRASocket } from '../models/models'
import APFProcessor from './APFProcessor'
import { connectionParams, HttpHandler } from './HttpHandler'
import httpZ, { HttpZResponseModel } from 'http-z'
import { amtPort } from '../utils/constants'
import {
  DigestChallenge,
  Enumerate,
  Pull
} from '@open-amt-cloud-toolkit/wsman-messages/dist/models/common'
import { Common } from '@open-amt-cloud-toolkit/wsman-messages/dist'
import { CIRAChannel } from './CIRAChannel'
export interface PendingRequests {
  xml?: string
  response?: HttpZResponseModel | string
  messageId?: string
}
export class CIRAHandler {
  xml: string
  httpHandler: HttpHandler
  username: string
  password: string
  channel: CIRAChannel
  channelState: number = 0
  socket: CIRASocket
  constructor (httpHandler: HttpHandler, username: string, password: string) {
    this.username = username
    this.password = password
    this.httpHandler = httpHandler
  }

  // Setup CIRA Channel
  SetupCiraChannel (socket: CIRASocket, targetPort: number): CIRAChannel {
    const sourcePort = (socket.tag.nextsourceport++ % 30000) + 1024
    const channel = new CIRAChannel(this.httpHandler, targetPort, socket)
    APFProcessor.SendChannelOpen(channel.socket, false, channel.channelid, channel.ciraWindow, channel.socket.tag.host, channel.targetport, '1.2.3.4', sourcePort)
    channel.write = async (rawXML: string, messageId: string): Promise<any> => {
      const params: connectionParams = {
        guid: this.channel.socket.tag.nodeid,
        port: amtPort,
        digestChallenge: this.httpHandler.digestChallenge,
        username: this.username,
        password: this.password
      }
      return await channel.writeData(rawXML, params, messageId)
    }
    socket.tag.channels[channel.channelid] = channel
    return channel
  }

  async Connect (): Promise<number> {
    return await new Promise((resolve, reject) => {
      this.channel = this.SetupCiraChannel(this.socket, amtPort)
      this.channel.onStateChange.on('stateChange', (state: number) => {
        this.channelState = state
        resolve(state)
      })
    })
  }

  async Enumerate (socket: CIRASocket, rawXml: string, messageId: string): Promise<Common.Models.Response<Enumerate>> {
    return await this.Send(socket, rawXml, messageId)
  }

  async Pull<T>(socket: CIRASocket, rawXml: string, messageId: string): Promise<Common.Models.Response<Pull<T>>> {
    return await this.Send(socket, rawXml, messageId)
  }

  async Get<T>(socket: CIRASocket, rawXml: string, messageId: string): Promise<Common.Models.Response<T>> {
    return await this.Send(socket, rawXml, messageId)
  }

  async Send (socket: CIRASocket, rawXml: string, messageId: string): Promise<any> {
    this.socket = socket
    return await this.ExecRequest(rawXml, messageId)
  }

  async ExecRequest (xml: string, messageId: string): Promise<any> {
    if (this.channelState === 0) {
      this.channelState = await this.Connect()
    }
    if (this.channelState === 2) {
      try {
        if (this.httpHandler.isAuthInProgress == null) {
          this.httpHandler.isAuthInProgress = new Promise((resolve, reject) => {
            this.httpHandler.authResolve = resolve
          })
        } else {
          await this.httpHandler.isAuthInProgress
        }
        const data = await this.channel.write(xml, messageId)
        const parsedData = this.handleResult(data)

        return parsedData
      } catch (error) {
        if (error?.message === 'Unauthorized' || error?.message === 'Closed') {
          this.channelState = this.channel.CloseChannel()
          return await this.ExecRequest(xml, messageId)
        } else {
          throw error
        }
      }
    }

    return null
  }

  handleAuth (message: HttpZResponseModel): DigestChallenge {
    const found = message.headers.find(item => item.name === 'Www-Authenticate')
    if (found != null) {
      return this.httpHandler.parseAuthenticateResponseHeader(found.value)
    }
    return null
  }

  parseBody (message: HttpZResponseModel): any {
    let xmlBody: string = ''
    // parse the body until its length is greater than 5, because body ends with '0\r\n\r\n'
    while (message.body.text.length > 5) {
      const chunkLength = message.body.text.indexOf('\r\n')
      if (chunkLength < 0) {
        return
      }
      // converts hexadecimal chunk size to integer
      const chunkSize = parseInt(message.body.text.substring(0, chunkLength), 16)
      if (message.body.text.length < chunkLength + 2 + chunkSize + 2) {
        return
      }
      const data = message.body.text.substring(chunkLength + 2, chunkLength + 2 + chunkSize)
      message.body.text = message.body.text.substring(chunkLength + 2 + chunkSize + 2)
      xmlBody += data
    }

    // pares WSMan xml response to json
    const response = this.httpHandler.parseXML(xmlBody)
    response.statusCode = message.statusCode
    return response
  }

  handleResult (data: string): any {
    const message = httpZ.parse(data) as HttpZResponseModel
    if (message.statusCode === 401) {
      this.httpHandler.digestChallenge = this.handleAuth(message)
      this.httpHandler.authResolve()
      if (this.httpHandler.digestChallenge != null) {
        // Executing the failed request once again
        throw new Error('Unauthorized') // could be better
      }
    } else if (message.statusCode === 200) {
      return this.parseBody(message)
    } else {
      return this.parseBody(message)
    }
  }
}
