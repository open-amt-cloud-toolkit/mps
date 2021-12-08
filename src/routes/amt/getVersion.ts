/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device version
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'
import { devices } from '../../server/mpsserver'

export async function version (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid
    MqttProvider.publishEvent('request', ['AMT_Version'], 'Power State Requested', guid)
    const response = await devices[guid].getVersion()
    if (response != null) {
      res.status(200).json(response).end()
    } else {
      log.error(`Request failed during AMTVersion BatchEnum Exec for guid : ${guid}.`)
      res.status(400).json(ErrorResponse(400, `Request failed during AMTVersion BatchEnum Exec for guid : ${guid}.`)).end()
    }
  } catch (error) {
    log.error(`Exception in AMT Version : ${error}`)
    res.status(500).json(ErrorResponse(500, 'Request failed during AMTVersion BatchEnum Exec.')).end()
  }
}
