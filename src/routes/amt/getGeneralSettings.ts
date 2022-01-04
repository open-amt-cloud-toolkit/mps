/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device general settings
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'
import { devices } from '../../server/mpsserver'

export async function generalSettings (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid
    MqttProvider.publishEvent('request', ['AMT_GeneralSettings'], 'General Settings Requested', guid)
    const response = await devices[guid].getGeneralSettings()
    if (response != null) {
      MqttProvider.publishEvent('success', ['AMT_GeneralSettings'], 'Sent General Settings', guid)
      // matches version 2.x API for Open AMT
      const result = {
        Header: response.Header,
        Body: response.Body.AMT_GeneralSettings
      }
      res.status(200).json(result)
    } else {
      log.error(`Request failed during GET AMT_GeneralSettings for guid : ${guid}.`)
      MqttProvider.publishEvent('fail', ['AMT_GeneralSettings'], 'Failed to Get General Settings', guid)
      res.status(400).json(ErrorResponse(400, `Request failed during GET AMT_GeneralSettings for guid : ${guid}.`))
    }
  } catch (error) {
    log.error(`Exception in AMT GeneralSettings: ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_GeneralSettings'], 'Internal Server Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT GeneralSettings.'))
  }
}
