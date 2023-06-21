/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { atob } from 'atob'
import * as auditLog from './auditLog'
import { MqttProvider } from '../../utils/MqttProvider'
import { createSpyObj } from '../../test/helper/jest'
import { DeviceAction } from '../../amt/DeviceAction'
import { CIRAHandler } from '../../amt/CIRAHandler'
import { HttpHandler } from '../../amt/HttpHandler'
import { type AMT } from '@open-amt-cloud-toolkit/wsman-messages'

describe('auditLog', () => {
  let req
  let resSpy
  let device: DeviceAction
  let mqttSpy: jest.SpyInstance
  let getAuditLogSpy: jest.SpyInstance
  const fakeGuid = '00000000-0000-0000-0000-000000000000'
  const eventRecords = [
    'ABUAAAAJJCRPc0FkbWluP/Nj6wAJMTI3LjAuMC4xBFyZIW4=',
    'ABUAAAAJJCRPc0FkbWluXJlLAQAJMTI3LjAuMC4xBFyaHfM=',
    'ABUAAAAJJCRPc0FkbWluXoMPegEnMDAwMDowMDAwOjAwMDA6MDAwMDowMDAwOjAwMDA6MDAwMDowMDAxBF6CO2A=',
    'ABAAAAJegj0UAgAA',
    'ABUAAAAFYWRtaW5egj0kAAkxMjcuMC4wLjEEXoI9JQ==',
    'ABIACgAFYWRtaW5egj0nAAkxMjcuMC4wLjEA',
    'AB0AAgAFYWRtaW5egj0tAAkxMjcuMC4wLjEA',
    'ABAAAAJhqMdtAgAA',
    'ABAAEwAFYWRtaW5hpfvMAScwMDAwOjAwMDA6MDAwMDowMDAwOjAwMDA6MDAwMDowMDAwOjAwMDEBBA==',
    'AB4AAQAFYWRtaW5hpfrtAAcxLjIuMy40AQA='
  ]
  let wsmanRsp: AMT.Models.AuditLog_ReadRecords

  beforeEach(() => {
    const handler = new CIRAHandler(new HttpHandler(), 'admin', 'P@ssw0rd')
    device = new DeviceAction(handler, null)
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = {
      deviceAction: device,
      params: {
        guid: fakeGuid
      },
      query: {}
    }
    wsmanRsp = {
      ReadRecords_OUTPUT: {
        TotalRecordCount: eventRecords.length.toString(),
        RecordsReturned: eventRecords.length.toString(),
        EventRecords: eventRecords,
        ReturnValue: '0'
      }
    }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()
    mqttSpy = jest.spyOn(MqttProvider, 'publishEvent')
    getAuditLogSpy = jest.spyOn(device, 'getAuditLog')
  })

  it('should convert response to an auditLog result', () => {
    const result = auditLog.convertToAuditLogResult(wsmanRsp.ReadRecords_OUTPUT)
    expect(Number(result.totalCnt)).toBe(eventRecords.length)
    expect(result.records.length).toBe(eventRecords.length)
  })

  it('should convert response to an auditLog result', () => {
    wsmanRsp.ReadRecords_OUTPUT.RecordsReturned = '0'
    wsmanRsp.ReadRecords_OUTPUT.EventRecords = []
    const result = auditLog.convertToAuditLogResult(wsmanRsp.ReadRecords_OUTPUT)
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

  it('should return 200 with no startIndex in query', async () => {
    getAuditLogSpy.mockResolvedValue(wsmanRsp)
    await auditLog.auditLog(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.end).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })

  it('should get newest by default (reverse order) and handle end case', async () => {
    const events01 = eventRecords.slice(1, 7)
    const rsp01 = {
      ReadRecords_OUTPUT: {
        TotalRecordCount: eventRecords.length.toString(),
        RecordsReturned: events01.length.toString(),
        EventRecords: events01,
        ReturnValue: '0'
      }
    }
    const events02 = eventRecords.slice(8)
    const rsp02 = {
      ReadRecords_OUTPUT: {
        TotalRecordCount: eventRecords.length.toString(),
        RecordsReturned: events02.length.toString(),
        EventRecords: events02,
        ReturnValue: '0'
      }
    }
    rsp02.ReadRecords_OUTPUT.RecordsReturned = events02.length.toString()
    rsp02.ReadRecords_OUTPUT.EventRecords = events02

    req.query.startIndex = 2
    getAuditLogSpy
      .mockResolvedValueOnce(rsp01)
      .mockResolvedValueOnce(rsp02)
    await auditLog.auditLog(req, resSpy)
    expect(getAuditLogSpy).toHaveBeenNthCalledWith(1, 2)
    expect(getAuditLogSpy).toHaveBeenNthCalledWith(2, 1)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.end).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })

  it('should return 500 on exception', async () => {
    getAuditLogSpy.mockImplementation(() => {
      throw new Error()
    })

    await auditLog.auditLog(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(mqttSpy).toHaveBeenCalled()
  })
})
