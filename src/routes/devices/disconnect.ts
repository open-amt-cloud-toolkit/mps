/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { validationResult } from 'express-validator'
import { ErrorResponse } from '../../utils/amtHelper'
import { logger as log } from '../../utils/logger'
import { Request, Response } from 'express'

export async function disconnect (req: Request, res: Response): Promise<void> {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }
    const guid = req.params.guid
    // check if guid is connected
    const ciraconn = req.mpsService.mpsserver.ciraConnections[guid]
    if (ciraconn) {
      try {
        ciraconn.destroy()
        res.json({ success: 200, description: `CIRA connection disconnected : ${guid}` })
      } catch (error) {
        log.error(`cira connection destroy exception: ${error}`)
        res.status(500).json(ErrorResponse(500, error))
      }
    } else {
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device'))
    }
  } catch (error) {
    log.error(`Exception in Disconnect: ${JSON.stringify(error)} `)
    res.status(500).json(ErrorResponse(500, 'Request failed while disconnecting device.'))
  }
}
