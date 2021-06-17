/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device audit logs
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'
import { validationResult } from 'express-validator'

export async function auditLog (req: Request<any, any, any, {startIndex?: number}>, res: Response): Promise<void> {
  try {
    const queryParams = req.query
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
      const startIndex: number = queryParams.startIndex == null ? 0 : queryParams.startIndex >= 1 ? queryParams.startIndex : 0

      await req.mpsService.mqtt.publishEvent('request', ['AMT_AuditLog'], 'Audit Log Requested', guid)

      amtstack.GetAuditLogChunks(startIndex, async (stack, responses, status) => {
        stack.wsman.comm.socket.sendchannelclose()
        if (status === 200) {
          await req.mpsService.mqtt.publishEvent('success', ['AMT_AuditLog'], 'Sent Audit Log', guid)
          res.status(200).json(responses).end()
        } else {
          log.error(`Power Action failed during GETAudit log for guid : ${guid}.`)
          await req.mpsService.mqtt.publishEvent('fail', ['AMT_AuditLog'], 'Audit Log Not Found', guid)
          res.status(404).json(ErrorResponse(status, `Power Action failed during GETAudit log for guid : ${guid}.`)).end()
        }
      })
    } else {
      await req.mpsService.mqtt.publishEvent('fail', ['AMT_AuditLog'], 'Device Not Found', guid)
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in AMT AuditLog : ${error}`)
    await req.mpsService.mqtt.publishEvent('fail', ['AMT_AuditLog'], 'Internal Service Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT AuditLog.')).end()
  }
}
