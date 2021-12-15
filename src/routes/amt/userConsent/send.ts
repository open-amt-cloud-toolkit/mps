/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { Response, Request } from 'express'
import { logger as log } from '../../../utils/logger'
import { ErrorResponse } from '../../../utils/amtHelper'
import { MqttProvider } from '../../../utils/MqttProvider'
import { devices } from '../../../server/mpsserver'
export async function send (req: Request, res: Response): Promise<void> {
  const userConsentCode = req.body.consentCode
  const guid: string = req.params.guid
  try {
    // Cancel a previous opt-in code request.
    const response = await devices[guid].sendUserConsetCode(userConsentCode)
    if (response != null) {
      MqttProvider.publishEvent('success', ['Send_User_Consent_Code'], 'Sent user consent code', guid)
      const result = {
        Header: response.Envelope.Header,
        Body: response.Envelope.Body.SendOptInCode_OUTPUT
      }
      res.status(200).json(result).end()
    } else {
      log.error(`Fail to send user consent code for guid : ${guid}.`)
      MqttProvider.publishEvent('fail', ['Send_User_Consent_Code'], 'Fail to send user consent code', guid)
      res.status(400).json(ErrorResponse(400, `Failed to send user consent code for guid : ${guid}.`)).end()
    }
  } catch (error) {
    log.error(`Failed to send user consent code for guid ${guid}: ${error}`)
    MqttProvider.publishEvent('fail', ['Send_User_Consent_Code'], 'Internal Service Error')
    res.status(500).json(ErrorResponse(500, 'Failed to send user consent code.')).end()
  }
}
