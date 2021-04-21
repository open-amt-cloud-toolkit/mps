/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device event logs
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort, MPSMode } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'

export async function eventLog (req: Request, res: Response): Promise<void> {
  try {
    const guid = req.params.guid
    const ciraconn = await req.mpsService.ciraConnectionFactory.getConnection(guid)
    if (ciraconn && ciraconn.readyState === 'open') {
      const cred = await req.mpsService.db.getAmtPassword(guid)
      const amtstack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
      amtstack.GetMessageLog(function (stack, responses, tag, status) {
        if (req.mpsService.config.startup_mode === MPSMode.Standalone) {
          stack.wsman.comm.socket.sendchannelclose()
        }
        if (status === 200) {
          res.status(200).json(responses).end()
        } else {
          log.error(`Failed during GET MessageLog guid : ${guid}.`)
          res.status(status).json(ErrorResponse(status, `Failed during GET MessageLog guid : ${guid}.`)).end()
        }
      })
    } else {
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in AMT EventLog: ${error}`)
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT EventLog.')).end()
  }
}
