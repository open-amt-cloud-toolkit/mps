/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to execute a power action on amt device
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'
import { devices } from '../../server/mpsserver'
import { AMTStatusCodes } from '../../utils/constants'
import { AMT } from '@open-amt-cloud-toolkit/wsman-messages/dist'

export async function powerAction (req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body
    const guid: string = req.params.guid
    const results = await devices[guid].getBootOptions()
    const bootData = setBootData(payload.action, false, results.AMT_BootSettingData)
    await devices[guid].setBootConfiguration(bootData)

    const powerAction = await devices[guid].sendPowerAction(payload.action)
    powerAction.RequestPowerStateChange_OUTPUT.ReturnValueStr = AMTStatusToString(powerAction.RequestPowerStateChange_OUTPUT.ReturnValue)
    MqttProvider.publishEvent('success', ['AMT_PowerAction'], 'Internal Server Error')
    return res.status(200).json(powerAction.RequestPowerStateChange_OUTPUT).end()
  } catch (error) {
    log.error(`Exception in Power action : ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_PowerAction'], 'Internal Server Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT Power action execution.')).end()
  }
}

function AMTStatusToString (code: number): string {
  if (AMTStatusCodes[code]) {
    return AMTStatusCodes[code]
  } else return 'UNKNOWN_ERROR'
}

export function setBootData (action: number, useSOL: boolean, r: AMT.Models.BootSettingData): AMT.Models.BootSettingData {
  r.BIOSPause = false
  r.BIOSSetup = false
  r.BootMediaIndex = 0
  r.ConfigurationDataReset = false
  r.FirmwareVerbosity = 0
  r.ForcedProgressEvents = false
  r.IDERBootDevice = 0
  r.LockKeyboard = false
  r.LockPowerButton = false
  r.LockResetButton = false
  r.LockSleepButton = false
  r.ReflashBIOS = false
  r.UseIDER = false
  r.UseSOL = useSOL
  r.UseSafeMode = false
  r.UserPasswordBypass = false
  r.SecureErase = false
  // if (r.SecureErase) {
  //   r.SecureErase = action === 104 && amtPowerBootCapabilities.SecureErase === true
  // }
  return r
}
