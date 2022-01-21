import { CIRASocket } from '../models/models'
import { ConnectedDevice } from './ConnectedDevice'

const socket: CIRASocket = null

describe('Connected Device', () => {
  it('should initialize', () => {
    const device = new ConnectedDevice(socket, 'admin', 'P@ssw0rd')
    expect(device.ciraSocket).toBeNull()
    expect(device.httpHandler).toBeDefined()
  })
})
