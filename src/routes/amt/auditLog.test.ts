import { atob } from 'atob'
import { ConnectedDevice } from '../../amt/ConnectedDevice'
import { devices } from '../../server/mpsserver'
import auditLog = require('./auditLog')
import { MqttProvider } from '../../utils/MqttProvider'

describe('auditLog', () => {
  let req: Express.Request
  let res: Express.Response
  let statusSpy: jest.SpyInstance
  let endSpy: jest.SpyInstance
  let mqttSpy: jest.SpyInstance

  const fakeGuid = '00000000-0000-0000-0000-000000000000'

  beforeEach(() => {
    req = {
      params: {
        guid: fakeGuid
      },
      query: {
        startIndex: 1
      },
      body: {
      }
    }
    res = {
      status: () => {
        return res
      },
      json: () => {
        return res
      },
      end: () => {
        return res
      }
    }
    statusSpy = jest.spyOn(res as any, 'status')
    endSpy = jest.spyOn(res as any, 'end')
    mqttSpy = jest.spyOn(MqttProvider, 'publishEvent')
  })

  const fakeResponseWithRecords = { Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '1', Action: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecordsResponse', MessageID: 'uuid:00000000-8086-8086-8086-0000000000D4', ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog' }, Body: { ReadRecords_OUTPUT: { TotalRecordCount: '1106', RecordsReturned: '10', EventRecords: ['ABUAAAAJJCRPc0FkbWluP/Nj6wAJMTI3LjAuMC4xBFyZIW4=', 'ABUAAAAJJCRPc0FkbWluXJlLAQAJMTI3LjAuMC4xBFyaHfM=', 'ABUAAAAJJCRPc0FkbWluXoMPegEnMDAwMDowMDAwOjAwMDA6MDAwMDowMDAwOjAwMDA6MDAwMDowMDAxBF6CO2A=', 'ABAAAAJegj0UAgAA', 'ABUAAAAFYWRtaW5egj0kAAkxMjcuMC4wLjEEXoI9JQ==', 'ABIACgAFYWRtaW5egj0nAAkxMjcuMC4wLjEA', 'AB0AAgAFYWRtaW5egj0tAAkxMjcuMC4wLjEA', 'ABAAAAJhqMdtAgAA', 'ABAAEwAFYWRtaW5hpfvMAScwMDAwOjAwMDA6MDAwMDowMDAwOjAwMDA6MDAwMDowMDAwOjAwMDEBBA==', 'AB4AAQAFYWRtaW5hpfrtAAcxLjIuMy40AQA='], ReturnValue: '0' } } } }

  it('should convert response to an auditLog result', () => {
    const result = auditLog.convertToAuditLogResult(fakeResponseWithRecords.Envelope.Body.ReadRecords_OUTPUT)
    expect(Number(result.totalCnt)).toBe(1106)
    expect(result.records.length).toBe(10)
  })

  it('should convert response to an auditLog result', () => {
    const fakeResponseWithoutRecords = { Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '1', Action: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecordsResponse', MessageID: 'uuid:00000000-8086-8086-8086-0000000000D4', ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog' }, Body: { ReadRecords_OUTPUT: { TotalRecordCount: '1106', RecordsReturned: '0', EventRecords: [], ReturnValue: '0' } } } }
    const result = auditLog.convertToAuditLogResult(fakeResponseWithoutRecords.Envelope.Body.ReadRecords_OUTPUT)
    expect(result.records.length).toBe(0)
  })

  it('should get initiator info for http digest and ptr value from decoded event record', () => {
    const fakeDecodedEventRecordforInitiatorTypeHttpDigest = atob('ABUAAAAJJCRPc0FkbWluP/Nj6wAJMTI3LjAuMC4xBFyZIW4=')
    const [initiatorType, initiator, ptr] = auditLog.getInitiatorInfo(fakeDecodedEventRecordforInitiatorTypeHttpDigest)
    expect(initiatorType).toBe(auditLog.InitiatorType.HttpDigest)
    expect(initiator).toBe('$$OsAdmin')
    expect(ptr).toBe(15)
  })

  it('should get initiator info for local and ptr value from decoded event record', () => {
    const fakeDecodedEventRecordforInitiatorTypeLocal = atob('ABAAAAJegj0UAgAA')
    const [initiatorType, initiator, ptr] = auditLog.getInitiatorInfo(fakeDecodedEventRecordforInitiatorTypeLocal)
    expect(initiatorType).toBe(auditLog.InitiatorType.Local)
    expect(initiator).toBe('Local')
    expect(ptr).toBe(5)
  })

  it('should return 200 in happy path', async () => {
    devices[fakeGuid] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
    jest.spyOn(devices[fakeGuid], 'getAuditLog').mockResolvedValue(fakeResponseWithRecords.Envelope.Body)

    await auditLog.auditLog(req as any, res as any)
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(endSpy).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })

  it('should return 200 in happy path with startIndex of 0', async () => {
    devices[fakeGuid] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
    jest.spyOn(devices[fakeGuid], 'getAuditLog').mockResolvedValue(fakeResponseWithRecords.Envelope.Body)
    const reqWithStartIndexOf0 = {
      params: {
        guid: fakeGuid
      },
      query: {
        startIndex: 0
      },
      body: {
      }
    }
    await auditLog.auditLog(reqWithStartIndexOf0 as any, res as any)
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(endSpy).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })

  it('should return 500 on exception', async () => {
    devices[fakeGuid] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
    jest.spyOn(devices[fakeGuid], 'getAuditLog').mockImplementation(() => {
      throw new Error()
    })

    await auditLog.auditLog(req as any, res as any)
    expect(statusSpy).toHaveBeenCalledWith(500)
    expect(mqttSpy).toHaveBeenCalled()
  })
})
