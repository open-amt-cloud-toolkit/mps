/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device audit logs
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'

export async function auditLog (req: Request<any, any, any, { startIndex?: number }>, res: Response): Promise<void> {
  try {
    const queryParams = req.query
    const guid: string = req.params.guid

    const startIndex: number = queryParams.startIndex == null ? 0 : queryParams.startIndex >= 1 ? queryParams.startIndex : 0
    MqttProvider.publishEvent('request', ['AMT_AuditLog'], 'Audit Log Requested', guid)
    req.amtStack.GetAuditLogChunks(startIndex, async (stack, responses, status) => {
      stack.wsman.comm.socket.sendchannelclose()
      if (status === 200) {
        MqttProvider.publishEvent('success', ['AMT_AuditLog'], 'Sent Audit Log', guid)
        res.status(200).json(responses).end()
      } else {
        log.error(`Power Action failed during GETAudit log for guid : ${guid}.`)
        MqttProvider.publishEvent('fail', ['AMT_AuditLog'], 'Audit Log Not Found', guid)
        res.status(404).json(ErrorResponse(status, `Power Action failed during GETAudit log for guid : ${guid}.`)).end()
      }
    })
  } catch (error) {
    log.error(`Exception in AMT AuditLog : ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_AuditLog'], 'Internal Service Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT AuditLog.')).end()
  }
}
