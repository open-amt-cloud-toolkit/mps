/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device audit logs
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort, MPSMode } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'

export async function auditLog (req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body.payload
    if (payload.guid) {
      const ciraconn = await req.mpsService.ciraConnectionFactory.getConnection(payload.guid)
      if (ciraconn && ciraconn.readyState === 'open') {
        const cred = await req.mpsService.db.getAmtPassword(payload.guid)
        const amtstack = req.amtFactory.getAmtStack(payload.guid, amtPort, cred[0], cred[1], 0)
        const startIndex: number = payload.startIndex >= 1 ? payload.startIndex : 0

        amtstack.GetAuditLogChunks(startIndex, (stack, responses, status) => {
          if (req.mpsService.config.startup_mode === MPSMode.Standalone) {
            stack.wsman.comm.socket.sendchannelclose()
          }

          if (status === 200) {
            res.send(responses)
          } else {
            log.error(`Power Action failed during GETAudit log for guid : ${payload.guid}.`)
            res.status(status).send(ErrorResponse(status, `Power Action failed during GETAudit log for guid : ${payload.guid}.`))
          }
        })
      } else {
        res.set({ 'Content-Type': 'application/json' })
        res.status(404).send(ErrorResponse(404, `guid : ${payload.guid}`, 'device'))
      }
    } else {
      res.set({ 'Content-Type': 'application/json' })
      res.status(404).send(ErrorResponse(404, null, 'guid'))
    }
  } catch (error) {
    log.error(`Exception in AMT AuditLog : ${error}`)
    res.status(500).send(ErrorResponse(500, 'Request failed during AMT AuditLog.'))
  }
}
