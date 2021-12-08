/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../../utils/logger'
import { ErrorResponse } from '../../../utils/amtHelper'
import { MqttProvider } from '../../../utils/MqttProvider'
import { devices } from '../../../server/mpsserver'
export async function request (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid
    // Request an opt-in code. Intel(R) AMT generates code internally.
    const response = await devices[guid].requestUserConsetCode()
    if (response != null) {
      MqttProvider.publishEvent('success', ['Request_User_Consent_Code'], 'Requested user consent code', guid)
      const result = {
        Header: response.Envelope.Header,
        Body: response.Envelope.Body.StartOptIn_OUTPUT
      }
      res.status(200).json(result).end()
    } else {
      log.error(`Failed to request user consent code for guid : ${guid}.`)
      MqttProvider.publishEvent('fail', ['Request_User_Consent_Code'], 'Fail to request user consent code', guid)
      res.status(400).json(ErrorResponse(400, `Failed to request user consent code for guid : ${guid}.`)).end()
    }
  } catch (error) {
    log.error(`Exception in requesting user consent code : ${error}`)
    MqttProvider.publishEvent('fail', ['Request_User_Consent_Code'], 'Internal Service Error')
    res.status(500).json(ErrorResponse(500, 'Failed to request user consent code.')).end()
  }
}
