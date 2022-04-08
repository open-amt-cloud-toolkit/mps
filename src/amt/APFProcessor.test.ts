import Common from '../utils/common'
import { logger } from '../logging'
import APFProcessor, { APFProtocol } from './APFProcessor'
import { CIRASocket } from '../models/models'
import { CIRAChannel } from './CIRAChannel'
import { EventEmitter } from 'stream'

describe('APFProcessor Tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

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

    it('should call default', async () => {
      fakeCiraSocket.tag.accumulator = String.fromCharCode(-1)
      const result = await APFProcessor.processCommand(fakeCiraSocket)
      expect(result).toEqual(-1)
    })
  })

  describe('disconnect() tests', () => {
    it('should disconnect and return 0 when len is < 7', () => {
      const fakeCiraSocket: any = null
      const len: number = 6
      const data: any = null
      const result = APFProcessor.disconnect(fakeCiraSocket, len, data)
      const expectedResult = 0
      expect(result).toEqual(expectedResult)
    })

    it('should disconnect and return 7 when len is >= 7', () => {
      const fakeCiraSocket = {
        tag: {
          nodeid: jest.fn().mockReturnValue('fakeNodeid')
        }
      }
      const len: number = 66666
      const data: any = 'data'
      const emitSpy = jest.spyOn(APFProcessor.APFEvents, 'emit')
      const result = APFProcessor.disconnect(fakeCiraSocket as any, len, data)
      const expectedResult = 7
      expect(emitSpy).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('channelData() tests', () => {
    it('should return 0 if len < 9', () => {
      const fakeCiraSocket: any = null
      const len: number = 8
      const data: any = null
      const result = APFProcessor.channelData(fakeCiraSocket, len, data)
      const expectedResult = 0
      expect(result).toEqual(expectedResult)
    })

    it('should return 0 if len < 9 + LengthOfData', () => {
      const fakeCiraSocket: any = null
      const len: number = 9
      const data: any = null
      jest.spyOn(Common, 'ReadInt').mockReturnValue(1)
      const result = APFProcessor.channelData(fakeCiraSocket, len, data)
      const expectedResult = 0
      expect(result).toEqual(expectedResult)
    })

    it('should return 9 + LengthOfData if cirachannel is null', () => {
      const fakeCiraSocket = {
        tag: {
          channels: []
        }
      }
      const len: number = 100
      const data: any = null
      const lengthOfData = 1
      const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(lengthOfData)
      const errorSpy = jest.spyOn(logger, 'error')
      const result = APFProcessor.channelData(fakeCiraSocket as any, len, data)
      const expectedResult = 9 + lengthOfData
      expect(result).toEqual(expectedResult)
      expect(readIntSpy).toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalled()
    })

    it('should return 9 + LengthOfData on happy path', () => {
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
      const len: number = 100
      const data: string = Common.IntToStr(100)
      const lengthOfData = 1
      const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(lengthOfData)
      const sendChannelWindowAdjustSpy = jest.spyOn(APFProcessor, 'SendChannelWindowAdjust')
      const result = APFProcessor.channelData(fakeCiraSocket, len, data)
      const expectedResult = 9 + lengthOfData
      expect(result).toEqual(expectedResult)
      expect(readIntSpy).toHaveBeenCalled()
      expect(sendChannelWindowAdjustSpy).toHaveBeenCalled()
    })

    describe('channelWindowAdjust() tests', () => {
      it('should return 0 if len < 9', () => {
        const length = 8
        const result = APFProcessor.channelWindowAdjust(null, length, '')
        expect(result).toEqual(0)
      })

      it('should return 9 if cirachannel is null', () => {
        const fakeCiraSocket: CIRASocket = {
          tag: {
            channels: [null, null]
          }
        } as any
        const data: string = Common.IntToStr(0)
        const errorSpy = jest.spyOn(logger, 'error')
        const result = APFProcessor.channelWindowAdjust(fakeCiraSocket, 9, data)
        expect(result).toEqual(9)
        expect(errorSpy).toHaveBeenCalled()
      })

      it('should return 9 if sending entire pending buffer', () => {
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
            channels: [fakeCiraChannel]
          }
        } as any
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockImplementation((x, y) => {
          if (y === 1) {
            return 0
          } else if (y === 5) {
            return 0
          }
        })
        const data = ''
        const len = 9
        const sendChannelDataSpy = jest.spyOn(APFProcessor, 'SendChannelData')
        const result = APFProcessor.channelWindowAdjust(fakeCiraSocket, len, data)
        expect(result).toEqual(9)
        expect(sendChannelDataSpy).toHaveBeenCalled()
        expect(readIntSpy).toHaveBeenCalled()
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
            channels: [fakeCiraChannel]
          }
        } as any
        const data = ''
        const len = 9
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockImplementation((x, y) => {
          if (y === 1) {
            return 0
          } else if (y === 5) {
            return 0
          }
        })

        const sendChannelDataSpy = jest.spyOn(APFProcessor, 'SendChannelData')
        const result = APFProcessor.channelWindowAdjust(fakeCiraSocket, len, data)
        expect(result).toEqual(9)
        expect(sendChannelDataSpy).toHaveBeenCalled()
        expect(fakeCiraChannel.sendcredits).toEqual(0)
        expect(readIntSpy).toHaveBeenCalled()
      })
    })

    describe('channelClose() tests', () => {
      it('should return 0 if length < 5', () => {
        const length = 4
        const result = APFProcessor.channelClose(null, length, '')
        expect(result).toEqual(0)
      })

      it('should return 5 if cirachannel is null', () => {
        const fakeCiraSocket: CIRASocket = {
          tag: {
            channels: [null, null]
          }
        } as any
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(0)
        const errorSpy = jest.spyOn(logger, 'error')
        const result = APFProcessor.channelClose(fakeCiraSocket, 5, '')
        expect(result).toEqual(5)
        expect(readIntSpy).toHaveBeenCalled()
        expect(errorSpy).toHaveBeenCalled()
      })

      it('should return 5 on happy path', () => {
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
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(1)
        const sendChannelCloseSpy = jest.spyOn(APFProcessor, 'SendChannelClose')
        const result = APFProcessor.channelClose(fakeCiraSocket, 5, '')
        expect(result).toEqual(5)
        expect(readIntSpy).toHaveBeenCalled()
        expect(sendChannelCloseSpy).toHaveBeenCalled()
      })
    })

    describe('channelOpenFailure() tests', () => {
      const fakeCiraSocket: CIRASocket = {
        tag: {
          channels: []
        }
      } as any

      it('should return 0 if length < 17', () => {
        const length = 16
        const data = ''
        const result = APFProcessor.channelOpenFailure(fakeCiraSocket, length, data)
        expect(result).toEqual(0)
      })

      it('should return 17 if cirachannel is null', () => {
        const data = ''
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(0)
        const errorSpy = jest.spyOn(logger, 'error')
        const result = APFProcessor.channelOpenFailure(fakeCiraSocket, 17, data)
        expect(result).toEqual(17)
        expect(errorSpy).toHaveBeenCalled()
        expect(readIntSpy).toHaveBeenCalled()
      })

      it('should return 17 on happy path', () => {
        const fakeCiraChannel: CIRAChannel = {
          state: 1,
          onStateChange: new EventEmitter()
        } as any
        const fakeCiraSocket: CIRASocket = {
          tag: {
            channels: [null, fakeCiraChannel]
          }
        } as any
        const length = 17
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(1)

        const result = APFProcessor.channelOpenFailure(fakeCiraSocket, length, '')
        expect(result).toEqual(17)
        expect(readIntSpy).toHaveBeenCalled()
      })
    })

    describe('channelOpenConfirmation', () => {
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
      const sendChannelCloseSpy = jest.spyOn(APFProcessor, 'SendChannelClose')
      const sendChannelDataSpy = jest.spyOn(APFProcessor, 'SendChannelData')

      it('should return 0 if length < 17', () => {
        const length = 16
        const data = ''
        const result = APFProcessor.channelOpenConfirmation(fakeCiraSocket, length, data)
        expect(result).toEqual(0)
      })

      it('should return 17 if cirachannel is null', () => {
        const fakeCiraSocket: CIRASocket = {
          tag: {
            channels: []
          }
        } as any
        const length = 17
        const data = ''
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(0)
        const result = APFProcessor.channelOpenConfirmation(fakeCiraSocket, length, data)
        expect(result).toEqual(17)
        expect(readIntSpy).toHaveBeenCalled()
      })

      it('should call SendChannelClose if channel is closing', () => {
        const length = 17
        const data = ''
        fakeCiraChannel.closing = 1
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(1)
        const result = APFProcessor.channelOpenConfirmation(fakeCiraSocket, length, data)
        expect(result).toEqual(17)
        expect(readIntSpy).toHaveBeenCalled()
        expect(sendChannelCloseSpy).toHaveBeenCalled()
      })

      it('should call SendChannelData to send entire pending buffer', () => {
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockImplementation((x, y) => {
          if (y === 1) {
            return 1
          } else if (y === 5) {
            return 5
          } else if (y === 9) {
            return 1000
          }
        })
        const length = 17
        const data = ''
        fakeCiraChannel.closing = 0
        fakeCiraChannel.sendBuffer = 'fake buffer'
        fakeCiraChannel.onStateChange = new EventEmitter()
        const result = APFProcessor.channelOpenConfirmation(fakeCiraSocket, length, data)
        expect(result).toEqual(17)
        expect(sendChannelDataSpy).toHaveBeenCalled()
        expect(fakeCiraChannel.sendcredits !== 0)
        expect(readIntSpy).toHaveBeenCalled()
      })

      it('should call SendChannelData to send part of pending buffer', () => {
        const length = 17
        const data = ''
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(1)
        fakeCiraChannel.closing = 0
        fakeCiraChannel.sendBuffer = 'fake buffer'
        fakeCiraChannel.onStateChange = new EventEmitter()
        const result = APFProcessor.channelOpenConfirmation(fakeCiraSocket, length, data)
        expect(result).toEqual(17)
        expect(sendChannelDataSpy).toHaveBeenCalled()
        expect(readIntSpy).toHaveBeenCalled()
        expect(fakeCiraChannel.sendcredits === 0)
      })
    })

    describe('channelOpen', () => {
      const fakeCiraSocket: CIRASocket = {
        write: jest.fn()
      } as any

      it('should return 0 if length < 33', () => {
        const length = 32
        const data = ''
        const result = APFProcessor.channelOpen(fakeCiraSocket, length, data)
        expect(result).toEqual(0)
      })

      it('should return 0 if length < 33 + ChannelTypeLength', () => {
        const length = 33
        const data = ''
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockImplementation((x, y) => {
          if (y === 1) {
            return 1
          }
        })
        const result = APFProcessor.channelOpen(fakeCiraSocket, length, data)
        expect(result).toEqual(0)
        expect(readIntSpy).toHaveBeenCalled()
      })

      it('should return on happy path', () => {
        const length = 1000
        const data = ''
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockImplementation((x, y) => {
          if (y === 1) {
            return 1
          } else if (y === 5 + 1) {
            return 1
          } else {
            return 0
          }
        })
        const sendChannelOpenFailureSpy = jest.spyOn(APFProcessor, 'SendChannelOpenFailure')
        const result = APFProcessor.channelOpen(fakeCiraSocket, length, data)
        expect(result).toBeGreaterThan(33)
        expect(readIntSpy).toHaveBeenCalled()
        expect(sendChannelOpenFailureSpy).toHaveBeenCalled()
      })
    })

    describe('globalRequest', () => {
      const fakeCiraChannel: CIRAChannel = {
        onStateChange: jest.fn()
      } as any
      const fakeCiraSocket: CIRASocket = {
        tag: {
          channels: [null, fakeCiraChannel]
        }
      } as any

      it('should return 0 if length < 14', () => {
        const length = 13
        const data = ''
        const result = APFProcessor.globalRequest(fakeCiraSocket, length, data)
        expect(result).toEqual(0)
      })

      it('should return 0 if length + request length < 14', () => {
        const length = 14
        const data = ''
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(1)
        const result = APFProcessor.globalRequest(fakeCiraSocket, length, data)
        expect(result).toEqual(0)
        expect(readIntSpy).toHaveBeenCalled()
      })

      it('should return 0 if inadequate length on tcpip-forward', () => {
        fakeCiraSocket.tag.boundPorts = []
        fakeCiraSocket.write = jest.fn()
        const length = 27
        const data = '01234tcpip-forward'
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockImplementation((x, y) => {
          if (y === 1) {
            return 13
          } else if (y === 6 + 13) {
            return 1
          }
        })
        const result = APFProcessor.globalRequest(fakeCiraSocket, length, data)
        expect(result).toEqual(0)
        expect(readIntSpy).toHaveBeenCalled()
      })

      it('should call SendTcpForwardSuccessReply on tcpip-forward happy path', () => {
        fakeCiraSocket.tag.boundPorts = []
        fakeCiraSocket.write = jest.fn()
        const length = 1000
        const data = '01234tcpip-forward'
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(13)
        const sendTcpForwardSuccessReplySpy = jest.spyOn(APFProcessor, 'SendTcpForwardSuccessReply')
        const sendTcpForwardCancelReplySpy = jest.spyOn(APFProcessor, 'SendTcpForwardCancelReply')
        const result = APFProcessor.globalRequest(fakeCiraSocket, length, data)
        expect(result).toBeGreaterThan(14)
        expect(sendTcpForwardSuccessReplySpy).toHaveBeenCalled()
        expect(sendTcpForwardCancelReplySpy).not.toHaveBeenCalled()
        expect(readIntSpy).toHaveBeenCalled()
      })

      it('should return 0 if inadequate length on cancel-tcpip-forward', () => {
        fakeCiraSocket.tag.boundPorts = []
        fakeCiraSocket.write = jest.fn()
        const length = 50
        const data = '01234cancel-tcpip-forward'
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockImplementation((x, y) => {
          if (y === 1) {
            return 20
          } else if (y === 6 + 20) {
            return 100
          }
        })
        const result = APFProcessor.globalRequest(fakeCiraSocket, length, data)
        expect(result).toEqual(0)
        expect(readIntSpy).toHaveBeenCalled()
      })

      it('should call SendTcpForwardCancelReply on cancel-tcpip-forward happy path', () => {
        fakeCiraSocket.tag.boundPorts = []
        const length = 1000
        const data = '01234cancel-tcpip-forward'
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(25)
        const sendTcpForwardSuccessReplySpy = jest.spyOn(APFProcessor, 'SendTcpForwardSuccessReply')
        const sendTcpForwardCancelReplySpy = jest.spyOn(APFProcessor, 'SendTcpForwardCancelReply')
        const result = APFProcessor.globalRequest(fakeCiraSocket, length, data)
        expect(result).toBeGreaterThan(14)
        expect(sendTcpForwardSuccessReplySpy).not.toHaveBeenCalled()
        expect(sendTcpForwardCancelReplySpy).toHaveBeenCalled()
        expect(readIntSpy).toHaveBeenCalled()
      })

      it('should return on udp-send-to@amt.intel.com happy path', () => {
        fakeCiraSocket.tag.boundPorts = []
        const length = 1000
        const data = '01234udp-send-to@amt.intel.com'
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(25)
        const result = APFProcessor.globalRequest(fakeCiraSocket, length, data)
        expect(result).toBeGreaterThan(26)
        expect(readIntSpy).toHaveBeenCalled()
      })

      it('should return 6 + requestLen on unsupported requested', () => {
        const length = 1000
        const data = '01234unsupported--request'
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(20)
        const result = APFProcessor.globalRequest(fakeCiraSocket, length, data)
        expect(result).toBeGreaterThan(6)
        expect(readIntSpy).toHaveBeenCalled()
      })
    })

    describe('serviceRequest', () => {
      const sendServiceAcceptSpy = jest.spyOn(APFProcessor, 'SendServiceAccept')

      it('should return 0 if length < 5', () => {
        const fakeCiraSocket = null
        const length = 4
        const data = ''
        const result = APFProcessor.serviceRequest(fakeCiraSocket, length, data)
        expect(result).toEqual(0)
      })

      it('should return 0 if length < 5 + serviceNameLen', () => {
        const fakeCiraSocket = null
        const length = 5
        const data = ''
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(1)
        const result = APFProcessor.serviceRequest(fakeCiraSocket, length, data)
        expect(result).toEqual(0)
        expect(readIntSpy).toHaveBeenCalled()
      })

      it('should call SendServiceAccept for pfwd@amt.intel.com', () => {
        const fakeCiraSocket = {
          write: jest.fn()
        } as any
        const length = 100
        const data = '01234pfwd@amt.intel.com'
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(18)
        const result = APFProcessor.serviceRequest(fakeCiraSocket, length, data)
        expect(sendServiceAcceptSpy).toHaveBeenCalled()
        expect(result).toBeGreaterThan(5)
        expect(readIntSpy).toHaveBeenCalled()
      })

      it('should call SendServiceAccept for auth@amt.intel.com', () => {
        const fakeCiraSocket = {
          write: jest.fn()
        } as any
        const length = 100
        const data = '01234auth@amt.intel.com'
        const readIntSpy = jest.spyOn(Common, 'ReadInt').mockReturnValue(18)
        const result = APFProcessor.serviceRequest(fakeCiraSocket, length, data)
        expect(sendServiceAcceptSpy).toHaveBeenCalled()
        expect(result).toBeGreaterThan(5)
        expect(readIntSpy).toHaveBeenCalled()
      })
    })

    describe('userAuthRequest', () => {
      it('should return 0 if length < 13', () => {
        const fakeCiraSocket = null
        const length = 12
        const data = ''
        const result = APFProcessor.userAuthRequest(fakeCiraSocket, length, data)
        expect(result).toEqual(0)
      })

      it('should return 0 if length < 13', () => {
        const fakeCiraSocket = null
        const length = 13
        const data = ''
        const emitSpy = jest.spyOn(APFProcessor.APFEvents, 'emit')
        const result = APFProcessor.userAuthRequest(fakeCiraSocket, length, data)
        expect(result).toBeGreaterThan(18)
        expect(emitSpy).toHaveBeenCalled()
      })
    })

    describe('protocolVersion', () => {
      it('should return 0 if length < 93', () => {
        const fakeCiraSocket = null
        const length = 92
        const data = ''
        const result = APFProcessor.protocolVersion(fakeCiraSocket, length, data)
        expect(result).toEqual(0)
      })

      it('should call APFProcessor.APFEvents.emit on happy path', () => {
        const fakeCiraSocket: CIRASocket = {
          tag: {
          }
        } as any
        const length = 93
        const data = ''
        const emitSpy = jest.spyOn(APFProcessor.APFEvents, 'emit')
        const result = APFProcessor.protocolVersion(fakeCiraSocket, length, data)
        expect(result).toEqual(93)
        expect(emitSpy).toHaveBeenCalled()
      })
    })

    describe('keepAliveReply', () => {
      it('should return 0 if length < 5', () => {
        const length = 4
        const result = APFProcessor.keepAliveReply(length)
        expect(result).toEqual(0)
      })

      it('should return 5 if length >= 5', () => {
        const length = 5
        const result = APFProcessor.keepAliveReply(length)
        expect(result).toEqual(5)
      })
    })

    describe('keepAliveOptionsReply', () => {
      it('should return 0 if length < 9', () => {
        const length = 8
        const data = ''
        const result = APFProcessor.keepAliveOptionsReply(length, data)
        expect(result).toEqual(0)
      })

      it('should return 9 if length >= 9', () => {
        const length = 9
        const data = ''
        const result = APFProcessor.keepAliveOptionsReply(length, data)
        expect(result).toEqual(9)
      })

      it('should return 9 if length >= 9', () => {
        const length = 15
        const data = ''
        const result = APFProcessor.keepAliveOptionsReply(length, data)
        expect(result).toEqual(9)
      })
    })

    describe('keepAliveRequest', () => {
      it('should return 0 if length < 5', () => {
        const fakeCiraSocket = null
        const length = 4
        const data = ''
        const result = APFProcessor.keepAliveRequest(fakeCiraSocket, length, data)
        expect(result).toEqual(0)
      })

      it('should return 5 on happy path', () => {
        const fakeCiraSocket: CIRASocket = {
          tag: {
          },
          write: jest.fn()
        } as any
        const length = 5
        const data = ''
        const sendKeepAliveReplySpy = jest.spyOn(APFProcessor, 'SendKeepAliveReply')
        const result = APFProcessor.keepAliveRequest(fakeCiraSocket, length, data)
        expect(result).toEqual(5)
        expect(sendKeepAliveReplySpy).toHaveBeenCalled()
      })
    })

    describe('Functions based on calling APFProcessor.Write', () => {
      const writeSpy = jest.spyOn(APFProcessor, 'Write')
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
          Common.ShortToStr(0)
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
      it('should convert a byte to guid', () => {
        const result = APFProcessor.guidToStr('44454C4C4B0010428033B6C04F504633')
        expect(result).toBe('4C4C4544-004B-4210-8033-B6C04F504633')
      })
    })
  })
})
