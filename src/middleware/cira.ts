/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Request, Response } from 'express'
import { CIRAHandler } from '../amt/CIRAHandler'
import { DeviceAction } from '../amt/DeviceAction'
import { devices } from '../server/mpsserver'
// import { HttpHandler } from '../amt/HttpHandler'
import { ErrorResponse } from '../utils/amtHelper'
// import { amtPort } from '../utils/constants'
import { MqttProvider } from '../utils/MqttProvider'

const ciraMiddleware = async (req: Request, res: Response, next): Promise<void> => {
  const guid = req.params.guid
  const device = devices[guid]

  if ((device as any)?.ciraSocket.readyState === 'open') {
    // const cred = await req.mpsService.secrets.getAMTCredentials(guid);
    // req.amtStack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
    // (req as any).httpHandler = new HttpHandler(cred[0], cred[1])

    const ciraHandler = new CIRAHandler(device.httpHandler, device.username, device.password, device.limiter)
    req.deviceAction = new DeviceAction(ciraHandler, device.ciraSocket)
    next()
  } else {
    MqttProvider.publishEvent('fail', ['CIRA_Connection'], 'Device Not Found', guid)
    res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
  }
}

export default ciraMiddleware
