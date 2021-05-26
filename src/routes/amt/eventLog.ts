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
      req.mpsService.mqtt.message({type: 'request', method: 'AMT_EventLog', guid, message: "Event Log Requested"})

      amtstack.GetMessageLog(function (stack, responses, tag, status) {
        if (req.mpsService.config.startup_mode === MPSMode.Standalone) {
          stack.wsman.comm.socket.sendchannelclose()
        }
        if (status === 200) {
          req.mpsService.mqtt.message({type:'success', method: 'AMT_EventLog', guid, message: "Sent Event Log"})
          res.status(200).json(responses).end()
        } else {
          log.error(`Failed during GET MessageLog guid : ${guid}.`)
          req.mpsService.mqtt.message({type: 'fail', method: 'AMT_EventLog', guid, message: "Failed to Get Event Log"})
          res.status(status).json(ErrorResponse(status, `Failed during GET MessageLog guid : ${guid}.`)).end()
        }
      })
    } else {
      req.mpsService.mqtt.message({type: 'fail', method: 'AMT_EventLog', guid, message: "Device Not Found"})
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in AMT EventLog: ${error}`)
    req.mpsService.mqtt.message({type: 'fail', method: 'AMT_EventLog', guid: null, message: "Internal Server Error"})
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT EventLog.')).end()
  }
}
