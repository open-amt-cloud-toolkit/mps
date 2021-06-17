/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device event logs
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'

export async function eventLog (req: Request, res: Response): Promise<void> {
  try {
    const guid = req.params.guid
    const ciraconn = req.mpsService.mpsserver.ciraConnections[guid]
    if (ciraconn && ciraconn.readyState === 'open') {
      const cred = await req.mpsService.db.getAmtPassword(guid)
      const amtstack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
      await req.mpsService.mqtt.publishEvent('request', ['AMT_EventLog'], 'Event Log Requested', guid)

      amtstack.GetMessageLog(async function (stack, responses, tag, status) {
        stack.wsman.comm.socket.sendchannelclose()
        if (status === 200) {
          await req.mpsService.mqtt.publishEvent('success', ['AMT_EventLog'], 'Sent Event Log', guid)
          res.status(200).json(responses).end()
        } else {
          log.error(`Failed during GET MessageLog guid : ${guid}.`)
          await req.mpsService.mqtt.publishEvent('fail', ['AMT_EventLog'], 'Failed to Get Event Log', guid)
          res.status(status).json(ErrorResponse(status, `Failed during GET MessageLog guid : ${guid}.`)).end()
        }
      })
    } else {
      await req.mpsService.mqtt.publishEvent('fail', ['AMT_EventLog'], 'Device Not Found', guid)
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in AMT EventLog: ${error}`)
    await req.mpsService.mqtt.publishEvent('fail', ['AMT_EventLog'], 'Internal Server Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT EventLog.')).end()
  }
}
