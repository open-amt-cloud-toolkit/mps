/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../../utils/logger'
import { ErrorResponse } from '../../../utils/amtHelper'
import { MqttProvider } from '../../../utils/MqttProvider'
import { devices } from '../../../server/mpsserver'
import { AMTStatusCodes } from '../../../utils/constants'
export async function request (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid
    // Request an opt-in code. Intel(R) AMT generates code internally.
    const response = await devices[guid].requestUserConsentCode()
    if (response != null) {
      const result = {
        Header: response.Header,
        Body: response.Body.StartOptIn_OUTPUT
      }
      result.Body.ReturnValueStr = AMTStatusCodes[result.Body.ReturnValue]
      if (result.Body.ReturnValue.toString() === '0') {
        MqttProvider.publishEvent('success', ['Request_User_Consent_Code'], 'Requested user consent code', guid)
        res.status(200).json(result)
      } else {
        log.error(`Failed to request user consent code for guid : ${guid}.`)
        MqttProvider.publishEvent('fail', ['Request_User_Consent_Code'], 'Fail to request user consent code', guid)
        res.status(400).json(result)
      }
    } else {
      log.error(`Failed to request user consent code for guid : ${guid}.`)
      MqttProvider.publishEvent('fail', ['Request_User_Consent_Code'], 'Fail to request user consent code', guid)
      res.status(400).json(ErrorResponse(400, `Failed to request user consent code for guid : ${guid}.`))
    }
  } catch (error) {
    log.error(`Exception in requesting user consent code : ${error}`)
    MqttProvider.publishEvent('fail', ['Request_User_Consent_Code'], 'Internal Service Error')
    res.status(500).json(ErrorResponse(500, 'Failed to request user consent code.'))
  }
}
