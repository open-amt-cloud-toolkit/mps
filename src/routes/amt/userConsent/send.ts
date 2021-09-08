/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { Response, Request } from 'express'
import { logger as log } from '../../../utils/logger'
import { ErrorResponse } from '../../../utils/amtHelper'
import { MqttProvider } from '../../../utils/mqttProvider'
export async function send (req: Request, res: Response): Promise<void> {
  const userConsentCode = req.body.consentCode
  const guid: string = req.params.guid
  try {
    // Cancel a previous opt-in code request.
    req.amtStack.IPS_OptInService_SendOptInCode(userConsentCode, (stack, name, response, status) => {
      if (status === 200) {
        MqttProvider.publishEvent('success', ['Send_User_Consent_Code'], 'Sent user consent code', guid)
        res.status(200).json(response).end()
      } else {
        log.error(`Fail to send user consent code for guid : ${guid}.`)
        MqttProvider.publishEvent('fail', ['Send_User_Consent_Code'], 'Fail to send user consent code', guid)
        res.status(404).json(ErrorResponse(status, `Failed to send user consent code for guid : ${guid}.`)).end()
      }
    }, 0, 1)
  } catch (error) {
    log.error(`Failed to send user consent code for guid ${guid}: ${error}`)
    MqttProvider.publishEvent('fail', ['Send_User_Consent_Code'], 'Internal Service Error')
    res.status(500).json(ErrorResponse(500, 'Failed to send user consent code.')).end()
  }
}
