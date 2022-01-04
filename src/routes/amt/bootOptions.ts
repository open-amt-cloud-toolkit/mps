/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to execute a power action on amt device
**********************************************************************/

import { Response, Request } from 'express'
import { logger } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'
import { devices } from '../../server/mpsserver'
import { AMTStatusCodes } from '../../utils/constants'
import { AMT } from '@open-amt-cloud-toolkit/wsman-messages/dist'

export async function bootOptions (req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body // payload.action
    const guid: string = req.params.guid
    const device = devices[guid]
    const results = await device.getBootOptions()
    const bootData = setBootData(payload.action, payload.useSOL, results.AMT_BootSettingData)
    await device.setBootConfiguration(bootData)
    const forceBootSource = setBootSource(payload.action)
    if (forceBootSource != null) { // only if
      await device.forceBootMode(forceBootSource)
      await device.changeBootOrder(forceBootSource)
    } else {
      await device.forceBootMode()
    }
    const newAction = determinePowerAction(payload.action)
    const powerActionResult = await device.sendPowerAction(newAction)
    powerActionResult.RequestPowerStateChange_OUTPUT.ReturnValueStr = AMTStatusToString(powerActionResult.RequestPowerStateChange_OUTPUT.ReturnValue)

    res.status(200).json(powerActionResult.RequestPowerStateChange_OUTPUT)
  } catch (error) {
    logger.error(`Exception in Power action : ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_BootSettingData'], 'Internal Server Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT Power action execution.'))
  }
}

export function setBootData (action: number, useSOL: boolean, r: AMT.Models.BootSettingData): AMT.Models.BootSettingData {
  r.BIOSPause = false
  r.BIOSSetup = action < 104
  r.BootMediaIndex = 0
  r.ConfigurationDataReset = false
  r.FirmwareVerbosity = 0
  r.ForcedProgressEvents = false
  r.IDERBootDevice = action === 202 || action === 203 ? 1 : 0 // 0 = Boot on Floppy, 1 = Boot on IDER
  r.LockKeyboard = false
  r.LockPowerButton = false
  r.LockResetButton = false
  r.LockSleepButton = false
  r.ReflashBIOS = false
  r.UseIDER = action > 199 && action < 300
  r.UseSOL = useSOL
  r.UseSafeMode = false
  r.UserPasswordBypass = false
  r.SecureErase = false
  // if (r.SecureErase) {
  //   r.SecureErase = action === 104 && amtPowerBootCapabilities.SecureErase === true
  // }
  return r
}

export function setBootSource (action: number): string {
  let bootSource
  if (action === 300 || action === 301) {
    bootSource = 'Force Diagnostic Boot'
  }
  if (action === 400 || action === 401) {
    bootSource = 'Force PXE Boot'
  }

  return bootSource
}

// Change BootOrder
export function determinePowerAction (action: number): number {
  if (action === 100 || action === 201 || action === 203 || action === 300 || action === 401) {
    action = 2
  } // Power up
  if (action === 101 || action === 200 || action === 202 || action === 301 || action === 400) {
    action = 10
  } // Reset

  // TODO: Advanced power actions
  // if (action === 104) action = 10 // Reset with Remote Secure Erase
  // if (action == 999) action = AvdPowerDlg.Action;
  // console.log('RequestPowerStateChange:' + action);

  return action
}

function AMTStatusToString (code: number): string {
  if (AMTStatusCodes[code]) {
    return AMTStatusCodes[code]
  } else return 'UNKNOWN_ERROR'
}

// Request Power Change
// export function powerStateChange (uuid: string, action: number, req: Request, res: Response): void {
//   req.amtStack.RequestPowerStateChange(action, async (stack, name, response, status) => {
//     stack.wsman.comm.socket.sendchannelclose()
//     if (status === 200) {
//       // log.info(`Power state change request successful for guid : ${uuid}`);
//       MqttProvider.publishEvent('success', ['AMT_BootSettingData'], 'Sent Power Action ' + action, uuid)
//       res.status(200).json(response).end()
//     } else {
//       log.error(`Power state change request failed for guid : ${uuid}`)
//       res.status(status).json(ErrorResponse(status, 'PowerStateChange request failed.')).end()
//     }
//   })
// }
