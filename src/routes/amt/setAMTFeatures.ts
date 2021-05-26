/*********************************************************************
 * Copyright (c) Intel Corporation 2020
 * SPDX-License-Identifier: Apache-2.0
 * Description: Handler to set AMT Features
 * Author: Madhavi Losetty
 **********************************************************************/
import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort, MPSMode } from '../../utils/constants'
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
      req.mpsService.mqtt.message({type: 'fail', method: 'AMT_SetFeatures', guid, message: "Bad Request for Set AMT Features"})
      res.status(400).json({ errors: errors.array() }).end()
      return
    }
    const ciraconn = await req.mpsService.ciraConnectionFactory.getConnection(guid)
    if (ciraconn && ciraconn.readyState === 'open') {
      const cred = await req.mpsService.db.getAmtPassword(guid)
      const amtstack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
      req.mpsService.mqtt.message({success: true, method: 'AMT_SetFeatures', guid, message: "Set AMT Features Requested"})
      await AMTFeatures.setAMTFeatures(amtstack, payload)
      if (req.mpsService.config.startup_mode === MPSMode.Standalone) {
        amtstack.wsman.comm.socket.sendchannelclose()
      }
      req.mpsService.mqtt.message({success: true, method: 'AMT_SetFeatures', guid, message: "Set AMT Features"})
      res.status(200).json({ status: 'Updated AMT Features' }).end()
    } else {
      req.mpsService.mqtt.message({type: 'fail', method: 'AMT_SetFeatures', guid, message: "Device Not Found"})
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in set AMT Features: ${error}`)
    if (error instanceof MPSValidationError) {
      req.mpsService.mqtt.message({type: 'fail', method: 'AMT_SetFeatures', guid: null, message: "Bad Request for Set AMT Features"})
      res.status(error.status || 400).json(ErrorResponse(error.status || 400, error.message)).end()
    } else {
      req.mpsService.mqtt.message({type: 'fail', method: 'AMT_SetFeatures', guid: null, message: "Internal Server Error"})
      res.status(500).json(ErrorResponse(500, 'Request failed during set AMT Features.')).end()
    }
  }
}
