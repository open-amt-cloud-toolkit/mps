/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { Response, Request } from 'express'
import { logger as log } from '../../../utils/logger'
import { ErrorResponse } from '../../../utils/amtHelper'
import { MqttProvider } from '../../../utils/mqttProvider'
export async function cancel (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid
    // Cancel a previous opt-in code request.
    req.amtStack.IPS_OptInService_CancelOptIn((stack, name, response, status) => {
      if (status === 200) {
        MqttProvider.publishEvent('success', ['Cancel_User_Consent_Code'], 'cancelled user consent code', guid)
        res.status(200).json(response).end()
      } else {
        log.error(`Fail to cancel user consent code for guid : ${guid}.`)
        MqttProvider.publishEvent('fail', ['Cancel_User_Consent_Code'], 'Fail to cancel user consent code', guid)
        res.status(404).json(ErrorResponse(status, `Failed to cancel user consent code for guid : ${guid}.`)).end()
      }
    })
  } catch (error) {
    log.error(`Exception in cancel user consent code : ${error}`)
    MqttProvider.publishEvent('fail', ['Cancel_User_Consent_Code'], 'Internal Service Error')
    res.status(500).json(ErrorResponse(500, 'Failed to cancel user consent code.')).end()
  }
}
