/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device general settings
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort, MPSMode } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'

export async function generalSettings (req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body.payload
    if (payload.guid) {
      const ciraconn = await req.mpsService.ciraConnectionFactory.getConnection(payload.guid)
      if (ciraconn) {
        const cred = await req.mpsService.db.getAmtPassword(payload.guid)
        const amtstack = req.amtFactory.getAmtStack(payload.guid, amtPort, cred[0], cred[1], 0)
        await amtstack.Get('AMT_GeneralSettings', (obj, name, response, status) => {
          if (req.mpsService.config.startup_mode === MPSMode.Standalone) {
            obj.wsman.comm.socket.sendchannelclose()
          }
          if (status === 200) {
            res.set({ 'Content-Type': 'application/json' })
            res.send(response)
          } else {
            res.set({ 'Content-Type': 'application/json' })
            log.error(`Request failed during GET AMT_GeneralSettings for guid : ${payload.guid}.`)
            res.status(status).send(ErrorResponse(status, `Request failed during GET AMT_GeneralSettings for guid : ${payload.guid}.`))
          }
        }, 0, 1)
      } else {
        res.set({ 'Content-Type': 'application/json' })
        res.status(404).send(ErrorResponse(404, `guid : ${payload.guid}`, 'device'))
      }
    } else {
      res.set({ 'Content-Type': 'application/json' })
      res.status(404).send(ErrorResponse(404, null, 'guid'))
    }
  } catch (error) {
    log.error(`Exception in AMT GeneralSettings: ${error}`)
    res.status(500).send(ErrorResponse(500, 'Request failed during AMT GeneralSettings.'))
  }
}
