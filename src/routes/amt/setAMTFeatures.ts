/*********************************************************************
 * Copyright (c) Intel Corporation 2020
 * SPDX-License-Identifier: Apache-2.0
 * Description: Handler to set AMT Features
 * Author: Madhavi Losetty
 **********************************************************************/
import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'
import { AMTFeatures } from '../../utils/AMTFeatures'
import { MPSValidationError } from '../../utils/MPSValidationError'
import { validationResult } from 'express-validator'

export async function setAMTFeatures (req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body
    const guid = req.params.guid
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() }).end()
      return
    }
    const ciraconn = req.mpsService.mpsserver.ciraConnections[guid]
    if (ciraconn && ciraconn.readyState === 'open') {
      const cred = await req.mpsService.db.getAmtPassword(guid)
      const amtstack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
      await req.mpsService.mqtt.publishEvent('request', ['AMT_SetFeatures'], 'Set AMT Features Requested', guid)

      await AMTFeatures.setAMTFeatures(amtstack, payload)
      amtstack.wsman.comm.socket.sendchannelclose()

      await req.mpsService.mqtt.publishEvent('success', ['AMT_SetFeatures'], 'Set AMT Features', guid)
      res.status(200).json({ status: 'Updated AMT Features' }).end()
    } else {
      await req.mpsService.mqtt.publishEvent('fail', ['AMT_SetFeatures'], 'Device Not Found', guid)
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in set AMT Features: ${error}`)
    if (error instanceof MPSValidationError) {
      res.status(error.status || 400).json(ErrorResponse(error.status || 400, error.message)).end()
    } else {
      await req.mpsService.mqtt.publishEvent('fail', ['AMT_SetFeatures'], 'Internal Server Error')
      res.status(500).json(ErrorResponse(500, 'Request failed during set AMT Features.')).end()
    }
  }
}
