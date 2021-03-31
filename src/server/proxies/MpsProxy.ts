import * as net from 'net'
import { IMpsProxy } from './ImpsProxy'
import { APFProtocol } from '../../models/Mps'
import { getDistributedKV } from '../../utils/IDistributedKV'
import { MPSMicroservice } from '../../mpsMicroservice'
import { logger as log } from '../../utils/logger'
import * as common from '../../utils/common.js'

const MPS_MESSAGE_HEADER_LENGTH = 85
const MPS_DISCONNECT_MESSAGE_HEADER_LENGTH = 77
const MPS_SERVER_MSG_CHANNELID_INDEX = 77
const MPS_SERVER_MSG_DATALENGTH_INDEX = 81
const MPS_SERVER_MSG_UUID_START_INDEX = 5
const MPS_SERVER_MSG_UUID_LENGTH = 72
const MPS_SERVER_MSG_TYPE_INDEX = 4
// const MPS_SERVER_MSG_TYPE_DATA_START = 81
const MPS_PROXY_MSG_DATA_INDEX = 85
const MPS_DEVICE_DISCONNECT_LENGTH = 77
const MPS_STATE_CHANGE_MSG_LENGTH = 81

export class MpsProxy implements IMpsProxy {
  static proxies: any = {}
  static sockets: any = {}
  socket: any
  first: any
  clientCert: any
  accumulator: any
  activetunnels: any
  boundPorts: []
  host: any
  nextchannelid: any
  channels: {}
  nextsourceport: any
  nodeid: any
  mpsService: MPSMicroservice
  ciraChannel: any
  readyState: any
  constructor (guid, mpsService: MPSMicroservice, socket) {
    this.mpsService = mpsService
    this.socket = socket
    // this.tag = { first: true, clientCert: null, accumulator: "", activetunnels: 0, boundPorts: [], host: null, nextchannelid: 4, channels: {}, nextsourceport: 0 };
    this.first = true
    this.clientCert = null
    this.accumulator = ''
    this.activetunnels = 0
    this.boundPorts = []
    this.host = guid
    this.nextchannelid = 4
    this.channels = {}
    this.nextsourceport = 0
    this.ciraChannel = null
    this.readyState = ''
  }

  destroy (): void {
    // Send DISCONNECT msg to webProxy.
    this.socket.write(
      Buffer.from( // message header length
        common.IntToStr(MPS_DISCONNECT_MESSAGE_HEADER_LENGTH) +
        // Channel Open
        String.fromCharCode(APFProtocol.DISCONNECT) +
        // UUID
        common.rstr2hex(this.host), 'binary')

    )
  }

  static processCommand = (socket): any => {
    const len = socket.tag.accumulator.length
    const data = socket.tag.accumulator
    // Nothing to process
    if (len < 4) {
      return 0
    }

    const thisMsgLength = common.ReadInt(data, 0)
    log.silly(`Length of this message ${thisMsgLength} from server ${socket.tag.ip}`)

    // if we have not received the complete message in this packet, accumulate
    if (thisMsgLength > data.length) {
      log.silly('length of message to process is less than or equal to the required message length, add to acc')
      return 0
    } else {
      // process the message further
      // Received Message format as below:
      // ResponseType - data, channelOpen, ChannelClose, deviceDisconnect,
      // UUID
      // ChannelID
      // data
      const msgType = data.charCodeAt(MPS_SERVER_MSG_TYPE_INDEX)
      log.silly(`MpsProxy received message type: ${msgType}`)

      // UUID
      let uuidHex = ''
      // read hex data from message
      for (let index = MPS_SERVER_MSG_UUID_START_INDEX;
        index <= MPS_SERVER_MSG_UUID_START_INDEX + MPS_SERVER_MSG_UUID_LENGTH;
        ++index) {
        uuidHex += data[index]
      }
      const uuid = common.hex2rstr(uuidHex)
      log.silly(`MpsProxy received uuid: ${uuid}`)

      if (APFProtocol.CHANNEL_OPEN === msgType) {
        log.silly(`Channel opened msg received for ${uuid}`)

        // get channelId
        const mpsproxyChannelid = common.ReadInt(data, MPS_SERVER_MSG_CHANNELID_INDEX)
        log.silly(`MpsProxy received Channelid: ${mpsproxyChannelid}`)
        // find the corresponding MpsProxy object
        const mpsproxyObject = MpsProxy.proxies[uuid]
        if (mpsproxyObject != null) {
          if (mpsproxyObject.channels[mpsproxyChannelid].onStateChange) { mpsproxyObject.channels[mpsproxyChannelid].onStateChange(mpsproxyObject.socket, 2) } else { log.silly('this.channels[$(mpsproxyChannelid}].onStateChange undefined') }
        } else {
          log.debug(`received message for ${uuid} do not have MpsProxy Object`)
        }
        return MPS_STATE_CHANGE_MSG_LENGTH
      } else if (APFProtocol.CHANNEL_CLOSE === msgType) {
        log.silly(`Channel Closed msg received for ${uuid}`)
        // get channelId
        const mpsproxyChannelid = common.ReadInt(data, MPS_SERVER_MSG_CHANNELID_INDEX)
        log.silly(`MpsProxy received Channelid: ${mpsproxyChannelid}`)

        // find the corresponding MpsProxy object
        const mpsproxyObject = MpsProxy.proxies[uuid]
        if (mpsproxyObject != null) {
          if (mpsproxyObject.channels[mpsproxyChannelid] == null) {
            log.silly(`channel ${mpsproxyChannelid} do not exists`)
          } else {
            if (mpsproxyObject.channels[mpsproxyChannelid].onStateChange) { mpsproxyObject.channels[mpsproxyChannelid].onStateChange(mpsproxyObject.socket, 0) }
            delete mpsproxyObject.channels[mpsproxyChannelid]
          }
        } else {
          log.debug(`received message for ${uuid} do not have MpsProxy Object`)
        }
        return MPS_STATE_CHANGE_MSG_LENGTH
      } else if (APFProtocol.CHANNEL_DATA === msgType) {
        log.silly(`data received for ${uuid}`)
        // get channelId
        const mpsproxyChannelid = common.ReadInt(data, MPS_SERVER_MSG_CHANNELID_INDEX)
        log.silly(`MpsProxy received Channelid: ${mpsproxyChannelid}`)

        // get data length
        const dataLength = common.ReadInt(data, MPS_SERVER_MSG_DATALENGTH_INDEX)
        log.silly(`MpsProxy received application data of length: ${dataLength}`)

        // find the corresponding MpsProxy object
        const mpsproxyObject = MpsProxy.proxies[uuid]
        if (mpsproxyObject != null) {
          if (mpsproxyObject.channels[mpsproxyChannelid] == null) {
            log.debug(`channel ${mpsproxyChannelid} do not exists`)
          } else {
            if (mpsproxyObject.channels[mpsproxyChannelid].onData) {
              // get data
              let msgData = ''
              // read hex data from message
              for (let index = MPS_PROXY_MSG_DATA_INDEX;
                index < MPS_PROXY_MSG_DATA_INDEX + dataLength;
                index++) {
                msgData += data[index]
              }
              // write data
              mpsproxyObject.channels[mpsproxyChannelid].onData(mpsproxyObject.socket, msgData)
            }
          }
        } else {
          log.debug(`received message for ${uuid} do not have MpsProxy Object`)
        }
        return MPS_MESSAGE_HEADER_LENGTH + dataLength
      } else if (APFProtocol.DISCONNECT === msgType) {
        log.silly(`Device ${uuid} Closed`)

        // find the corresponding MpsProxy object
        const mpsproxyObject = MpsProxy.proxies[uuid]
        if (mpsproxyObject != null) {
          if (mpsproxyObject.mpsService.CIRADisconnected) { mpsproxyObject.mpsService.CIRADisconnected(uuid) }
        } else {
          log.debug(`received message for ${uuid} do not have MpsProxy Object`)
        }
        return MPS_DEVICE_DISCONNECT_LENGTH
      } else {
        log.error('MpsProxy: Unknown response type received')
      }
    }
  }

  static onData (data, mpsServerSocket): void {
    log.silly(`received packet of length: ${data.length}`)
    mpsServerSocket.tag.accumulator += data

    try {
      // Parse all of the APF data we can
      let l = 0
      do {
        l = this.processCommand(mpsServerSocket)
        if (l > 0) { mpsServerSocket.tag.accumulator = mpsServerSocket.tag.accumulator.substring(l) }
      } while (l > 0)
      if (l < 0) { mpsServerSocket.end() }
    } catch (e) {
      log.error(`MpsProxy:onData: ${e}`)
    }
  }

  SetupCiraChannel (targetport, uuid): any {
    log.silly(`call to SetupCiraChannel targetport:${targetport}, uuid:${uuid}`)
    const currChannel = this.nextchannelid
    const ciraChannel = {
      targetport: targetport,
      channelid: this.nextchannelid++,
      socket: this.socket,
      state: 1,
      sendcredits: 0,
      amtpendingcredits: 0,
      amtCiraWindow: 0,
      ciraWindow: 32768,
      write: (data) => {
        log.silly(`write data on socket ${data}`)
        try {
          this.socket.write(// message header length
            Buffer.from(
              common.IntToStr(MPS_MESSAGE_HEADER_LENGTH + data.length) +
              // Channel Open
              String.fromCharCode(APFProtocol.CHANNEL_DATA) +
              // UUID
              common.rstr2hex(ciraChannel.nodeId) +
              //  target port
              common.IntToStr(ciraChannel.channelid) +

              common.IntToStr(data.length) +

              data, 'binary')
          )
        } catch (error) {
          log.error(`SetupCiraChannel write exception: ${error}`)
        }
      },
      close: () => {
        log.silly(`channel close for ${ciraChannel.nodeId}`)
        this.WriteCloseChannel(ciraChannel)
      },
      nodeId: uuid
    }

    // Send CHANNEL_OPEN msg to webProxy.
    this.WriteSetupChannel(ciraChannel, targetport)

    this.channels[currChannel] = ciraChannel
    return this.channels[currChannel]
  }

  WriteSetupChannel (ciraChannel, targetport): void {
    try {
      log.silly('entering WriteSetupChannel')
      this.socket.write(
        Buffer.from(
          // message header length
          common.IntToStr(MPS_MESSAGE_HEADER_LENGTH) +
          // Channel Open
          String.fromCharCode(APFProtocol.CHANNEL_OPEN) +
          // UUID
          common.rstr2hex(ciraChannel.nodeId) +
          //  target port
          common.IntToStr(ciraChannel.channelid) +
          //  Channelid
          common.IntToStr(targetport), 'binary')
      )
    } catch (error) {
      log.error(`WriteSetupChannel exception: ${error}`)
    }
  }

  WriteCloseChannel (ciraChannel): void {
    try {
      log.silly('entering WriteCloseChannel')
      this.socket.write(
        Buffer.from(
          // message header length
          common.IntToStr(MPS_MESSAGE_HEADER_LENGTH) +
          // Channel Open
          String.fromCharCode(APFProtocol.CHANNEL_CLOSE) +
          // UUID
          common.rstr2hex(ciraChannel.nodeId) +
          //  target port
          common.IntToStr(ciraChannel.channelid), 'binary')
      )
    } catch (error) {
      log.error('WriteCloseChannel exception')
    }
  }

  static async getProxySocket (mpsServerIP: string, mpsservice: MPSMicroservice): Promise<any> {
    // Global is a list of Global static variables
    if (MpsProxy.sockets[mpsServerIP] == null || MpsProxy.sockets[mpsServerIP].destroyed) {
      log.silly(`Create socket for ${mpsServerIP}`)
      const mpsServerSocket: any = new net.Socket()
      mpsServerSocket.setEncoding('binary')
      // connect on the device

      mpsServerSocket.connect(mpsservice.config.web_proxy_port, mpsServerIP, function () {
        log.silly(`Connected to mpsServer on socket at IP ${mpsServerIP}`)
      })

      mpsServerSocket.on('error', (err) => {
        log.error(`mps proxy error: ${err}`)
        if (!mpsServerSocket.destroyed) {
          mpsServerSocket.destroy()
          log.silly('MPS Server Socket destroyed.')
        }
        // delete MpsProxy.proxies[guid]
        delete MpsProxy.sockets[mpsServerIP]
        for (const guid in mpsServerSocket.connectedDevices) {
          log.silly(`error: deleted MpsProxy.proxies[${guid}]`)
          delete MpsProxy.proxies[guid]
        }
      })

      mpsServerSocket.on('close', () => {
        log.warn('MPS Server Socket closed. Clean up MPS Proxy state.')
        if (!mpsServerSocket.destroyed) {
          mpsServerSocket.destroy()
          log.silly('MPS Server Socket destroyed.')
        }
        delete MpsProxy.sockets[mpsServerIP]
        for (const guid in mpsServerSocket.connectedDevices) {
          log.silly(`close: deleted MpsProxy.proxies[${guid}]`)
          delete MpsProxy.proxies[guid]
        }
      })
      mpsServerSocket.on('timeout', () => {
        log.warn('MPS Server Socket timeout. Clean up MPS Proxy state.')
        if (!mpsServerSocket.destroyed) {
          mpsServerSocket.destroy()
          log.silly('MPS Server Socket destroyed.')
        }
        delete MpsProxy.sockets[mpsServerIP]

        for (const guid in mpsServerSocket.connectedDevices) {
          log.silly(`timeout: deleted MpsProxy.proxies[${guid}]`)
          delete MpsProxy.proxies[guid]
        }
      })
      // add accumulator
      mpsServerSocket.tag = {}
      mpsServerSocket.tag.accumulator = ''
      mpsServerSocket.tag.ip = mpsServerIP
      mpsServerSocket.setKeepAlive(true, 5000)
      mpsServerSocket.on('data', (data) => MpsProxy.onData(data, mpsServerSocket))
      mpsServerSocket.connectedDevices = []
      MpsProxy.sockets[mpsServerIP] = mpsServerSocket
    }

    log.silly(`Socket exists for ${mpsServerIP}`)
    return MpsProxy.sockets[mpsServerIP]
  }

  static async getSocketForGuid (guid: string, mpsservice: MPSMicroservice): Promise<MpsProxy> {
    // get MPS server IP
    const mpsServerIP: string = await getDistributedKV(mpsservice).lookup(guid).catch(err => {
      log.error(`failed again to retreive ip for guid: ${guid}, result: ${err}`)
      throw (err)
    })

    const socket = await MpsProxy.getProxySocket(mpsServerIP, mpsservice).catch(err => {
      log.error(`failed again to retreive socket for guid: ${guid}, result: ${err}`)
      throw (err)
    })

    log.silly(`Socket exists for ${mpsServerIP}`)

    if (MpsProxy.proxies[guid] == null ||
      // eslint-disable-next-line no-mixed-operators
      MpsProxy.proxies[guid].socket?.destroyed ||
      // eslint-disable-next-line no-mixed-operators
      MpsProxy.proxies[guid].socket.tag.ip != null &&
      MpsProxy.proxies[guid].socket.tag.ip !== mpsServerIP) {
      log.silly(`Create new MpsProxy object for ${guid}`)

      if (typeof MpsProxy.proxies[guid] !== 'undefined' && MpsProxy.proxies[guid].socket?.destroyed) {
        log.silly(`socket for ${guid} was destroyed, creating new object`)
      } else if (typeof MpsProxy.proxies[guid] !== 'undefined' && typeof MpsProxy.proxies[guid].socket?.tag?.ip !== 'undefined' &&
        MpsProxy.proxies[guid].socket?.tag?.ip !== mpsServerIP) {
        log.silly(`ipaddress has changed from ${MpsProxy.proxies[guid].socket.tag.ip} to ${mpsServerIP}`)
      }

      socket.connectedDevices.push(guid)
      MpsProxy.proxies[guid] = new MpsProxy(guid, mpsservice, socket)
      MpsProxy.proxies[guid].readyState = 'open'
    }

    return MpsProxy.proxies[guid]
  }
}
