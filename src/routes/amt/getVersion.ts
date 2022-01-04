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
    const response = await getVersion(guid)
    if (response == null) {
      log.error(`Request failed during AMTVersion BatchEnum Exec for guid : ${guid}.`)
      res.status(400).json(ErrorResponse(400, `Request failed during AMTVersion BatchEnum Exec for guid : ${guid}.`))
    } else {
      res.status(200).json(response)
    }
  } catch (error) {
    log.error(`Exception in AMT Version : ${error}`)
    res.status(500).json(ErrorResponse(500, 'Request failed during AMTVersion BatchEnum Exec.'))
  }
}

// matches version 2.x API for Open AMT
export async function getVersion (guid: string): Promise<any> {
  const response: {[key: string]: any} = {}
  response.CIM_SoftwareIdentity = await devices[guid].getSoftwareIdentity()
  response.AMT_SetupAndConfigurationService = await devices[guid].getSetupAndConfigurationService()
  if (Object.values(response).some(item => item == null)) {
    return null
  } else {
    return {
      CIM_SoftwareIdentity: {
        responses: response.CIM_SoftwareIdentity?.PullResponse?.Items?.CIM_SoftwareIdentity,
        status: 200
      },
      AMT_SetupAndConfigurationService: {
        response: response.AMT_SetupAndConfigurationService?.Body?.AMT_SetupAndConfigurationService,
        responses: {
          Header: response.AMT_SetupAndConfigurationService?.Header,
          Body: response.AMT_SetupAndConfigurationService.Body?.AMT_SetupAndConfigurationService
        },
        status: 200
      }
    }
  }
}
