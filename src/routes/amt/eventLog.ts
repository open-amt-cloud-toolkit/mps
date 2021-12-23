/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device event logs
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'
import { SystemEntityTypes, SystemFirmwareError, SystemFirmwareProgress, WatchdogCurrentStates } from '../../utils/constants'
import Common from '../../utils/common'
import { devices } from '../../server/mpsserver'
import { AMT } from '@open-amt-cloud-toolkit/wsman-messages/dist'

export async function eventLog (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid

    MqttProvider.publishEvent('request', ['AMT_EventLog'], 'Event Log Requested', guid)
    const response = await devices[guid].getEventLog()
    if (response != null) {
      MqttProvider.publishEvent('success', ['AMT_EventLog'], 'Sent Event Log', guid)
      const result = parseEventLogs(response)
      res.status(200).json(result)
    } else {
      log.error(`Failed during GET MessageLog guid : ${guid}.`)
      MqttProvider.publishEvent('fail', ['AMT_EventLog'], 'Failed to Get Event Log', guid)
      res.status(400).json(ErrorResponse(400, `Failed during GET MessageLog guid : ${guid}.`))
    }
  } catch (error) {
    log.error(`Exception in AMT EventLog: ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_EventLog'], 'Internal Server Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT EventLog.'))
  }
}

interface EventLog extends AMT.Models.EVENT_DATA {
  EntityStr?: string
  Desc?: string
}

export function GetEventDetailStr (eventSensorType: number, eventOffset: number, eventDataField: number[]): string {
  switch (eventSensorType) {
    case 6:
      return `Authentication failed ${(eventDataField[1] + (eventDataField[2] << 8))} times. The system may be under attack.`
    case 15: {
      if (eventDataField[0] === 235) return 'Invalid Data'
      if (eventOffset === 0) {
        return SystemFirmwareError[eventDataField[1]]
      }
      return SystemFirmwareProgress[eventDataField[1]]
    }
    case 18:
      // System watchdog event
      if (eventDataField[0] === 170) {
        return `Agent watchdog ${Common.Char2hex(eventDataField[4]) + Common.Char2hex(eventDataField[3]) + Common.Char2hex(eventDataField[2]) + Common.Char2hex(eventDataField[1])}-${Common.Char2hex(eventDataField[6]) + Common.Char2hex(eventDataField[5])}-... changed to ${WatchdogCurrentStates[eventDataField[7]]}`
      }
      return null
    case 30:
      return 'No bootable media'
    case 32:
      return 'Operating system lockup or power interrupt'
    case 35:
      return 'System boot failure'
    case 37:
      return 'System firmware started (at least one CPU is properly executing).'
    default:
      return `Unknown Sensor Type #${eventSensorType}`
  }
}

function parseEventLogs (response: any): EventLog[] {
  const recordArray: EventLog[] = []
  if (typeof response.Body.GetRecords_OUTPUT.RecordArray === 'string') {
    response.Body.GetRecords_OUTPUT.RecordArray = [response.Body.GetRecords_OUTPUT.RecordArray]
  }
  response.Body.GetRecords_OUTPUT.RecordArray.forEach((record) => {
    const eventRecord = Buffer.from(record, 'base64')
    if (eventRecord != null) {
      const log: EventLog = {}
      const TimeStamp = Common.ReadBufferIntX(eventRecord, 0)
      if ((TimeStamp > 0) && (TimeStamp < 0xFFFFFFFF)) {
        const t = new Date()
        log.DeviceAddress = eventRecord[4]
        log.EventSensorType = eventRecord[5]
        log.EventType = eventRecord[6]
        log.EventOffset = eventRecord[7]
        log.EventSourceType = eventRecord[8]
        log.EventSeverity = eventRecord[9]
        log.SensorNumber = eventRecord[10]
        log.Entity = eventRecord[11]
        log.EntityInstance = eventRecord[12]
        log.EventData = []
        log.TimeStamp = new Date((TimeStamp + (t.getTimezoneOffset() * 60)) * 1000)
      }
      for (let j = 13; j < 21; j++) {
        log.EventData.push(eventRecord[j])
      }
      log.EntityStr = SystemEntityTypes[log.Entity]
      log.Desc = GetEventDetailStr(log.EventSensorType, log.EventOffset, log.EventData)
      if (log.EntityStr == null) {
        log.EntityStr = 'Unknown'
      }
      recordArray.push(log)
    }
  })
  return recordArray
}
