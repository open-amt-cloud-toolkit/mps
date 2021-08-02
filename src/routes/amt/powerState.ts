/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device current power state
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/mqttProvider'

export async function powerState (req: Request, res: Response): Promise<void> {
  try {
    const guid = req.params.guid
    const ciraconn = req.mpsService.mpsserver.ciraConnections[guid]
    if (ciraconn && ciraconn.readyState === 'open') {
      const cred = await req.mpsService.secrets.getAMTCredentials(guid)
      const amtstack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
      MqttProvider.publishEvent('request', ['AMT_PowerState'], 'Power State Requested', guid)

      amtstack.Enum('CIM_ServiceAvailableToElement', async (stack, name, responses, status) => {
        stack.wsman.comm.socket.sendchannelclose()
        if (status !== 200) {
          MqttProvider.publishEvent('fail', ['AMT_PowerState'], 'Failed to Get Power State', guid)
          log.error(`Request failed during powerstate fetch for guid : ${guid}.`)
          return res.status(status).json(ErrorResponse(status, `Request failed during powerstate fetch for guid : ${guid}.`)).end()
        } else {
          MqttProvider.publishEvent('success', ['AMT_PowerState'], 'Sent Power State', guid)
          res.status(200).json({ powerstate: responses[0].PowerState }).end()
        }
      })
    } else {
      MqttProvider.publishEvent('fail', ['AMT_PowerState'], 'Device Not Found', guid)
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in Power state : ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_PowerState'], 'Internal Server Error')
    return res.status(500).json(ErrorResponse(500, 'Request failed during powerstate fetch.')).end()
  }
}
