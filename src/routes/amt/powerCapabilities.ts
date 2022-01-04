/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get power capabilities of amt device
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'
import { devices } from '../../server/mpsserver'
import { getVersion } from './getVersion'

export async function powerCapabilities (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid

    MqttProvider.publishEvent('request', ['AMT_BootCapabilities'], 'Power Capabilities Requested', guid)
    const version = await getVersion(guid)
    const powerCapabilities = await devices[guid].getPowerCapabilities()
    const bootCaps = bootCapabilities(version, powerCapabilities.Body.AMT_BootCapabilities)
    MqttProvider.publishEvent('success', ['AMT_BootCapabilities'], 'Sent Power Capabilities', guid)
    return res.status(200).json(bootCaps).end()
  } catch (error) {
    log.error(`Exception in AMT PowerCapabilities : ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_BootCapabilities'], 'Internal Server Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT PowerCapabilities.')).end()
  }
}

// Return Boot Capabilities
function bootCapabilities (amtVersionData, response): any {
  const amtversion = parseVersionData(amtVersionData)
  const data: any = { 'Power up': 2, 'Power cycle': 5, 'Power down': 8, Reset: 10 }
  if (amtversion > 9) {
    data['Soft-off'] = 12
    data['Soft-reset'] = 14
    data.Sleep = 4
    data.Hibernate = 7
  }
  if (response.BIOSSetup === true) {
    data['Power up to BIOS'] = 100
    data['Reset to BIOS'] = 101
  }
  if (response.SecureErase === true) {
    data['Reset to Secure Erase'] = 104
  }
  data['Reset to IDE-R Floppy'] = 200
  data['Power on to IDE-R Floppy'] = 201
  data['Reset to IDE-R CDROM'] = 202
  data['Power on to IDE-R CDROM'] = 203
  if (response.ForceDiagnosticBoot === true) {
    data['Power on to diagnostic'] = 300
    data['Reset to diagnostic'] = 301
  }
  data['Reset to PXE'] = 400
  data['Power on to PXE'] = 401
  return data
}

// Parse Version Data
function parseVersionData (amtVersionData): number {
  const verList = amtVersionData.CIM_SoftwareIdentity.responses
  for (const i in verList) {
    if (verList[i].InstanceID === 'AMT') {
      return parseInt(verList[i].VersionString.split('.')[0])
    }
  }
}
