/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Request, Response } from 'express'
import { devices } from '../server/mpsserver'
// import { HttpHandler } from '../amt/HttpHandler'
import { ErrorResponse } from '../utils/amtHelper'
// import { amtPort } from '../utils/constants'
import { MqttProvider } from '../utils/MqttProvider'

const ciraMiddleware = async (req: Request, res: Response, next): Promise<void> => {
  const guid = req.params.guid
  const ciraconn = devices[guid]

  if ((ciraconn as any)?.ciraSocket.readyState === 'open') {
    // const cred = await req.mpsService.secrets.getAMTCredentials(guid);
    // req.amtStack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
    // (req as any).httpHandler = new HttpHandler(cred[0], cred[1])
    next()
  } else {
    MqttProvider.publishEvent('fail', ['CIRA_Connection'], 'Device Not Found', guid)
    res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
  }
}
export default ciraMiddleware
