/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device general settings
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'

export async function generalSettings (req: Request, res: Response): Promise<void> {
  try {
    const guid = req.params.guid
    const ciraconn = req.mpsService.mpsserver.ciraConnections[guid]
    if (ciraconn) {
      const cred = await req.mpsService.db.getAmtPassword(guid)
      const amtstack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
      await req.mpsService.mqtt.publishEvent('request', ['AMT_GeneralSettings'], 'General Settings Requested', guid)

      await amtstack.Get('AMT_GeneralSettings', async (obj, name, response, status) => {
        obj.wsman.comm.socket.sendchannelclose()
        if (status === 200) {
          await req.mpsService.mqtt.publishEvent('success', ['AMT_GeneralSettings'], 'Sent General Settings', guid)
          res.status(200).json(response).end()
        } else {
          log.error(`Request failed during GET AMT_GeneralSettings for guid : ${guid}.`)
          await req.mpsService.mqtt.publishEvent('fail', ['AMT_GeneralSettings'], 'Failed to Get General Settings', guid)
          res.status(status).json(ErrorResponse(status, `Request failed during GET AMT_GeneralSettings for guid : ${guid}.`)).end()
        }
      }, 0, 1)
    } else {
      await req.mpsService.mqtt.publishEvent('fail', ['AMT_GeneralSettings'], 'Device Not Found', guid)
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in AMT GeneralSettings: ${error}`)
    await req.mpsService.mqtt.publishEvent('fail', ['AMT_GeneralSettings'], 'Internal Server Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT GeneralSettings.')).end()
  }
}
