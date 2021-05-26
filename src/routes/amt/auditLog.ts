/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device audit logs
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort, MPSMode } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'
import { validationResult } from 'express-validator'

export async function auditLog (req: Request, res: Response): Promise<void> {
  try {
    const queryParams = req.query
    const guid = req.params.guid
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.mpsService.mqtt.message({type: 'fail', method: "AMT_AuditLog", guid, message: "Bad Request for Audit Log"})
      res.status(400).json({ errors: errors.array() }).end()
      return
    }

    const ciraconn = await req.mpsService.ciraConnectionFactory.getConnection(guid)
    if (ciraconn && ciraconn.readyState === 'open') {
      const cred = await req.mpsService.db.getAmtPassword(guid)
      const amtstack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
      const startIndex: number = queryParams.startIndex == null ? 0 : queryParams.startIndex >= 1 ? queryParams.startIndex : 0

      req.mpsService.mqtt.message({type: 'request', method: 'AMT_AuditLog', guid, message: "Audit Log Requested"})

      amtstack.GetAuditLogChunks(startIndex, (stack, responses, status) => {
        if (req.mpsService.config.startup_mode === MPSMode.Standalone) {
          stack.wsman.comm.socket.sendchannelclose()
        }

        if (status === 200) {
          req.mpsService.mqtt.message({type: 'success', method: 'AMT_AuditLog', guid, message: "Sent Audit Log"})
          res.status(200).json(responses).end()
        } else {
          log.error(`Power Action failed during GETAudit log for guid : ${guid}.`)
          req.mpsService.mqtt.message({type: 'fail', method: 'AMT_AuditLog', guid, message: "Audit Log Not Found"})
          res.status(404).json(ErrorResponse(status, `Power Action failed during GETAudit log for guid : ${guid}.`)).end()
        }
      })
    } else {
      req.mpsService.mqtt.message({type: 'fail', method: 'AMT_AuditLog', guid, message: "Device Not Found"})
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in AMT AuditLog : ${error}`)
    req.mpsService.mqtt.message({type: 'fail', method: 'AMT_AuditLog', guid: null, message: "Internal Service Error"})
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT AuditLog.')).end()
  }
}
