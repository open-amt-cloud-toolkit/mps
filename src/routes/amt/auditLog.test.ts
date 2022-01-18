import { atob } from 'atob'
import auditLog = require('./auditLog')
import { MqttProvider } from '../../utils/MqttProvider'
import { createSpyObj } from '../../test/helper/jest'
import { DeviceAction } from '../../amt/DeviceAction'
import { CIRAHandler } from '../../amt/CIRAHandler'
import { HttpHandler } from '../../amt/HttpHandler'

describe('auditLog', () => {
  let req: Express.Request
  let resSpy
  let device: DeviceAction
  let mqttSpy: jest.SpyInstance
  let getAuditLogSpy: jest.SpyInstance
  const fakeGuid = '00000000-0000-0000-0000-000000000000'

  beforeEach(() => {
    const handler = new CIRAHandler(new HttpHandler(), 'admin', 'P@ssw0rd')
    device = new DeviceAction(handler, null)
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = {
      deviceAction: device,
      params: {
        guid: fakeGuid
      },
      query: {
        startIndex: 1
      },
      body: {
      }
    }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()
    mqttSpy = jest.spyOn(MqttProvider, 'publishEvent')
    getAuditLogSpy = jest.spyOn(device, 'getAuditLog')
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
    getAuditLogSpy.mockResolvedValue(fakeResponseWithRecords.Envelope.Body)

    await auditLog.auditLog(req as any, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.end).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })

  it('should return 200 in happy path with startIndex of 0', async () => {
    getAuditLogSpy.mockResolvedValue(fakeResponseWithRecords.Envelope.Body)
    const reqWithStartIndexOf0 = {
      params: {
        guid: fakeGuid
      },
      query: {
        startIndex: 0
      },
      body: {
      },
      deviceAction: device
    }
    await auditLog.auditLog(reqWithStartIndexOf0 as any, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.end).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })

  it('should return 500 on exception', async () => {
    getAuditLogSpy.mockImplementation(() => {
      throw new Error()
    })

    await auditLog.auditLog(req as any, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(mqttSpy).toHaveBeenCalled()
  })
})
