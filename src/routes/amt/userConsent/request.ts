/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../../utils/logger'
import { ErrorResponse } from '../../../utils/amtHelper'
import { MqttProvider } from '../../../utils/mqttProvider'
export async function request (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid
    // Request an opt-in code. Intel(R) AMT generates code internally.
    req.amtStack.IPS_OptInService_StartOptIn((stack, name, response, status) => {
      log.info(`status : ${status}, response : ${JSON.stringify(response)}`)
      if (status === 200) {
        MqttProvider.publishEvent('success', ['Request_User_Consent_Code'], 'Requested user consent code', guid)
        res.status(200).json(response).end()
      } else {
        log.error(`Failed to request user consent code for guid : ${guid}.`)
        MqttProvider.publishEvent('fail', ['Request_User_Consent_Code'], 'Fail to request user consent code', guid)
        res.status(404).json(ErrorResponse(status, `Failed to request user consent code for guid : ${guid}.`)).end()
      }
    }, 0, 1)
  } catch (error) {
    log.error(`Exception in requesting user consent code : ${error}`)
    MqttProvider.publishEvent('fail', ['Request_User_Consent_Code'], 'Internal Service Error')
    res.status(500).json(ErrorResponse(500, 'Failed to request user consent code.')).end()
  }
}
