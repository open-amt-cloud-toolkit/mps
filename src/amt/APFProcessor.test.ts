import Common from '../utils/common'
import { logger } from '../logging'
import APFProcessor, { APFProtocol, APFBulkDataMaxLength, APFPropValueMaxLength } from './APFProcessor'
import { CIRASocket } from '../models/models'
import { CIRAChannel } from './CIRAChannel'
import { EventEmitter } from 'stream'

describe('APFProcessor Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
    jest.resetModules()
  })

  const RESERVED_INT: number = 255

  describe('processCommand', () => {
    const fakeCiraSocket: CIRASocket = {
      tag: {}
    } as any

    it('should return 0 if accumulator length is 0', async () => {
      fakeCiraSocket.tag.accumulator = ''
      const result = await APFProcessor.processCommand(fakeCiraSocket)
      expect(result).toEqual(0)
    })

    it('should call keepAliveRequest', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(APFProtocol.KEEPALIVE_REQUEST)
      const cmdSpy = jest.spyOn(APFProcessor, 'keepAliveRequest')
      await APFProcessor.processCommand(fakeCiraSocket)
      expect(cmdSpy).toHaveBeenCalled()
    })

    it('should call keepAliveReply', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(APFProtocol.KEEPALIVE_REPLY)
      const cmdSpy = jest.spyOn(APFProcessor, 'keepAliveReply')
      await APFProcessor.processCommand(fakeCiraSocket)
      expect(cmdSpy).toHaveBeenCalled()
    })

    it('should call keepAliveOptionsReply', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(APFProtocol.KEEPALIVE_OPTIONS_REPLY)
      const cmdSpy = jest.spyOn(APFProcessor, 'keepAliveOptionsReply')
      await APFProcessor.processCommand(fakeCiraSocket)
      expect(cmdSpy).toHaveBeenCalled()
    })

    it('should call protocolVersion', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(APFProtocol.PROTOCOLVERSION)
      const cmdSpy = jest.spyOn(APFProcessor, 'protocolVersion')
      await APFProcessor.processCommand(fakeCiraSocket)
      expect(cmdSpy).toHaveBeenCalled()
    })

    it('should call userAuthRequest', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(APFProtocol.USERAUTH_REQUEST)
      const cmdSpy = jest.spyOn(APFProcessor, 'userAuthRequest')
      await APFProcessor.processCommand(fakeCiraSocket)
      expect(cmdSpy).toHaveBeenCalled()
    })

    it('should call serviceRequest', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(APFProtocol.SERVICE_REQUEST)
      const cmdSpy = jest.spyOn(APFProcessor, 'serviceRequest')
      await APFProcessor.processCommand(fakeCiraSocket)
      expect(cmdSpy).toHaveBeenCalled()
    })

    it('should call globalRequest', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(APFProtocol.GLOBAL_REQUEST)
      const cmdSpy = jest.spyOn(APFProcessor, 'globalRequest')
      await APFProcessor.processCommand(fakeCiraSocket)
      expect(cmdSpy).toHaveBeenCalled()
    })

    it('should call channelOpen', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(APFProtocol.CHANNEL_OPEN)
      const cmdSpy = jest.spyOn(APFProcessor, 'channelOpen')
      await APFProcessor.processCommand(fakeCiraSocket)
      expect(cmdSpy).toHaveBeenCalled()
    })

    it('should call channelOpenConfirmation', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(APFProtocol.CHANNEL_OPEN_CONFIRMATION)
      const cmdSpy = jest.spyOn(APFProcessor, 'channelOpenConfirmation')
      await APFProcessor.processCommand(fakeCiraSocket)
      expect(cmdSpy).toHaveBeenCalled()
    })

    it('should call channelOpenFailure', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(APFProtocol.CHANNEL_OPEN_FAILURE)
      const cmdSpy = jest.spyOn(APFProcessor, 'channelOpenFailure')
      await APFProcessor.processCommand(fakeCiraSocket)
      expect(cmdSpy).toHaveBeenCalled()
    })

    it('should call channelClose', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(APFProtocol.CHANNEL_CLOSE)
      const cmdSpy = jest.spyOn(APFProcessor, 'channelClose')
      await APFProcessor.processCommand(fakeCiraSocket)
      expect(cmdSpy).toHaveBeenCalled()
    })

    it('should call channelWindowAdjust', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(APFProtocol.CHANNEL_WINDOW_ADJUST)
      const cmdSpy = jest.spyOn(APFProcessor, 'channelWindowAdjust')
      await APFProcessor.processCommand(fakeCiraSocket)
      expect(cmdSpy).toHaveBeenCalled()
    })

    it('should call channelData', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(APFProtocol.CHANNEL_DATA)
      const cmdSpy = jest.spyOn(APFProcessor, 'channelData')
      await APFProcessor.processCommand(fakeCiraSocket)
      expect(cmdSpy).toHaveBeenCalled()
    })

    it('should call disconnect', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(APFProtocol.DISCONNECT)
      const cmdSpy = jest.spyOn(APFProcessor, 'disconnect')
      await APFProcessor.processCommand(fakeCiraSocket)
      expect(cmdSpy).toHaveBeenCalled()
    })

    it('should return -1 (defualt) if message type is not handled', async () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      fakeCiraSocket.tag.accumulator = String.fromCharCode(-1)
      const result = await APFProcessor.processCommand(fakeCiraSocket)
      expect(result).toEqual(-1)
      expect(warnSpy).toHaveBeenCalled()
    })
  })

  describe('disconnect() tests', () => {
    let data: string
    let fakeCiraSocket: any
    beforeEach(() => {
      fakeCiraSocket = {
        tag: {
          nodeid: jest.fn().mockReturnValue('fakeNodeid')
        }
      }
      data = String.fromCharCode(APFProtocol.DISCONNECT) +
        Common.IntToStr(22) +
        Common.ShortToStr(0)
    })
    it('should return 0 if not enough dataLen for the disconnect code', () => {
      const result = APFProcessor.disconnect(fakeCiraSocket, data.length - 1, data)
      expect(result).toEqual(0)
    })
    it('should log warning if reserved value is not 0', () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      data = data.slice(0, 5) + Common.ShortToStr(1)
      const result = APFProcessor.disconnect(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
      expect(warnSpy).toHaveBeenCalled()
    })

    it('happy path', () => {
      const fakeCiraSocket: any = {
        tag: {
          nodeid: jest.fn().mockReturnValue('fakeNodeid')
        }
      }
      const data = String.fromCharCode(APFProtocol.DISCONNECT) +
        Common.IntToStr(22) +
        Common.ShortToStr(0)
      const emitSpy = jest.spyOn(APFProcessor.APFEvents, 'emit')
      const result = APFProcessor.disconnect(fakeCiraSocket, data.length, data)
      expect(emitSpy).toHaveBeenCalledTimes(1)
      expect(result).toEqual(data.length)
    })
  })

  describe('channelData() tests', () => {
    const chnlId: number = 1
    const bulkData: string = 'one, two, three, four'

    it('should return 0 if not enough dataLen for chnlId and chnlDataLen', () => {
      const fakeCiraSocket: any = null
      const data = String.fromCharCode(APFProtocol.CHANNEL_DATA)
      const result = APFProcessor.channelData(fakeCiraSocket, data.length, data)
      expect(result).toEqual(0)
    })

    it('should return -1 if chnlDataLen too big', () => {
      const fakeCiraSocket: any = null
      const warnSpy = jest.spyOn(logger, 'warn')
      const data = String.fromCharCode(APFProtocol.CHANNEL_DATA) +
        Common.IntToStr(chnlId) +
        Common.IntToStr(APFBulkDataMaxLength + 1)
      const result = APFProcessor.channelData(fakeCiraSocket, data.length, data)
      expect(result).toEqual(-1)
      expect(warnSpy).toHaveBeenCalled()
    })

    it('should return 0 if not enough dataLen for bulk data', () => {
      const fakeCiraSocket: any = null
      const data = String.fromCharCode(APFProtocol.CHANNEL_DATA) +
        Common.IntToStr(chnlId) +
        Common.IntToStr(bulkData.length) + bulkData
      const result = APFProcessor.channelData(fakeCiraSocket, (data.length - 1), data)
      const expectedResult = 0
      expect(result).toEqual(expectedResult)
    })

    it('should return data.length if cirachannel is null', () => {
      const fakeCiraSocket = {
        tag: {
          channels: []
        }
      } as any
      const errorSpy = jest.spyOn(logger, 'error')
      const data = String.fromCharCode(APFProtocol.CHANNEL_DATA) +
        Common.IntToStr(chnlId) +
        Common.IntToStr(bulkData.length) + bulkData
      const result = APFProcessor.channelData(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
      expect(errorSpy).toHaveBeenCalled()
    })

    it('happy path', () => {
      const fakeCiraChannel: CIRAChannel = {
        amtpendingcredits: 1000,
        ciraWindow: 1000,
        socket: {
          write: jest.fn()
        },
        onData: jest.fn()
      } as any
      const fakeCiraSocket: CIRASocket = {
        tag: {
          channels: [null, fakeCiraChannel]
        }
      } as any
      const sendChannelWindowAdjustSpy = jest.spyOn(APFProcessor, 'SendChannelWindowAdjust')
      const data = String.fromCharCode(APFProtocol.CHANNEL_DATA) +
        Common.IntToStr(chnlId) +
        Common.IntToStr(bulkData.length) + bulkData
      const result = APFProcessor.channelData(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
      expect(sendChannelWindowAdjustSpy).toHaveBeenCalled()
    })
  })

  describe('channelWindowAdjust() tests', () => {
    const chnlId: number = 0
    const byteToAdd: number = 0
    it('should return 0 if len < 9', () => {
      const data = String.fromCharCode(APFProtocol.CHANNEL_WINDOW_ADJUST) +
        Common.IntToStr(chnlId) +
        Common.IntToStr(byteToAdd)
      const result = APFProcessor.channelWindowAdjust(null, (data.length - 1), data)
      expect(result).toEqual(0)
    })

    it('should return data.length if cirachannel is null', () => {
      const fakeCiraSocket: CIRASocket = {
        tag: {
          channels: [null, null]
        }
      } as any
      const data = String.fromCharCode(APFProtocol.CHANNEL_WINDOW_ADJUST) +
        Common.IntToStr(chnlId) +
        Common.IntToStr(byteToAdd)
      const errorSpy = jest.spyOn(logger, 'error')
      const result = APFProcessor.channelWindowAdjust(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
      expect(errorSpy).toHaveBeenCalled()
    })

    it('should return data.length if sending entire pending buffer', () => {
      const fakeCiraChannel: CIRAChannel = {
        sendBuffer: {
          length: 1000
        },
        sendcredits: 1000,
        socket: {
          write: jest.fn()
        },
        state: 2
      } as any
      const fakeCiraSocket: CIRASocket = {
        tag: {
          // align with chnlDataRecipientChnl
          channels: [fakeCiraChannel]
        }
      } as any
      const data = String.fromCharCode(APFProtocol.CHANNEL_WINDOW_ADJUST) +
        Common.IntToStr(chnlId) +
        Common.IntToStr(byteToAdd)
      const sendChannelDataSpy = jest.spyOn(APFProcessor, 'SendChannelData')
      const result = APFProcessor.channelWindowAdjust(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
      expect(sendChannelDataSpy).toHaveBeenCalled()
      // expect(readIntSpy).toHaveBeenCalled()
    })

    it('should return 9 if sending partial pending buffer', () => {
      const fakeCiraChannel: CIRAChannel = {
        sendBuffer: 'my fake buffer',
        sendcredits: 5,
        socket: {
          write: jest.fn()
        },
        amtchannelid: 0,
        state: 2
      } as any
      const fakeCiraSocket: CIRASocket = {
        tag: {
          // align with chnlDataRecipientChnl
          channels: [fakeCiraChannel]
        }
      } as any
      const data = String.fromCharCode(APFProtocol.CHANNEL_WINDOW_ADJUST) +
        Common.IntToStr(chnlId) +
        Common.IntToStr(byteToAdd)
      const sendChannelDataSpy = jest.spyOn(APFProcessor, 'SendChannelData')
      const result = APFProcessor.channelWindowAdjust(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
      expect(sendChannelDataSpy).toHaveBeenCalled()
      expect(fakeCiraChannel.sendcredits).toEqual(0)
    })
  })

  describe('channelClose() tests', () => {
    const chnlId: number = 1
    const data = String.fromCharCode(APFProtocol.CHANNEL_CLOSE) +
      Common.IntToStr(chnlId)

    it('should return 0 if len < 5', () => {
      const result = APFProcessor.channelWindowAdjust(null, (data.length - 1), data)
      expect(result).toEqual(0)
    })

    it('should return data.length if cirachannel is null', () => {
      const fakeCiraSocket: CIRASocket = {
        tag: {
          channels: [null, null]
        }
      } as any
      const errorSpy = jest.spyOn(logger, 'error')
      const result = APFProcessor.channelClose(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
      expect(errorSpy).toHaveBeenCalled()
    })

    it('happy path', () => {
      const fakeCiraChannel: CIRAChannel = {
        socket: {
          write: jest.fn()
        },
        state: 1,
        onStateChange: new EventEmitter()
      } as any
      const fakeCiraSocket: CIRASocket = {
        tag: {
          channels: [null, fakeCiraChannel]
        }
      } as any
      const sendChannelCloseSpy = jest.spyOn(APFProcessor, 'SendChannelClose')
      const emitSpy = jest.spyOn(fakeCiraChannel.onStateChange, 'emit')
      const result = APFProcessor.channelClose(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
      expect(sendChannelCloseSpy).toHaveBeenCalled()
      expect(emitSpy).toHaveBeenCalled()
    })
  })

  describe('channelOpenFailure() tests', () => {
    const chnlId: number = 1
    const data = String.fromCharCode(APFProtocol.CHANNEL_OPEN_FAILURE) +
      Common.IntToStr(chnlId)
    const fakeCiraSocket: CIRASocket = {
      tag: {
        channels: []
      }
    } as any

    it('should return 0 if length < 17', () => {
      const result = APFProcessor.channelOpenFailure(fakeCiraSocket, data.length, data)
      expect(result).toEqual(0)
    })

    it('should return 17 if cirachannel is null', () => {
      const errorSpy = jest.spyOn(logger, 'error')
      const result = APFProcessor.channelOpenFailure(fakeCiraSocket, 17, data)
      expect(result).toEqual(17)
      expect(errorSpy).toHaveBeenCalled()
    })

    it('happy path', () => {
      const fakeCiraChannel: CIRAChannel = {
        state: 1,
        onStateChange: new EventEmitter()
      } as any
      const fakeCiraSocket: CIRASocket = {
        tag: {
          channels: [null, fakeCiraChannel]
        }
      } as any

      const emitSpy = jest.spyOn(fakeCiraChannel.onStateChange, 'emit')
      const result = APFProcessor.channelOpenFailure(fakeCiraSocket, 17, data)
      expect(result).toEqual(17)
      expect(emitSpy).toHaveBeenCalled()
    })
  })

  describe('channelOpenConfirmation', () => {
    const rcvChnlId: number = 1
    const sendChnlId: number = 25
    const windowSize: number = 1000
    const data = String.fromCharCode(APFProtocol.CHANNEL_OPEN_CONFIRMATION) +
      Common.IntToStr(rcvChnlId) +
      Common.IntToStr(sendChnlId) +
      Common.IntToStr(windowSize) +
      Common.IntToStr(RESERVED_INT)
    const fakeCiraChannel: CIRAChannel = {
      onStateChange: jest.fn(),
      socket: {
        write: jest.fn()
      }
    } as any
    const fakeCiraSocket: CIRASocket = {
      tag: {
        channels: [null, fakeCiraChannel]
      }
    } as any

    it('should return 0 if length < 17', () => {
      const result = APFProcessor.channelOpenConfirmation(fakeCiraSocket, data.length - 1, data)
      expect(result).toEqual(0)
    })

    it('should return 17 if cirachannel is null', () => {
      const socket: CIRASocket = {
        tag: {
          channels: []
        }
      } as any
      const result = APFProcessor.channelOpenConfirmation(socket, data.length, data)
      expect(result).toEqual(data.length)
    })

    it('should call SendChannelClose if channel is closing', () => {
      fakeCiraChannel.closing = 1
      const sendChannelCloseSpy = jest.spyOn(APFProcessor, 'SendChannelClose')
      const result = APFProcessor.channelOpenConfirmation(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
      expect(sendChannelCloseSpy).toHaveBeenCalled()
    })

    it('should call SendChannelData to send entire pending buffer', () => {
      fakeCiraChannel.closing = 0
      fakeCiraChannel.sendBuffer = 'fake buffer'
      fakeCiraChannel.onStateChange = new EventEmitter()
      const sendChannelDataSpy = jest.spyOn(APFProcessor, 'SendChannelData')
      const emitSpy = jest.spyOn(fakeCiraChannel.onStateChange, 'emit')
      const result = APFProcessor.channelOpenConfirmation(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
      expect(sendChannelDataSpy).toHaveBeenCalled()
      expect(fakeCiraChannel.sendcredits !== 0)
      expect(emitSpy).toHaveBeenCalled()
    })

    it('should call SendChannelData to send part of pending buffer', () => {
      fakeCiraChannel.closing = 0
      fakeCiraChannel.sendBuffer = 'fake buffer'
      fakeCiraChannel.onStateChange = new EventEmitter()
      const data = String.fromCharCode(APFProtocol.CHANNEL_OPEN_CONFIRMATION) +
        Common.IntToStr(rcvChnlId) +
        Common.IntToStr(sendChnlId) +
        Common.IntToStr(fakeCiraChannel.sendBuffer.length - 1) +
        Common.IntToStr(RESERVED_INT)

      const sendChannelDataSpy = jest.spyOn(APFProcessor, 'SendChannelData')
      const emitSpy = jest.spyOn(fakeCiraChannel.onStateChange, 'emit')
      const result = APFProcessor.channelOpenConfirmation(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
      expect(sendChannelDataSpy).toHaveBeenCalled()
      expect(emitSpy).toHaveBeenCalled()
      expect(fakeCiraChannel.sendcredits === 0)
    })
  })

  describe('channelOpen', () => {
    const chnlType: string = 'direct-tcpip'
    const senderChnlId: number = 25
    const windowSize: number = 1000
    const hostToConnect: string = 'target'
    const hostToConnectPort: number = 295
    const originator: string = 'source'
    const originatorPort: number = 395
    const fakeCiraSocket: CIRASocket = {
      write: jest.fn()
    } as any

    it('should return 0 if not enough dataLen for the chnlTypeLen', () => {
      const data = String.fromCharCode(APFProtocol.CHANNEL_OPEN)
      const result = APFProcessor.channelOpen(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })
    it('should return -1 if chnlTypeLen beyond max', () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      const data = String.fromCharCode(APFProtocol.CHANNEL_OPEN) +
        Common.IntToStr(APFPropValueMaxLength + 1)
      const result = APFProcessor.channelOpen(fakeCiraSocket, data.length, data)
      expect(result).toEqual(-1)
      expect(warnSpy).toHaveBeenCalled()
    })
    it('should return 0 if not enough dataLen for the chnlType senderChnlId and window size', () => {
      const data = String.fromCharCode(APFProtocol.CHANNEL_OPEN) +
        Common.IntToStr(chnlType.length) + chnlType +
        Common.IntToStr(senderChnlId) +
        Common.IntToStr(windowSize)
      const result = APFProcessor.channelOpen(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })

    it('should return -1 if hostToConnectLen beyond max', () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      const data = String.fromCharCode(APFProtocol.CHANNEL_OPEN) +
        Common.IntToStr(chnlType.length) + chnlType +
        Common.IntToStr(senderChnlId) +
        Common.IntToStr(windowSize) +
        Common.IntToStr(RESERVED_INT) +
        Common.IntToStr(APFPropValueMaxLength + 1)
      const result = APFProcessor.channelOpen(fakeCiraSocket, (data.length), data)
      expect(result).toEqual(-1)
      expect(warnSpy).toHaveBeenCalled()
    })
    it('should return 0 if not enough dataLen for the target info and sourceLen field', () => {
      const data = String.fromCharCode(APFProtocol.CHANNEL_OPEN) +
        Common.IntToStr(chnlType.length) + chnlType +
        Common.IntToStr(senderChnlId) +
        Common.IntToStr(windowSize) +
        Common.IntToStr(RESERVED_INT) +
        Common.IntToStr(hostToConnect.length) + hostToConnect +
        Common.IntToStr(hostToConnectPort) +
        Common.IntToStr(originator.length)
      const result = APFProcessor.channelOpen(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })
    it('should return -1 if sourceLen beyond max', () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      const data = String.fromCharCode(APFProtocol.CHANNEL_OPEN) +
        Common.IntToStr(chnlType.length) + chnlType +
        Common.IntToStr(senderChnlId) +
        Common.IntToStr(windowSize) +
        Common.IntToStr(RESERVED_INT) +
        Common.IntToStr(hostToConnect.length) + hostToConnect +
        Common.IntToStr(hostToConnectPort) +
        Common.IntToStr(APFPropValueMaxLength + 1)
      const result = APFProcessor.channelOpen(fakeCiraSocket, (data.length), data)
      expect(result).toEqual(-1)
      expect(warnSpy).toHaveBeenCalled()
    })
    it('should return 0 if not enough dataLen for the source and source port', () => {
      const data = String.fromCharCode(APFProtocol.CHANNEL_OPEN) +
        Common.IntToStr(chnlType.length) + chnlType +
        Common.IntToStr(senderChnlId) +
        Common.IntToStr(windowSize) +
        Common.IntToStr(RESERVED_INT) +
        Common.IntToStr(hostToConnect.length) + hostToConnect +
        Common.IntToStr(hostToConnectPort) +
        Common.IntToStr(originator.length) + originator +
        Common.IntToStr(originatorPort)
      const result = APFProcessor.channelOpen(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })

    it('happy path', () => {
      const data = String.fromCharCode(APFProtocol.CHANNEL_OPEN) +
        Common.IntToStr(chnlType.length) + chnlType +
        Common.IntToStr(senderChnlId) +
        Common.IntToStr(windowSize) +
        Common.IntToStr(RESERVED_INT) +
        Common.IntToStr(hostToConnect.length) + hostToConnect +
        Common.IntToStr(hostToConnectPort) +
        Common.IntToStr(originator.length) + originator +
        Common.IntToStr(originatorPort)
      const sendChannelOpenFailureSpy = jest.spyOn(APFProcessor, 'SendChannelOpenFailure')
      const result = APFProcessor.channelOpen(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
      expect(sendChannelOpenFailureSpy).toHaveBeenCalled()
    })
  })

  describe('globalRequest', () => {
    const testHost = 'test.com'
    // Ports order: 16993, 16992, 664, 623, 16995, 16994, 5900
    // 5900 port is the last TCP port on which connections for
    // forwarding are to be cancelled.
    const port16993: number = 16993
    const port16992: number = 16992
    const port5900 = 5900
    const reqTcpipFwd = 'tcpip-forward'
    const reqCnclTcpipFwd = 'cancel-tcpip-forward'
    const reqUdpSendTo = 'udp-send-to@amt.intel.com'
    const reqUdpSendToHost = 'test@jest.com'
    const reqUdpSendToPort = 1234
    const reqUdpSendToMsg = 'This is a test message'
    const reqUnknown = 'unknow-request'
    const fakeCiraChannel: CIRAChannel = {
      onStateChange: jest.fn()
    } as any
    const fakeCiraSocket: CIRASocket = {
      tag: {
        channels: [null, fakeCiraChannel]
      }
    } as any

    // check bounds and parse the request
    it('should return 0 if not enough dataLen for the reqLen', () => {
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST)
      const result = APFProcessor.globalRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(0)
    })
    it('should return -1 if reqLen beyond max', () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(APFPropValueMaxLength + 1)
      const result = APFProcessor.globalRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(-1)
      expect(warnSpy).toHaveBeenCalled()
    })
    it('should return 0 if not enough dataLen for the request', () => {
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqTcpipFwd.length) + reqTcpipFwd
      const result = APFProcessor.globalRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })

    // check bounds and parse the host
    it('should return 0 if not enough dataLen for the hostLen', () => {
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqTcpipFwd.length) + reqTcpipFwd +
        String.fromCharCode(1) +
        Common.IntToStr(testHost.length)
      const result = APFProcessor.globalRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })
    it('should return -1 if hostLen beyond max', () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqTcpipFwd.length) + reqTcpipFwd +
        String.fromCharCode(1) +
        Common.IntToStr(APFPropValueMaxLength + 1)
      const result = APFProcessor.globalRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(-1)
      expect(warnSpy).toHaveBeenCalled()
    })
    it('should return 0 if if not enough dataLen for the host', () => {
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqTcpipFwd.length) + reqTcpipFwd +
        String.fromCharCode(1) +
        Common.IntToStr(testHost.length) + testHost
      const result = APFProcessor.globalRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })

    // check bounds and parse the port
    it('should return 0 if if not enough dataLen for the port', () => {
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqTcpipFwd.length) + reqTcpipFwd +
        String.fromCharCode(1) +
        Common.IntToStr(testHost.length) + testHost +
        Common.IntToStr(port5900)
      const result = APFProcessor.globalRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })

    it('tcpip-forward happy path', () => {
      fakeCiraSocket.tag.boundPorts = [port16993, port16992]
      fakeCiraSocket.write = jest.fn()
      const spySendTcpForwardSuccessReply = jest.spyOn(APFProcessor, 'SendTcpForwardSuccessReply')
      const spySendTcpForwardCancelReply = jest.spyOn(APFProcessor, 'SendTcpForwardCancelReply')
      const spySendKeepaliveOptionsRequest = jest.spyOn(APFProcessor, 'SendKeepaliveOptionsRequest')

      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqTcpipFwd.length) + reqTcpipFwd +
        String.fromCharCode(1) +
        // need to hit an empty host param setting explicitly to undefined
        Common.IntToStr(0) + '' +
        Common.IntToStr(port5900)
      const result = APFProcessor.globalRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)

      expect(spySendTcpForwardSuccessReply).toHaveBeenCalledWith(fakeCiraSocket, port5900)
      expect(spySendTcpForwardCancelReply).not.toHaveBeenCalled()
      expect(spySendKeepaliveOptionsRequest).toHaveBeenCalled()
      expect(fakeCiraSocket.tag.boundPorts).toEqual(
        expect.arrayContaining([port5900])
      )
    })

    it('cancel-tcpip-forward happy path', () => {
      fakeCiraSocket.tag.boundPorts = [port16993, port16992]
      fakeCiraSocket.write = jest.fn()
      const spySendTcpForwardSuccessReply = jest.spyOn(APFProcessor, 'SendTcpForwardSuccessReply')
      const spySendTcpForwardCancelReply = jest.spyOn(APFProcessor, 'SendTcpForwardCancelReply')
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqCnclTcpipFwd.length) + reqCnclTcpipFwd +
        String.fromCharCode(1) +
        Common.IntToStr(testHost.length) + testHost +
        Common.IntToStr(port16993)
      const result = APFProcessor.globalRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
      expect(spySendTcpForwardSuccessReply).not.toHaveBeenCalled()
      expect(spySendTcpForwardCancelReply).toHaveBeenCalled()
      expect(fakeCiraSocket.tag.boundPorts).toEqual(
        expect.arrayContaining([port16992])
      )
      expect(fakeCiraSocket.tag.boundPorts).not.toEqual(
        expect.arrayContaining([port16993])
      )
    })

    // check bounds and parse the udpSendTo host
    it('udp-send-to should return 0 if not enough dataLen for the reqUdpSendToHost length', () => {
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqUdpSendTo.length) + reqUdpSendTo +
        String.fromCharCode(1) +
        Common.IntToStr(testHost.length) + testHost +
        Common.IntToStr(port5900) +
        Common.IntToStr(reqUdpSendToHost.length)
      const result = APFProcessor.globalRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })
    it('udp-send-to should return -1 if hostLen beyond max', () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqUdpSendTo.length) + reqUdpSendTo +
        String.fromCharCode(1) +
        Common.IntToStr(testHost.length) + testHost +
        Common.IntToStr(port5900) +
        Common.IntToStr(APFPropValueMaxLength + 1)
      const result = APFProcessor.globalRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(-1)
      expect(warnSpy).toHaveBeenCalled()
    })
    it('udp-send-to should return 0 if if not enough dataLen for the host', () => {
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqUdpSendTo.length) + reqUdpSendTo +
        String.fromCharCode(1) +
        Common.IntToStr(testHost.length) + testHost +
        Common.IntToStr(port5900) +
        Common.IntToStr(reqUdpSendToHost.length) + reqUdpSendToHost
      const result = APFProcessor.globalRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })

    // check bounds and parse the udpSendTo port
    it('udp-send-to should return 0 if if not enough dataLen for the port', () => {
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqUdpSendTo.length) + reqUdpSendTo +
        String.fromCharCode(1) +
        Common.IntToStr(testHost.length) + testHost +
        Common.IntToStr(port5900) +
        Common.IntToStr(reqUdpSendToHost.length) + reqUdpSendToHost +
        Common.IntToStr(reqUdpSendToPort)
      const result = APFProcessor.globalRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })
    // check bounds and parse the udpSendTo message
    it('udp-send-to should return 0 if not enough dataLen for the message length', () => {
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqUdpSendTo.length) + reqUdpSendTo +
        String.fromCharCode(1) +
        Common.IntToStr(testHost.length) + testHost +
        Common.IntToStr(port5900) +
        Common.IntToStr(reqUdpSendToHost.length) + reqUdpSendToHost +
        Common.IntToStr(reqUdpSendToPort) +
        Common.IntToStr(reqUdpSendToMsg.length)
      const result = APFProcessor.globalRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })
    it('udp-send-to should return -1 if message length is beyond 64KB', () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqUdpSendTo.length) + reqUdpSendTo +
        String.fromCharCode(1) +
        Common.IntToStr(testHost.length) + testHost +
        Common.IntToStr(port5900) +
        Common.IntToStr(reqUdpSendToHost.length) + reqUdpSendToHost +
        Common.IntToStr(reqUdpSendToPort) +
        Common.IntToStr(((64 * 1024) + 1))
      const result = APFProcessor.globalRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(-1)
      expect(warnSpy).toHaveBeenCalled()
    })
    it('udp-send-to should return 0 if not enough dataLen for the message', () => {
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqUdpSendTo.length) + reqUdpSendTo +
        String.fromCharCode(1) +
        Common.IntToStr(testHost.length) + testHost +
        Common.IntToStr(port5900) +
        Common.IntToStr(reqUdpSendToHost.length) + reqUdpSendToHost +
        Common.IntToStr(reqUdpSendToPort) +
        Common.IntToStr(reqUdpSendToMsg.length) + reqUdpSendToMsg
      const result = APFProcessor.globalRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })

    it('udp-send-to happy path', () => {
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqUdpSendTo.length) + reqUdpSendTo +
        String.fromCharCode(1) +
        Common.IntToStr(testHost.length) + testHost +
        Common.IntToStr(port5900) +
        Common.IntToStr(reqUdpSendToHost.length) + reqUdpSendToHost +
        Common.IntToStr(reqUdpSendToPort) +
        Common.IntToStr(reqUdpSendToMsg.length) + reqUdpSendToMsg
      const result = APFProcessor.globalRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
    })

    it('should return correct parse position on unhandled request', () => {
      const data = String.fromCharCode(APFProtocol.GLOBAL_REQUEST) +
        Common.IntToStr(reqUnknown.length) + reqUnknown +
        String.fromCharCode(1) +
        Common.IntToStr(testHost.length) + testHost +
        Common.IntToStr(port5900) +
        Common.IntToStr(reqUdpSendToHost.length) + reqUdpSendToHost +
        Common.IntToStr(reqUdpSendToPort) +
        Common.IntToStr(reqUdpSendToMsg.length) + reqUdpSendToMsg
      const result = APFProcessor.globalRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length - (3 * 4) - reqUdpSendToHost.length - reqUdpSendToMsg.length)
    })
  })

  describe('serviceRequest', () => {
    const svcPFWD: string = 'pfwd@amt.intel.com'
    const svcAuth: string = 'auth@amt.intel.com'
    const fakeCiraSocket: CIRASocket = {
      write: jest.fn()
    } as any

    it('should return 0 if not enough dataLen for the svcNameLen', () => {
      const data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) +
        Common.IntToStr(svcPFWD.length) + svcPFWD
      const result = APFProcessor.serviceRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })
    it('should return -1 if svcNameLen beyond max', () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      const data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) +
        Common.IntToStr(APFPropValueMaxLength + 1)
      const result = APFProcessor.serviceRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(-1)
      expect(warnSpy).toHaveBeenCalled()
    })
    it('should return 0 if not enough dataLen for the chnlType senderChnlId and window size', () => {
      const data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) +
        Common.IntToStr(svcPFWD.length) + svcPFWD
      const result = APFProcessor.serviceRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })

    it('service pfwd@amt.intel.com happy path', () => {
      const sendServiceAcceptSpy = jest.spyOn(APFProcessor, 'SendServiceAccept')
      const data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) +
        Common.IntToStr(svcPFWD.length) + svcPFWD
      const result = APFProcessor.serviceRequest(fakeCiraSocket, data.length, data)
      expect(sendServiceAcceptSpy).toHaveBeenCalled()
      expect(result).toEqual(data.length)
    })

    it('service auth@amt.intel.com happy path', () => {
      const sendServiceAcceptSpy = jest.spyOn(APFProcessor, 'SendServiceAccept')
      const data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) +
        Common.IntToStr(svcAuth.length) + svcAuth
      const result = APFProcessor.serviceRequest(fakeCiraSocket, data.length, data)
      expect(sendServiceAcceptSpy).toHaveBeenCalled()
      expect(result).toEqual(data.length)
    })
  })

  describe('userAuthRequest', () => {
    const user: string = 'user01'
    const service: string = 'pfwd@amt.intel.com'
    const method: string = 'password'
    const password: string = 'shhhh-sekrit'
    const fakeCiraSocket: CIRASocket = {
      write: jest.fn()
    } as any

    it('should return 0 if not enough dataLen for the userLen', () => {
      const data = String.fromCharCode(APFProtocol.USERAUTH_REQUEST) +
        Common.IntToStr(user.length)
      const result = APFProcessor.userAuthRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })
    it('should return -1 if userLen beyond 64', () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      const data = String.fromCharCode(APFProtocol.USERAUTH_REQUEST) +
        Common.IntToStr(64 + 1)
      const result = APFProcessor.userAuthRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(-1)
      expect(warnSpy).toHaveBeenCalled()
    })
    it('should return 0 if not enough dataLen for the userLen and serviceLen', () => {
      const data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) +
        Common.IntToStr(user.length) + user +
        Common.IntToStr(service.length)
      const result = APFProcessor.userAuthRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })

    it('should return -1 if serviceLen beyond max', () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      const data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) +
        Common.IntToStr(user.length) + user +
        Common.IntToStr(APFPropValueMaxLength + 1)
      const result = APFProcessor.userAuthRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(-1)
      expect(warnSpy).toHaveBeenCalled()
    })
    it('should return 0 if not enough dataLen for the service and methodLen', () => {
      const data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) +
        Common.IntToStr(user.length) + user +
        Common.IntToStr(service.length) + service +
        Common.IntToStr(method.length)
      const result = APFProcessor.userAuthRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })

    it('should return -1 if methodLen beyond max', () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      const data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) +
        Common.IntToStr(user.length) + user +
        Common.IntToStr(service.length) + service +
        Common.IntToStr(APFPropValueMaxLength + 1)
      const result = APFProcessor.userAuthRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(-1)
      expect(warnSpy).toHaveBeenCalled()
    })
    it('should return 0 if not enough dataLen for the method name', () => {
      const data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) +
        Common.IntToStr(user.length) + user +
        Common.IntToStr(service.length) + service +
        Common.IntToStr(method.length) + method
      const result = APFProcessor.userAuthRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })
    it('should return 0 if not enough dataLen for the password len', () => {
      const data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) +
        Common.IntToStr(user.length) + user +
        Common.IntToStr(service.length) + service +
        Common.IntToStr(method.length) + method +
        String.fromCharCode(0) +
        Common.IntToStr(password.length)
      const result = APFProcessor.userAuthRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })
    it('should return -1 if passwordLen beyond 64', () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      const data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) +
        Common.IntToStr(user.length) + user +
        Common.IntToStr(service.length) + service +
        Common.IntToStr(method.length) + method +
        String.fromCharCode(1) +
        Common.IntToStr(64 + 1)
      const result = APFProcessor.userAuthRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(-1)
      expect(warnSpy).toHaveBeenCalled()
    })
    it('should return 0 if not enough dataLen for the password', () => {
      const data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) +
        Common.IntToStr(user.length) + user +
        Common.IntToStr(service.length) + service +
        Common.IntToStr(method.length) + method +
        String.fromCharCode(0) +
        Common.IntToStr(password.length) + password
      const result = APFProcessor.userAuthRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })
    it('happy path', () => {
      const warnSpy = jest.spyOn(logger, 'warn')
      const emitSpy = jest.spyOn(APFProcessor.APFEvents, 'emit')
      const data = String.fromCharCode(APFProtocol.SERVICE_REQUEST) +
        Common.IntToStr(user.length) + user +
        Common.IntToStr(service.length) + service +
        Common.IntToStr(method.length) + method +
        String.fromCharCode(0) +
        Common.IntToStr(password.length) + password
      const result = APFProcessor.userAuthRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(data.length)
      expect(emitSpy).toHaveBeenCalled()
      expect(warnSpy).not.toHaveBeenCalled()
    })
  })

  describe('protocolVersion', () => {
    const majorVersion = 5
    const minorVersion = 3
    const guid = '0123456789ABCDEF'
    const pad16 = 'KLMNOPQRSTUVWXYZ'
    const fakeCiraSocket: CIRASocket = {
      tag: {}
    } as any

    it('should return 0 if length < 93', () => {
      const result = APFProcessor.protocolVersion(null, 92, null)
      expect(result).toEqual(0)
    })

    it('should call APFProcessor.APFEvents.emit on happy path', () => {
      const data = String.fromCharCode(APFProtocol.PROTOCOLVERSION) +
        Common.IntToStr(majorVersion) +
        Common.IntToStr(minorVersion) +
        Common.IntToStr(RESERVED_INT) +
        guid +
        pad16 + pad16 + pad16 + pad16

      const emitSpy = jest.spyOn(APFProcessor.APFEvents, 'emit')
      const result = APFProcessor.protocolVersion(fakeCiraSocket, 93, data)
      expect(result).toEqual(93)
      expect(emitSpy).toHaveBeenCalled()
      expect(fakeCiraSocket.tag.MajorVersion).toEqual(majorVersion)
      expect(fakeCiraSocket.tag.MinorVersion).toEqual(minorVersion)
      const expectedSysId = APFProcessor
        .guidToStr(Common.Rstr2hex(guid))
        .toLowerCase()
      expect(fakeCiraSocket.tag.SystemId).toEqual(expectedSysId)
    })
  })

  describe('keepAliveReply', () => {
    const data = String.fromCharCode(APFProtocol.KEEPALIVE_REPLY) +
      Common.IntToStr(1234)
    it('should return 0 if length < 5', () => {
      const result = APFProcessor.keepAliveReply((data.length - 1), data)
      expect(result).toEqual(0)
    })
    it('should return 5 if length >= 5', () => {
      const result = APFProcessor.keepAliveReply(data.length, data)
      expect(result).toEqual(5)
    })
  })

  describe('keepAliveOptionsReply', () => {
    const interval = 5000
    const timeout = (3 * interval)
    const data = String.fromCharCode(APFProtocol.KEEPALIVE_OPTIONS_REPLY) +
      Common.IntToStr(interval) +
      Common.IntToStr(timeout)
    it('should return 0 if length < 9', () => {
      const result = APFProcessor.keepAliveOptionsReply((data.length - 1), data)
      expect(result).toEqual(0)
    })
    it('should return 9 if length >= 9', () => {
      const result = APFProcessor.keepAliveOptionsReply(data.length, data)
      expect(result).toEqual(9)
    })
  })

  describe('keepAliveRequest', () => {
    const fakeCiraSocket: CIRASocket = {
      tag: {},
      write: jest.fn()
    } as any
    const interval = 5000
    const data = String.fromCharCode(APFProtocol.KEEPALIVE_OPTIONS_REPLY) +
      Common.IntToStr(interval)

    it('should return 0 if length < 5', () => {
      const result = APFProcessor.keepAliveRequest(fakeCiraSocket, (data.length - 1), data)
      expect(result).toEqual(0)
    })

    it('should return 5 on happy path', () => {
      const sendKeepAliveReplySpy = jest.spyOn(APFProcessor, 'SendKeepAliveReply')
      const result = APFProcessor.keepAliveRequest(fakeCiraSocket, data.length, data)
      expect(result).toEqual(5)
      expect(sendKeepAliveReplySpy).toHaveBeenCalled()
    })
  })

  describe('Functions based on calling APFProcessor.Write', () => {
    let writeSpy
    beforeEach(() => {
      writeSpy = jest.spyOn(APFProcessor, 'Write')
    })
    const fakeCiraSocket = {
      write: jest.fn()
    } as any
    const cookie = 0
    const port = 0
    const channelid = 0
    const windowSize = 0
    const target = ''
    const targetPort = 0
    const source = ''
    const sourcePort = 0
    const senderChannel = 0
    const reasonCode = 0
    const recipientChannelId = 0
    const senderChannelId = 0
    const initialWindowSize = 0
    const data = ''
    const bytestoadd = 0
    const keepaliveTime = 30
    const timeout = 0

    it('should SendKeepAliveReply', () => {
      APFProcessor.SendKeepAliveReply(fakeCiraSocket, cookie)
      const dataExpected = String.fromCharCode(APFProtocol.KEEPALIVE_REPLY) + Common.IntToStr(cookie)
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })

    it('should SendKeepaliveOptionsRequest', () => {
      APFProcessor.SendKeepaliveOptionsRequest(fakeCiraSocket, keepaliveTime, timeout)
      const dataExpected = String.fromCharCode(APFProtocol.KEEPALIVE_OPTIONS_REQUEST) + Common.IntToStr(keepaliveTime) + Common.IntToStr(timeout)
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })

    it('should SendServiceAccept', () => {
      const service = 'my service'
      APFProcessor.SendServiceAccept(fakeCiraSocket, service)
      const dataExpected = String.fromCharCode(APFProtocol.SERVICE_ACCEPT) + Common.IntToStr(service.length) + service
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })

    it('should SendTcpForwardSuccessReply', () => {
      APFProcessor.SendTcpForwardSuccessReply(fakeCiraSocket, port)
      const dataExpected = String.fromCharCode(APFProtocol.REQUEST_SUCCESS) + Common.IntToStr(port)
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })

    it('should SendTcpForwardCancelReply', () => {
      APFProcessor.SendTcpForwardCancelReply(fakeCiraSocket)
      const dataExpected = String.fromCharCode(APFProtocol.REQUEST_SUCCESS)
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })

    it('should SendKeepAliveRequest', () => {
      APFProcessor.SendKeepAliveRequest(fakeCiraSocket, cookie)
      const dataExpected = String.fromCharCode(APFProtocol.KEEPALIVE_REQUEST) + Common.IntToStr(cookie)
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })

    it('should SendChannelOpenFailure', () => {
      APFProcessor.SendChannelOpenFailure(fakeCiraSocket, senderChannel, reasonCode)
      const dataExpected =
        String.fromCharCode(APFProtocol.CHANNEL_OPEN_FAILURE) +
        Common.IntToStr(senderChannel) +
        Common.IntToStr(reasonCode) +
        Common.IntToStr(0) +
        Common.IntToStr(0)
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })

    it('should SendChannelOpenConfirmation', () => {
      APFProcessor.SendChannelOpenConfirmation(fakeCiraSocket, recipientChannelId, senderChannelId, initialWindowSize)
      const dataExpected =
        String.fromCharCode(APFProtocol.CHANNEL_OPEN_CONFIRMATION) +
        Common.IntToStr(recipientChannelId) +
        Common.IntToStr(senderChannelId) +
        Common.IntToStr(initialWindowSize) +
        Common.IntToStr(-1)
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })

    it('should SendChannelOpen with direct-tcpip', () => {
      const direct = true
      APFProcessor.SendChannelOpen(fakeCiraSocket, direct, channelid, windowSize, target, targetPort, source, sourcePort)
      const connectionType = direct ? 'direct-tcpip' : 'forwarded-tcpip'
      const dataExpected =
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
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })

    it('should SendChannelOpen with forwarded-tcpip', () => {
      const direct = false
      APFProcessor.SendChannelOpen(fakeCiraSocket, direct, channelid, windowSize, target, targetPort, source, sourcePort)
      const connectionType = direct ? 'direct-tcpip' : 'forwarded-tcpip'
      const dataExpected =
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
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })
    it('should SendChannelOpen with forwarded-tcpip and null target', () => {
      const direct = false
      APFProcessor.SendChannelOpen(fakeCiraSocket, direct, channelid, windowSize, null, targetPort, source, sourcePort)
      const connectionType = direct ? 'direct-tcpip' : 'forwarded-tcpip'
      const dataExpected =
        String.fromCharCode(APFProtocol.CHANNEL_OPEN) +
        Common.IntToStr(connectionType.length) +
        connectionType +
        Common.IntToStr(channelid) +
        Common.IntToStr(windowSize) +
        Common.IntToStr(-1) +
        Common.IntToStr(0) +
        '' +
        Common.IntToStr(targetPort) +
        Common.IntToStr(source.length) +
        source +
        Common.IntToStr(sourcePort)
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })
    it('should SendChannelOpen with forwarded-tcpip and undefined target', () => {
      const direct = false
      APFProcessor.SendChannelOpen(fakeCiraSocket, direct, channelid, windowSize, undefined, targetPort, source, sourcePort)
      const connectionType = direct ? 'direct-tcpip' : 'forwarded-tcpip'
      const dataExpected =
        String.fromCharCode(APFProtocol.CHANNEL_OPEN) +
        Common.IntToStr(connectionType.length) +
        connectionType +
        Common.IntToStr(channelid) +
        Common.IntToStr(windowSize) +
        Common.IntToStr(-1) +
        Common.IntToStr(0) +
        '' +
        Common.IntToStr(targetPort) +
        Common.IntToStr(source.length) +
        source +
        Common.IntToStr(sourcePort)
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })
    it('should SendChannelClose', () => {
      APFProcessor.SendChannelClose(fakeCiraSocket, channelid)
      const dataExpected = String.fromCharCode(APFProtocol.CHANNEL_CLOSE) + Common.IntToStr(channelid)
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })

    it('should SendChannelData', () => {
      APFProcessor.SendChannelData(fakeCiraSocket, channelid, data)
      const dataExpected =
        String.fromCharCode(APFProtocol.CHANNEL_DATA) +
        Common.IntToStr(channelid) +
        Common.IntToStr(data.length) +
        data
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })

    it('should SendChannelWindowAdjust', () => {
      APFProcessor.SendChannelWindowAdjust(fakeCiraSocket, channelid, bytestoadd)
      const dataExpected =
        String.fromCharCode(APFProtocol.CHANNEL_WINDOW_ADJUST) +
        Common.IntToStr(channelid) +
        Common.IntToStr(bytestoadd)
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })

    it('should SendDisconnect', () => {
      APFProcessor.SendDisconnect(fakeCiraSocket, reasonCode)
      const dataExpected =
        String.fromCharCode(APFProtocol.DISCONNECT) +
        Common.IntToStr(reasonCode) +
        Common.ShortToStr(0)
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })

    it('should SendUserAuthFail', () => {
      APFProcessor.SendUserAuthFail(fakeCiraSocket)
      const dataExpected =
        String.fromCharCode(APFProtocol.USERAUTH_FAILURE) +
        Common.IntToStr(8) +
        'password' +
        String.fromCharCode(0)
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })

    it('should SendUserAuthSuccess', () => {
      APFProcessor.SendUserAuthSuccess(fakeCiraSocket)
      const dataExpected = String.fromCharCode(APFProtocol.USERAUTH_SUCCESS)
      expect(writeSpy).toHaveBeenCalledWith(fakeCiraSocket, dataExpected)
    })
  })

  describe('Write', () => {
    it('should call write on CIRASocket', () => {
      const fakeCiraSocket = {
        write: jest.fn()
      } as any
      const data = ''
      const dataExpected = Buffer.from(data, 'binary')
      APFProcessor.Write(fakeCiraSocket, data)
      expect(fakeCiraSocket.write).toHaveBeenCalledWith(dataExpected)
    })
  })

  describe('guidToStr ', () => {
    it('should convert bytes to formatted guid', () => {
      const result = APFProcessor.guidToStr('44454C4C4B0010428033B6C04F504633')
      expect(result).toBe('4C4C4544-004B-4210-8033-B6C04F504633')
    })
  })
})
