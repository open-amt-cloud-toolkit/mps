/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { Response, Request } from 'express'
import { logger as log } from '../../../utils/logger'
import { ErrorResponse } from '../../../utils/amtHelper'
import { MqttProvider } from '../../../utils/MqttProvider'
import { AMTStatusCodes } from '../../../utils/constants'
export async function send (req: Request, res: Response): Promise<void> {
  const userConsentCode = req.body.consentCode
  const guid: string = req.params.guid
  try {
    // Cancel a previous opt-in code request.
    const response = await req.deviceAction.sendUserConsentCode(userConsentCode)
    if (response != null) {
      const result = {
        Header: response.Header,
        Body: response.Body.SendOptInCode_OUTPUT
      }
      result.Body.ReturnValueStr = AMTStatusCodes[result.Body.ReturnValue]
      if (result.Body?.ReturnValue.toString() === '0') {
        MqttProvider.publishEvent('success', ['Send_User_Consent_Code'], 'Sent user consent code', guid)
        result.Body.ReturnValueStr = AMTStatusCodes[result.Body.ReturnValue]
        res.status(200).json(result)
      } else {
        log.error(`Fail to send user consent code for guid : ${guid}.`)
        MqttProvider.publishEvent('fail', ['Send_User_Consent_Code'], 'Fail to send user consent code', guid)
        res.status(400).json(result)
      }
    } else {
      log.error(`Fail to send user consent code for guid : ${guid}.`)
      MqttProvider.publishEvent('fail', ['Send_User_Consent_Code'], 'Fail to send user consent code', guid)
      res.status(400).json(ErrorResponse(400, `Failed to send user consent code for guid : ${guid}.`))
    }
  } catch (error) {
    log.error(`Failed to send user consent code for guid ${guid}: ${error}`)
    MqttProvider.publishEvent('fail', ['Send_User_Consent_Code'], 'Internal Service Error')
    res.status(500).json(ErrorResponse(500, 'Failed to send user consent code.'))
  }
}
