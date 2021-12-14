import { eventLog, GetEventDetailStr } from './eventLog'
import { createSpyObj } from '../../test/helper/jest'
import { devices } from '../../server/mpsserver'
import { ConnectedDevice } from '../../amt/ConnectedDevice'
import { amtMessageLog } from '../../test/helper/wsmanResponses'

describe('event log', () => {
  let resSpy
  let req
  let eventLogSpy
  beforeEach(() => {
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = { params: { guid: '4c4c4544-004b-4210-8033-b6c04f504633' } }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()

    devices['4c4c4544-004b-4210-8033-b6c04f504633'] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
    eventLogSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getEventLog')
  })

  it('should get version', async () => {
    eventLogSpy.mockResolvedValueOnce(amtMessageLog)
    await eventLog(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
  })
  it('should get an error with status code 400, when get version is null', async () => {
    eventLogSpy.mockResolvedValueOnce(null)
    await eventLog(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(400)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Incorrect URI or Bad Request', errorDescription: 'Failed during GET MessageLog guid : 4c4c4544-004b-4210-8033-b6c04f504633.' })
  })
  it('should get an error with status code 500 for an unexpected exception', async () => {
    eventLogSpy.mockImplementation(() => {
      throw new Error()
    })
    await eventLog(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith({ error: 'Internal Server Error', errorDescription: 'Request failed during AMT EventLog.' })
  })
})

describe('event details', () => {
  it('should return authentication failed', () => {
    const result = GetEventDetailStr(6, 2, [64, 3, 0, 0, 0, 0, 0, 0])
    expect(result).toEqual('Authentication failed 3 times. The system may be under attack.')
  })
  it('should return system firware error', () => {
    const result = GetEventDetailStr(15, 0, [64, 10, 0, 0, 0, 0, 0, 0])
    expect(result).toEqual('No video device detected.')
  })
  it('should get system watch dog event', () => {
    const result = GetEventDetailStr(18, 0, [170, 10, 0, 0, 0, 0, 0, 1])
    expect(result).toEqual('Agent watchdog 0000000A-0000-... changed to Not Started')
  })
  it('should get null', () => {
    const result = GetEventDetailStr(18, 0, [64, 10, 0, 0, 0, 0, 0, 1])
    expect(result).toEqual(null)
  })
  it('should get no bootable media', () => {
    const result = GetEventDetailStr(30, 0, [170, 10, 0, 0, 0, 0, 0, 0])
    expect(result).toEqual('No bootable media')
  })
  it('should get system OS lockup or power interrupt', () => {
    const result = GetEventDetailStr(32, 0, [170, 10, 0, 0, 0, 0, 0, 0])
    expect(result).toEqual('Operating system lockup or power interrupt')
  })
  it('shout get system boot failure', () => {
    const result = GetEventDetailStr(35, 0, [64, 10, 0, 0, 0, 0, 0, 0])
    expect(result).toEqual('System boot failure')
  })
  it('should get system firmware started', () => {
    const result = GetEventDetailStr(37, 0, [64, 10, 0, 0, 0, 0, 0, 0])
    expect(result).toEqual('System firmware started (at least one CPU is properly executing).')
  })
  it('should get system firmware started', () => {
    const result = GetEventDetailStr(100, 0, [64, 10, 0, 0, 0, 0, 0, 0])
    expect(result).toEqual('Unknown Sensor Type #100')
  })
})
