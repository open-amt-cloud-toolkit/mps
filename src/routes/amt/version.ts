/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device version
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'

export async function version (req: Request, res: Response): Promise<void> {
  try {
    const guid = req.params.guid
    req.amtStack.BatchEnum('', ['CIM_SoftwareIdentity', '*AMT_SetupAndConfigurationService'],
      (stack, name, responses, status) => {
        stack.wsman.comm.socket.sendchannelclose()
        if (status === 200) {
          res.status(200).json(responses).end()
        } else {
          log.error(`Request failed during AMTVersion BatchEnum Exec for guid : ${guid}.`)
          res.status(status).json(ErrorResponse(status, `Request failed during AMTVersion BatchEnum Exec for guid : ${guid}.`)).end()
        }
      })
  } catch (error) {
    log.error(`Exception in AMT Version : ${error}`)
    res.status(500).json(ErrorResponse(500, 'Request failed during AMTVersion BatchEnum Exec.')).end()
  }
}
