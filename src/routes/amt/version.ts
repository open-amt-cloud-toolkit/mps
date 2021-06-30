/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device version
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'

export async function version (req: Request, res: Response): Promise<void> {
  try {
    const guid = req.params.guid
    const ciraconn = req.mpsService.mpsserver.ciraConnections[guid]
    if (ciraconn && ciraconn.readyState === 'open') {
      const cred = await req.mpsService.secrets.getAMTCredentials(guid)
      const amtstack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
      amtstack.BatchEnum('', ['CIM_SoftwareIdentity', '*AMT_SetupAndConfigurationService'],
        (stack, name, responses, status) => {
          stack.wsman.comm.socket.sendchannelclose()
          if (status === 200) {
            res.status(200).json(responses).end()
          } else {
            log.error(`Request failed during AMTVersion BatchEnum Exec for guid : ${guid}.`)
            res.status(status).json(ErrorResponse(status, `Request failed during AMTVersion BatchEnum Exec for guid : ${guid}.`)).end()
          }
        })
    } else {
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in AMT Version : ${error}`)
    res.status(500).json(ErrorResponse(500, 'Request failed during AMTVersion BatchEnum Exec.')).end()
  }
}
