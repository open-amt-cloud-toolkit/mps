/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type Response, type Request } from 'express'
import { logger, messages } from '../../logging/index.js'
import { ErrorResponse } from '../../utils/amtHelper.js'
import { MqttProvider } from '../../utils/MqttProvider.js'
import { type DeviceAction } from '../../amt/DeviceAction.js'

export async function getAlarmOccurrences(req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid

    MqttProvider.publishEvent('request', ['AMT_AlarmOccurrences'], messages.ALARM_OCCURRENCES_GET_REQUESTED, guid)
    const response = await get(req.deviceAction, guid)
    if (response == null) {
      logger.error(`${messages.ALARM_OCCURRENCES_GET_REQUEST_FAILED} for guid : ${guid}.`)
      MqttProvider.publishEvent('fail', ['AMT_AlarmOccurrences'], messages.ALARM_OCCURRENCES_GET_REQUEST_FAILED, guid)
      res.status(400).json(ErrorResponse(400, `${messages.ALARM_OCCURRENCES_GET_REQUEST_FAILED} for guid : ${guid}.`))
    } else {
      let alarms = []
      const items = response.Body.PullResponse.Items.IPS_AlarmClockOccurrence
      if (items != null) {
        alarms = Array.isArray(items) ? items : [items]
      }
      MqttProvider.publishEvent('success', ['AMT_AlarmOccurrences'], messages.ALARM_OCCURRENCES_GET_SUCCESS, guid)
      logger.info(JSON.stringify(alarms, null, '\t'))
      res.status(200).json(alarms)
    }
  } catch (error) {
    logger.error(`${messages.ALARM_OCCURRENCES_EXCEPTION} : ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_AlarmOccurrences'], messages.INTERNAL_SERVICE_ERROR)
    res.status(500).json(ErrorResponse(500, messages.ALARM_OCCURRENCES_EXCEPTION))
  }
}

// device.getAlarmClockOccurrences() is separated out for the tests with the side effect of casting the result to any
export async function get(device: DeviceAction, guid: string): Promise<any> {
  return await device.getAlarmClockOccurrences()
}
