import { Socket } from 'net'
import { TLSSocket } from 'tls'
import { CIRASocket } from '../models/models'
import { logger } from '../utils/logger'
import { APFProcessor } from './APFProcessor'

export interface CIRAChannel {
  targetport: number
  channelid: number
  socket: TLSSocket | Socket
  state: number
  sendcredits: number
  amtpendingcredits: number
  amtCiraWindow: number
  ciraWindow: number
  write?: any
  sendBuffer?: any
  amtchannelid?: any
  close?: any
  closing?: any
  onStateChange?: any
  sendchannelclose?: any
}
export class CIRAHandler {
  apf: APFProcessor
  ciraConnections: Record<string, CIRASocket>

  /**
 *
 */
  constructor (apf: APFProcessor) {
    this.apf = apf
  }

  // Disconnect CIRA tunnel
  async close (socket): Promise<void> {
    try {
      socket.end()
    } catch (err) { }
    try {
      delete this.ciraConnections[socket.tag.nodeid]
    } catch (err) { }
    if (this.mpsService) {
      await this.mpsService.CIRADisconnected(socket.tag.nodeid)
    }
  }

  // Setup CIRA Channel
  SetupCiraChannel (socket, targetport): any {
    const sourceport = (socket.tag.nextsourceport++ % 30000) + 1024
    const channel: CIRAChannel = {
      targetport: targetport,
      channelid: socket.tag.nextchannelid++,
      socket: socket,
      state: 1,
      sendcredits: 0,
      amtpendingcredits: 0,
      amtCiraWindow: 0,
      ciraWindow: 32768
    }

    this.apf.SendChannelOpen(socket, false, channel.channelid, channel.ciraWindow, socket.tag.host, targetport, '1.2.3.4', sourceport)

    // This function writes data to this CIRA channel
    channel.write = this.Write.bind(this, channel)

    // This function closes this CIRA channel
    channel.close = this.Close.bind(this, channel)

    channel.sendchannelclose = (): void => {
      this.apf.SendChannelClose(channel.socket, channel.amtchannelid)
    }

    socket.tag.channels[channel.channelid] = channel
    return channel
  }

  // This function closes this CIRA channel
  Close = (channel: CIRAChannel): void => {
    if (channel.state === 0 || channel.closing === 1) return
    if (channel.state === 1) {
      channel.closing = 1
      channel.state = 0
      if (channel.onStateChange) {
        channel.onStateChange(channel, channel.state)
      }
      return
    }
    channel.state = 0
    channel.closing = 1
    this.apf.SendChannelClose(channel.socket, channel.amtchannelid)
    if (channel.onStateChange) {
      channel.onStateChange(channel, channel.state)
    }
  }

  // This function writes data to this CIRA channel
  Write = (channel: CIRAChannel, data: string): boolean => {
    if (channel.state === 0) return false
    if (channel.state === 1 || channel.sendcredits === 0 || channel.sendBuffer != null) {
      if (channel.sendBuffer == null) {
        channel.sendBuffer = data
      } else {
        channel.sendBuffer += data
      }
      return true
    }
    // Compute how much data we can send
    if (data.length <= channel.sendcredits) {
      // Send the entire message
      this.apf.SendChannelData(channel.socket, channel.amtchannelid, data)
      channel.sendcredits -= data.length
      return true
    }
    // Send a part of the message
    channel.sendBuffer = data.substring(channel.sendcredits)
    this.apf.SendChannelData(channel.socket, channel.amtchannelid, data.substring(0, channel.sendcredits))
    channel.sendcredits = 0
    return false
  }
}
