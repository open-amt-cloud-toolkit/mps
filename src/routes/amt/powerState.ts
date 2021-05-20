/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device current power state
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort, MPSMode } from '../../utils/constants'
import { ErrorResponse } from '../../utils/ErrorResponse'

export async function powerState (req: Request, res: Response): Promise<void> {
  try {
    const guid = req.params.guid
    const ciraconn = await req.mpsService.ciraConnectionFactory.getConnection(guid)
    if (ciraconn && ciraconn.readyState === 'open') {
      const cred = await req.mpsService.db.getAmtPassword(guid)
      const amtstack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
      amtstack.Enum('CIM_ServiceAvailableToElement', (stack, name, responses, status) => {
        if (req.mpsService.config.startup_mode === MPSMode.Standalone) {
          stack.wsman.comm.socket.sendchannelclose()
        }
        if (status !== 200) {
          log.error(`Request failed during powerstate fetch for guid : ${guid}.`)
          return res.status(status).json(ErrorResponse(status, `Request failed during powerstate fetch for guid : ${guid}.`)).end()
        } else {
          res.status(200).json({ powerstate: responses[0].PowerState }).end()
        }
      })
    } else {
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in Power state : ${error}`)
    return res.status(500).json(ErrorResponse(500, 'Request failed during powerstate fetch.')).end()
  }
}
