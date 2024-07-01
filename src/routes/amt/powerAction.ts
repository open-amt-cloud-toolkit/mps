/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type Response, type Request } from 'express'
import { logger, messages } from '../../logging/index.js'
import { ErrorResponse } from '../../utils/amtHelper.js'
import { MqttProvider } from '../../utils/MqttProvider.js'
import { AMTStatusCodes } from '../../utils/constants.js'
import { type AMT, type CIM } from '@open-amt-cloud-toolkit/wsman-messages'

export async function powerAction (req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body
    const powerAction = await req.deviceAction.sendPowerAction(payload.action as CIM.Types.PowerManagementService.PowerState)
    powerAction.Body.RequestPowerStateChange_OUTPUT.ReturnValueStr = AMTStatusToString(powerAction.Body.RequestPowerStateChange_OUTPUT.ReturnValue as number)
    powerAction.Body = powerAction.Body.RequestPowerStateChange_OUTPUT
    MqttProvider.publishEvent('success', ['AMT_PowerAction'], messages.POWER_ACTION_REQUESTED)
    res.status(200).json(powerAction).end()
  } catch (error) {
    logger.error(`${messages.POWER_ACTION_EXCEPTION} : ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_PowerAction'], messages.INTERNAL_SERVICE_ERROR)
    res.status(500).json(ErrorResponse(500, messages.POWER_ACTION_EXCEPTION)).end()
  }
}

function AMTStatusToString (code: number): string {
  if (AMTStatusCodes[code]) {
    return AMTStatusCodes[code]
  } else return 'UNKNOWN_ERROR'
}
