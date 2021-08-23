/*********************************************************************
 * Copyright (c) Intel Corporation 2020
 * SPDX-License-Identifier: Apache-2.0
 * Description: Handler to set AMT Features
 * Author: Madhavi Losetty
 **********************************************************************/
import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { AMTFeatures } from '../../utils/AMTFeatures'
import { MPSValidationError } from '../../utils/MPSValidationError'
import { MqttProvider } from '../../utils/mqttProvider'

export async function setAMTFeatures (req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body
    const guid = req.params.guid

    MqttProvider.publishEvent('request', ['AMT_SetFeatures'], 'Set AMT Features Requested', guid)

    await AMTFeatures.setAMTFeatures(req.amtStack, payload)
    req.amtStack.wsman.comm.socket.sendchannelclose()

    MqttProvider.publishEvent('success', ['AMT_SetFeatures'], 'Set AMT Features', guid)
    res.status(200).json({ status: 'Updated AMT Features' }).end()
  } catch (error) {
    log.error(`Exception in set AMT Features: ${error}`)
    if (error instanceof MPSValidationError) {
      res.status(error.status || 400).json(ErrorResponse(error.status || 400, error.message)).end()
    } else {
      MqttProvider.publishEvent('fail', ['AMT_SetFeatures'], 'Internal Server Error')
      res.status(500).json(ErrorResponse(500, 'Request failed during set AMT Features.')).end()
    }
  }
}
