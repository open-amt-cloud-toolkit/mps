/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device event logs
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/mqttProvider'

export async function eventLog (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid

    MqttProvider.publishEvent('request', ['AMT_EventLog'], 'Event Log Requested', guid)

    req.amtStack.GetMessageLog(async function (stack, responses, tag, status) {
      stack.wsman.comm.socket.sendchannelclose()
      if (status === 200) {
        MqttProvider.publishEvent('success', ['AMT_EventLog'], 'Sent Event Log', guid)
        if (responses == null) responses = []
        res.status(200).json(responses).end()
      } else {
        log.error(`Failed during GET MessageLog guid : ${guid}.`)
        MqttProvider.publishEvent('fail', ['AMT_EventLog'], 'Failed to Get Event Log', guid)
        res.status(status).json(ErrorResponse(status, `Failed during GET MessageLog guid : ${guid}.`)).end()
      }
    })
  } catch (error) {
    log.error(`Exception in AMT EventLog: ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_EventLog'], 'Internal Server Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT EventLog.')).end()
  }
}
