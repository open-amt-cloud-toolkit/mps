import { CIRASocket } from '../models/models'
import APFProcessor from './APFProcessor'
import { CIRAChannel } from './CIRAChannel'
import { HttpHandler } from './HttpHandler'

describe('CIRA Channel', () => {
  let ciraChannel: CIRAChannel
  let socket: CIRASocket
  beforeEach(() => {
    socket = { tag: { nextChannelId: 0 } } as any
    ciraChannel = new CIRAChannel(new HttpHandler(), 4000, socket)
  })
  it('should initialize', () => {
    expect(ciraChannel).toBeDefined()
    expect(ciraChannel.state).toBe(1)
    expect(ciraChannel.amtpendingcredits).toBe(0)
    expect(ciraChannel.amtCiraWindow).toBe(0)
    expect(ciraChannel.ciraWindow).toBe(32768)
    expect(ciraChannel.onStateChange).toBeDefined()
    expect(ciraChannel.onData).toBeDefined()
  })
  it('should handle onData', () => {
    ciraChannel.onData('test')
  })
  it('should reject when channel closed on write data', async () => {
    ciraChannel.state = 0
    let error
    try {
      await ciraChannel.writeData(null, null, '1')
    } catch (err) {
      error = err?.message
    } finally {
      expect(error).toBe('Closed')
    }
  })
  it('should close channel when closed', () => {
    ciraChannel.state = 0
    const state = ciraChannel.CloseChannel()
    expect(state).toBe(0)
  })
  it('should close channel when closing', () => {
    ciraChannel.state = 1
    const state = ciraChannel.CloseChannel()
    expect(state).toBe(0)
  })
  it('should close channel when open', () => {
    ciraChannel.state = 2
    ciraChannel.amtchannelid = 44
    const sendChannelSpy = jest.spyOn(APFProcessor, 'SendChannelClose').mockImplementation(() => {})
    const state = ciraChannel.CloseChannel()
    expect(sendChannelSpy).toHaveBeenCalledWith(socket, 44)
    expect(state).toBe(0)
  })
})
