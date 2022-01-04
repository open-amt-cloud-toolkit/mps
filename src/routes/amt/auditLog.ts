/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device audit logs
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'
import { devices } from '../../server/mpsserver'
import { atob } from 'atob'
import Common from '../../utils/common'
import { AmtAuditStringTable, RealmNames } from '../../utils/constants'
import { AuditLogReadRecordsOutput, AuditLogRecord, AuditLogResult } from '@open-amt-cloud-toolkit/wsman-messages/dist/models/common'

export async function auditLog (req: Request, res: Response): Promise<void> {
  try {
    const queryParams = req.query
    const guid: string = req.params.guid
    const startIndexAsNumber = Number(queryParams.startIndex)
    const startIndex: number = startIndexAsNumber === 0 ? 1 : startIndexAsNumber
    MqttProvider.publishEvent('request', ['AMT_AuditLog'], 'Audit Log Requested', guid)
    const getResponse = await devices[guid].getAuditLog(startIndex)
    const result = convertToAuditLogResult(getResponse.ReadRecords_OUTPUT)
    res.status(200).json(result).end()
  } catch (error) {
    log.error(`Exception in AMT AuditLog : ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_AuditLog'], 'Internal Service Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT AuditLog.')).end()
  }
}

export function convertToAuditLogResult (readRecordsOutput: AuditLogReadRecordsOutput): AuditLogResult {
  const auditLogResult: AuditLogResult = {
    totalCnt: 0,
    records: []
  }

  auditLogResult.totalCnt = Number(readRecordsOutput.TotalRecordCount)

  const recordsReturned: number = Number(readRecordsOutput.RecordsReturned)
  if (recordsReturned <= 0) {
    return auditLogResult
  }

  for (const eventRecord of readRecordsOutput.EventRecords) {
    let ptr: number
    const decodedEventRecord: string = atob(eventRecord)
    const auditLogRecord: AuditLogRecord = {
      AuditAppID: 0,
      EventID: 0,
      InitiatorType: 0,
      AuditApp: '',
      Event: '',
      Initiator: '',
      Time: undefined,
      MCLocationType: 0,
      NetAddress: '',
      Ex: '',
      ExStr: null
    }

    auditLogRecord.AuditAppID = Common.ReadShort(decodedEventRecord, 0)
    auditLogRecord.EventID = Common.ReadShort(decodedEventRecord, 2)
    auditLogRecord.AuditApp = AmtAuditStringTable[auditLogRecord.AuditAppID]
    auditLogRecord.InitiatorType = decodedEventRecord.charCodeAt(4)
    auditLogRecord.Event = AmtAuditStringTable[(auditLogRecord.AuditAppID * 100) + auditLogRecord.EventID]

    if (!auditLogRecord.Event) auditLogRecord.Event = '#' + auditLogRecord.EventID

    const [initiatorType, initiator, pointer] = getInitiatorInfo(decodedEventRecord)
    auditLogRecord.InitiatorType = initiatorType
    auditLogRecord.Initiator = initiator
    ptr = pointer

    // Read timestamp
    const timeStamp = Common.ReadInt(decodedEventRecord, ptr)
    auditLogRecord.Time = new Date((timeStamp + (new Date().getTimezoneOffset() * 60)) * 1000)
    ptr += 4

    // Read network access
    auditLogRecord.MCLocationType = decodedEventRecord.charCodeAt(ptr++)
    const netlen = decodedEventRecord.charCodeAt(ptr++)
    auditLogRecord.NetAddress = decodedEventRecord.substring(ptr, ptr + netlen).replace('0000:0000:0000:0000:0000:0000:0000:0001', '::1')

    // Read extended data
    ptr += netlen
    const exlen = decodedEventRecord.charCodeAt(ptr++)
    auditLogRecord.Ex = decodedEventRecord.substring(ptr, ptr + exlen)
    auditLogRecord.ExStr = GetAuditLogExtendedDataString((auditLogRecord.AuditAppID * 100) + auditLogRecord.EventID, auditLogRecord.Ex)

    auditLogResult.records.push(auditLogRecord)
  }

  return auditLogResult
}

export enum AuditEventId {
  AclEntryAdded = 1602,
  AclEntryModified = 1603,
  AclEntryRemoved = 1604,
  AclAccessWithInvalidCredentials = 1605,
  AclEntryStateChanged = 1606,
  TlsStateChanged = 1607,
  SetRealmAuthenticationMode = 1617,
  AmtUnprovisioningStarted = 1619,
  FirmwareUpdate = 1900,
  AmtTimeSet = 2100,
  OptInPolicyChange = 3000,
  SendConsentCode = 3001
}

// Return human readable extended audit log data
// TODO: Just put some of them here, but many more still need to be added, helpful link here:
// https://software.intel.com/sites/manageability/AMT_Implementation_and_Reference_Guide/default.htm?turl=WordDocuments%2Fsecurityadminevents.htm
export function GetAuditLogExtendedDataString (auditEventId: number, data: string): string {
  let extendedDataString: string

  switch (auditEventId) {
    case AuditEventId.AclEntryAdded:
    case AuditEventId.AclEntryRemoved:
      if (data.charCodeAt(0) === 0) {
        extendedDataString = data.substring(2, 2 + data.charCodeAt(1))
      }
      break
    case AuditEventId.AclEntryModified:
      if (data.charCodeAt(1) === 0) {
        extendedDataString = data.substring(3)
      }
      break
    case AuditEventId.AclAccessWithInvalidCredentials:
      extendedDataString = ['Invalid ME access', 'Invalid MEBx access'][data.charCodeAt(0)]
      break
    case AuditEventId.AclEntryStateChanged: {
      let r = ['Disabled', 'Enabled'][data.charCodeAt(0)]
      if (data.charCodeAt(1) === 0) {
        r += ', ' + data.substring(3)
      }
      extendedDataString = r
      break
    }
    case AuditEventId.TlsStateChanged:
      extendedDataString = 'Remote ' + ['NoAuth', 'ServerAuth', 'MutualAuth'][data.charCodeAt(0)] + ', Local ' + ['NoAuth', 'ServerAuth', 'MutualAuth'][data.charCodeAt(1)]
      break
    case AuditEventId.SetRealmAuthenticationMode:
      extendedDataString = RealmNames[Common.ReadInt(data, 0)] + ', ' + ['NoAuth', 'Auth', 'Disabled'][data.charCodeAt(4)]
      break
    case AuditEventId.AmtUnprovisioningStarted:
      extendedDataString = ['BIOS', 'MEBx', 'Local MEI', 'Local WSMAN', 'Remote WSMAN'][data.charCodeAt(0)]
      break
    case AuditEventId.FirmwareUpdate:
      extendedDataString = 'From ' + Common.ReadShort(data, 0) + '.' + Common.ReadShort(data, 2) + '.' + Common.ReadShort(data, 4) + '.' + Common.ReadShort(data, 6) + ' to ' + Common.ReadShort(data, 8) + '.' + Common.ReadShort(data, 10) + '.' + Common.ReadShort(data, 12) + '.' + Common.ReadShort(data, 14)
      break
    case AuditEventId.AmtTimeSet: {
      const t4 = new Date()
      t4.setTime(Common.ReadInt(data, 0) * 1000 + (new Date().getTimezoneOffset() * 60000))
      extendedDataString = t4.toLocaleString()
      break
    }
    case AuditEventId.OptInPolicyChange:
      extendedDataString = 'From ' + ['None', 'KVM', 'All'][data.charCodeAt(0)] + ' to ' + ['None', 'KVM', 'All'][data.charCodeAt(1)]
      break
    case AuditEventId.SendConsentCode:
      extendedDataString = ['Success', 'Failed 3 times'][data.charCodeAt(0)]
      break
    default:
      extendedDataString = null
  }
  return extendedDataString
}

export enum InitiatorType {
  HttpDigest = 0,
  Kerberos = 1,
  Local = 2,
  KvmDefaultPort = 3,
}

export function getInitiatorInfo (decodedEventRecord: string): [initiatorType: number, initiator: string, ptr: number] {
  let initiator: string
  let userlen: number
  let ptr: number
  const initiatorType = decodedEventRecord.charCodeAt(4)

  switch (initiatorType) {
    case InitiatorType.HttpDigest:
      userlen = decodedEventRecord.charCodeAt(5)
      initiator = decodedEventRecord.substring(6, 6 + userlen)
      ptr = 6 + userlen
      break
    case InitiatorType.Kerberos:
      userlen = decodedEventRecord.charCodeAt(9)
      initiator = Common.GetSidString(decodedEventRecord.substring(10, 10 + userlen))
      ptr = 10 + userlen
      break
    case InitiatorType.Local:
      initiator = 'Local'
      ptr = 5
      break
    case InitiatorType.KvmDefaultPort:
      initiator = 'KVM Default Port'
      ptr = 5
      break
    default:
      initiator = ''
      ptr = 0
  }

  return [initiatorType, initiator, ptr]
}
