/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get power capabilities of amt device
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { amtPort, MPSMode } from '../../utils/constants'

export async function powerCapabilities (req: Request, res: Response): Promise<void> {
  try {
    const guid = req.params.guid
    const ciraconn = await req.mpsService.ciraConnectionFactory.getConnection(guid)
    
    if (ciraconn && ciraconn.readyState === 'open') {
      const cred = await req.mpsService.db.getAmtPassword(guid)
      const amtstack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)

      req.mpsService.mqtt.message({type: 'request', method: 'AMT_PowerCapabilities', guid, message: "Power Capabilities Requested"})
      
      getVersion(amtstack, req, res, (responses, res) => {
        const versionData = responses
        amtstack.Get('AMT_BootCapabilities', async (stack, name, responses, status) => {
          if (status !== 200) {
            log.error(`Request failed during GET AMT_BootCapabilities for guid : ${guid}`)
            return res.status(status).json(ErrorResponse(status, `Request failed during GET AMT_BootCapabilities for guid : ${guid}`)).end()
          }
          // console.log("AMT_BootCapabilities info of " + uuid + " sent.");
          const powerCap = await bootCapabilities(versionData, responses.Body)
          req.mpsService.mqtt.message({type: 'success', method: 'AMT_PowerCapabilities', guid, message: "Sent Power Capabilities"})
          return res.status(200).json(powerCap).end()
        }, 0, 1)
      })
    } else {
      req.mpsService.mqtt.message({type: 'fail', method: 'AMT_PowerCapabilities', guid, message: "Device Not Found"})
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in AMT PowerCapabilities : ${error}`)
    req.mpsService.mqtt.message({type: 'fail', method: 'AMT_PowerCapabilities', guid: null, message: "Internal Server Error"})
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

// Returns AMT version data
function getVersion (amtstack, req, res, func): void {
  try {
    amtstack.BatchEnum('', ['CIM_SoftwareIdentity', '*AMT_SetupAndConfigurationService'],
      function (stack, name, responses, status) {
        if (req.mpsService.config.startup_mode === MPSMode.Standalone) {
          stack.wsman.comm.socket.sendchannelclose()
        }
        if (status !== 200) {
          res.status(status).json(ErrorResponse(status, 'Request failed during AMTVersion BatchEnum Exec.')).end()
          return
        }
        if (!func) {
          res.status(200).json(responses).end()
        } else {
          func(responses, res)
        }
      })
  } catch (ex) {
    res.status(500).json(ErrorResponse(500, 'Request failed during AMTVersion BatchEnum Exec.')).end()
  }
}
