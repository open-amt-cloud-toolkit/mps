/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device current power state
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'
import { devices } from '../../server/mpsserver'
import { CIM_ServiceAvailableToElement_Pull } from '../../amt/models/cim_response'

export async function powerState (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid
    MqttProvider.publishEvent('request', ['AMT_PowerState'], 'Power State Requested', guid)
    const response: CIM_ServiceAvailableToElement_Pull = await devices[guid].getPowerState()
    res.status(200).send(response.Envelope.Body.PullResponse.Items.CIM_AssociatedPowerManagementService.PowerState)
  } catch (error) {
    log.error(`Exception in Power state : ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_PowerState'], 'Internal Server Error')
    return res.status(500).json(ErrorResponse(500, 'Request failed during powerstate fetch.')).end()
  }
}
