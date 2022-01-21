/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { Response, Request } from 'express'
import { logger as log } from '../../../utils/logger'
import { ErrorResponse } from '../../../utils/amtHelper'
import { MqttProvider } from '../../../utils/MqttProvider'
import { AMTStatusCodes } from '../../../utils/constants'
export async function cancel (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid
    // Cancel a previous opt-in code request.
    const response = await req.deviceAction.cancelUserConsentCode()
    if (response != null) {
      const result = {
        Header: response.Header,
        Body: response.Body.CancelOptIn_OUTPUT
      }
      result.Body.ReturnValueStr = AMTStatusCodes[result.Body.ReturnValue]
      if (result.Body?.ReturnValue.toString() === '0') {
        MqttProvider.publishEvent('success', ['Cancel_User_Consent_Code'], 'cancelled user consent code', guid)
        res.status(200).json(result)
      } else if (result.Body?.ReturnValue.toString() !== '0') {
        log.error(`Fail to cancel user consent code for guid : ${guid}.`)
        MqttProvider.publishEvent('fail', ['Cancel_User_Consent_Code'], 'Fail to cancel user consent code', guid)
        res.status(400).json(result)
      }
    } else {
      log.error(`Fail to cancel user consent code for guid : ${guid}.`)
      MqttProvider.publishEvent('fail', ['Cancel_User_Consent_Code'], 'Fail to cancel user consent code', guid)
      res.status(400).json(ErrorResponse(400, `Failed to cancel user consent code for guid : ${guid}.`))
    }
  } catch (error) {
    log.error(`Exception in cancel user consent code : ${error}`)
    MqttProvider.publishEvent('fail', ['Cancel_User_Consent_Code'], 'Internal Service Error')
    res.status(500).json(ErrorResponse(500, 'Failed to cancel user consent code.'))
  }
}
