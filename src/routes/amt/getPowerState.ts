/*********************************************************************
* Copyright (c) Intel Corporation
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Response, Request } from 'express'
import { logger, messages } from '../../logging'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'

export async function powerState (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid
    MqttProvider.publishEvent('request', ['AMT_PowerState'], messages.POWER_STATE_GET_REQUESTED, guid)
    const response = await req.deviceAction.getPowerState()

    if (response?.PullResponse?.Items?.CIM_AssociatedPowerManagementService?.PowerState) {
      res.status(200).send({ powerstate: response.PullResponse.Items.CIM_AssociatedPowerManagementService.PowerState })
    } else {
      MqttProvider.publishEvent('fail', ['AMT_PowerState'], messages.POWER_STATE_REQUEST_FAILED, guid)
      logger.error(`${messages.POWER_STATE_REQUEST_FAILED} for guid : ${guid}.`)
      res.status(400).json(ErrorResponse(400, `${messages.POWER_STATE_REQUEST_FAILED} for guid : ${guid}.`))
    }
  } catch (error) {
    logger.error(`${messages.POWER_STATE_EXCEPTION} : ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_PowerState'], messages.INTERNAL_SERVICE_ERROR)
    res.status(500).json(ErrorResponse(500, messages.POWER_STATE_EXCEPTION))
  }
}
