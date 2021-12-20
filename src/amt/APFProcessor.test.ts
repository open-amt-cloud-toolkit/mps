import Common from '../utils/common'
import { logger } from '../utils/logger'
import APFProcessor, { APFProtocol } from './APFProcessor'
import { CIRAChannel } from './CIRAHandler'
import { CIRASocket } from '../models/models'

describe('APFProcessor', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return 0 if len is 0', async () => {
    const fakeCiraSocket: CIRASocket = {
      tag: {
        accumulator: {
          charCodeAt: jest.fn(),
          length: 0
        }
      }
    } as any

    const result = await APFProcessor.processCommand(fakeCiraSocket)
    expect(result).toEqual(0)
  })

  it('should call keepAliveRequest', async () => {
    const fakeCiraSocket: CIRASocket = {
      tag: {
        accumulator: {
          charCodeAt: jest.fn().mockReturnValue(APFProtocol.KEEPALIVE_REQUEST),
          length: 1
        }
      }
    } as any
    APFProcessor.keepAliveRequest = jest.fn()

    await APFProcessor.processCommand(fakeCiraSocket)
    expect(APFProcessor.keepAliveRequest).toHaveBeenCalled()
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
    Common.ReadInt = jest.fn().mockReturnValue(1)

    const result = APFProcessor.channelData(fakeCiraSocket, len, data)
    const expectedResult = 0
    expect(result).toEqual(expectedResult)
  })

  it('should return 9 + LengthOfData if cirachannel is null', () => {
    const fakeCiraSocket = {
      tag: {
        channels: [null, null]
      }
    }
    const len: number = 100
    const data: any = null
    const lengthOfData = 1
    Common.ReadInt = jest.fn().mockReturnValue(lengthOfData)
    logger.error = jest.fn()

    const result = APFProcessor.channelData(fakeCiraSocket as any, len, data)
    const expectedResult = 9 + lengthOfData
    expect(result).toEqual(expectedResult)
    expect(logger.error).toHaveBeenCalledTimes(1)
  })

  it('should return 9 + LengthOfData if happy path', () => {
    const fakeCiraChannel: CIRAChannel = {
      onData: jest.fn(),
      amtpendingcredits: 1000,
      ciraWindow: 1000
    } as any

    const fakeCiraSocket: CIRASocket = {
      tag: {
        channels: [null, fakeCiraChannel]
      }
    } as any

    const len: number = 100
    const data: string = Common.IntToStr(100)
    const lengthOfData = 1
    Common.ReadInt = jest.fn().mockReturnValue(lengthOfData)
    APFProcessor.SendChannelWindowAdjust = jest.fn()

    const result = APFProcessor.channelData(fakeCiraSocket as any, len, data)
    const expectedResult = 9 + lengthOfData
    expect(result).toEqual(expectedResult)
    expect(APFProcessor.SendChannelWindowAdjust).toHaveBeenCalled()
  })

  describe('channelWindowAdjust() tests', () => {
    it('should return 0 if len < 9', () => {
      const result = APFProcessor.channelWindowAdjust(null, 8, '')
      expect(result).toEqual(0)
    })

    it('should return 9 if cirachannel is null', () => {
      const fakeCiraSocket: CIRASocket = {
        tag: {
          channels: [null, null]
        }
      } as any
      const data: string = Common.IntToStr(0)
      logger.error = jest.fn()

      const result = APFProcessor.channelWindowAdjust(fakeCiraSocket, 9, data)
      expect(result).toEqual(9)
      expect(logger.error).toHaveBeenCalledTimes(1)
    })

    it('should return 9 if sending entire pending buffer', () => {
      const fakeCiraChannel: CIRAChannel = {
        state: 2,
        sendBuffer: {
          length: 1000
        },
        sendcredits: 1000
      } as any
      const fakeCiraSocket: CIRASocket = {
        tag: {
          channels: [null, fakeCiraChannel]
        }
      } as any
      const data: string = Common.IntToStr(0)
      APFProcessor.SendChannelData = jest.fn()

      const result = APFProcessor.channelWindowAdjust(fakeCiraSocket, 9, data)
      expect(result).toEqual(9)
      expect(APFProcessor.SendChannelData).toHaveBeenCalledTimes(1)
    })

    it('should return 9 if sending partial pending buffer', () => {
      const fakeCiraChannel: CIRAChannel = {
        state: 2,
        sendBuffer: {
          length: 2000,
          substring: jest.fn()
        },
        sendcredits: 1000
      } as any
      const fakeCiraSocket: CIRASocket = {
        tag: {
          channels: [null, fakeCiraChannel]
        }
      } as any
      const data: string = Common.IntToStr(0)
      APFProcessor.SendChannelData = jest.fn()

      const result = APFProcessor.channelWindowAdjust(fakeCiraSocket, 9, data)
      expect(result).toEqual(9)
      expect(APFProcessor.SendChannelData).toHaveBeenCalledTimes(1)
      expect(fakeCiraChannel.sendcredits).toEqual(0)
    })
  })

  describe('channelClose() tests', () => {
    it('should return 0 if length < 5', () => {
      const result = APFProcessor.channelClose(null, 4, '')
      expect(result).toEqual(0)
    })

    it('should return 5 if cirachannel is null', () => {
      const fakeCiraSocket: CIRASocket = {
        tag: {
          channels: [null, null]
        }
      } as any
      Common.ReadInt = jest.fn().mockReturnValue(0)
      logger.error = jest.fn()
      const result = APFProcessor.channelClose(fakeCiraSocket, 5, '')
      expect(result).toEqual(5)
      expect(logger.error).toHaveBeenCalledTimes(1)
    })

    it('should return 5 happy path', () => {
      const fakeCiraChannel: CIRAChannel = {
        state: 1,
        onStateChange: jest.fn()
      } as any
      const fakeCiraSocket: CIRASocket = {
        tag: {
          channels: [null, fakeCiraChannel]
        }
      } as any
      Common.ReadInt = jest.fn().mockReturnValue(1)
      APFProcessor.SendChannelClose = jest.fn()
      const result = APFProcessor.channelClose(fakeCiraSocket, 5, '')
      expect(result).toEqual(5)
      expect(APFProcessor.SendChannelClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('channelOpenFailure() tests', () => {
    it('should return 0 if length < 17', () => {
      const result = APFProcessor.channelOpenFailure(null, 16, '')
      expect(result).toEqual(0)
    })

    it('should return 17 if cirachannel is null', () => {
      const fakeCiraSocket: CIRASocket = {
        tag: {
          channels: [null, null]
        }
      } as any
      Common.ReadInt = jest.fn().mockReturnValue(0)
      logger.error = jest.fn()
      const result = APFProcessor.channelOpenFailure(fakeCiraSocket, 17, '')
      expect(result).toEqual(17)
      expect(logger.error).toHaveBeenCalledTimes(1)
    })

    it('should return 17 happy path', () => {
      const fakeCiraChannel: CIRAChannel = {
        state: 1,
        onStateChange: jest.fn(),
        sendcredits: 1000
      } as any
      const fakeCiraSocket: CIRASocket = {
        tag: {
          channels: [null, fakeCiraChannel]
        }
      } as any
      Common.ReadInt = jest.fn().mockReturnValue(1)
      const result = APFProcessor.channelOpenFailure(fakeCiraSocket, 17, '')
      expect(result).toEqual(17)
    })
  })

  describe('APF Processor ', () => {
    it('should convert a byte to guid', async () => {
      const result = APFProcessor.guidToStr('44454C4C4B0010428033B6C04F504633')
      expect(result).toBe('4C4C4544-004B-4210-8033-B6C04F504633')
    })
  })
})
