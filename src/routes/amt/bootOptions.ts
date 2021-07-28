/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to execute a power action on amt device
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'
import { validationResult } from 'express-validator'
import { MqttProvider } from '../../utils/mqttProvider'

export async function bootOptions (req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body
    const guid = req.params.guid
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() }).end()
      return
    }

    const ciraconn = req.mpsService.mpsserver.ciraConnections[guid]
    if (ciraconn && ciraconn.readyState === 'open') {
      const cred = await req.mpsService.secrets.getAMTCredentials(guid)
      const amtstack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
      getBootData(guid, payload.action, amtstack, req, res)
    } else {
      MqttProvider.publishEvent('fail', ['AMT_BootSettingData'], 'Device Not Found', guid)
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in Power action : ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_BootSettingData'], 'Internal Server Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMT Power action execution.')).end()
  }
}

// Get AMT_BootSettingData
function getBootData (uuid: string, action: number, amtstack, req, res): void {
  // TODO: Advanced Menu
  let amtPowerBootCapabilities
  const handler = (stack, name, response, status): void => {
    if (status !== 200) {
      log.error(`Power Action failed during PUT AMT_BootSettingData for guid : ${uuid}`)
      res.status(status).json(ErrorResponse(status, 'Power Action failed during GET AMT_BootSettingData.')).end()
      return
    }
    const payload = req.body
    const r = response.Body
    if (action !== 999) {
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
      r.UseSOL = payload.useSOL
      r.UseSafeMode = false
      r.UserPasswordBypass = false
      if (r.SecureErase) {
        r.SecureErase = action === 104 && amtPowerBootCapabilities.SecureErase === true
      }
    }
    putBootData(uuid, action, amtstack, r, req, res)
  }
  amtstack.Get('AMT_BootSettingData', handler, 0, 1)
}

// Put AMT_BootSettingData
function putBootData (uuid, action, amtstack, bootSettingData, req, res): void {
  const callback = (stack, name, response, status, tag): void => {
    if (status !== 200) {
      log.error(
            `Power Action failed during PUT AMT_BootSettingData for guid : ${uuid}`
      )
      res.status(status).json(ErrorResponse(status, 'Power Action failed during GET AMT_BootSettingData.')).end()
      return
    }
    setBootConfRole(uuid, action, amtstack, req, res)
  }

  amtstack.Put('AMT_BootSettingData', bootSettingData, callback, bootSettingData, 1)
}

// SET BootConfigRole
function setBootConfRole (uuid, action, amtstack, req, res): void {
  // ToDo: Advance options
  let idxD24ForceBootDevice
  const callback = (stack, name, response, status): void => {
    if (status !== 200) {
      log.error(`Power Action failed during SetBootConfigRole for guid : ${uuid}`
      )
      res.status(status).json(ErrorResponse(status, 'Power Action failed during SetBootConfigRole.')).end()
      return
    }
    let bootSource = null
    if (action === 999) {
      if (idxD24ForceBootDevice.value > 0) {
        bootSource = ['Force CD/DVD Boot', 'Force PXE Boot', 'Force Hard-drive Boot', 'Force Diagnostic Boot'][idxD24ForceBootDevice.value - 1]
      }
    } else {
      if (action === 300 || action === 301) {
        bootSource = 'Force Diagnostic Boot'
      }
      if (action === 400 || action === 401) {
        bootSource = 'Force PXE Boot'
      }
    }
    if (bootSource != null) {
      bootSource =
          `<Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address>
          <ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">
            <ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootSourceSetting</ResourceURI>
            <SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">
              <Selector Name="InstanceID">Intel(r) AMT: ${bootSource}</Selector>
            </SelectorSet>
          </ReferenceParameters>`
    }
    changeBootOrder(uuid, action, amtstack, bootSource, req, res)
  }

  amtstack.SetBootConfigRole(1, callback, 0, 1)
}

// Change BootOrder
function changeBootOrder (uuid, action, amtstack, bootSource, req, res): void {
  amtstack.CIM_BootConfigSetting_ChangeBootOrder(
    bootSource,
    (stack, name, response, status) => {
      if (status !== 200) {
        log.error(
            `Power Action failed during ChangeBootOrder for guid : ${uuid}`
        )
        res.status(status).json(ErrorResponse(status, 'Power Action failed during ChangeBootOrder.')).end()
        return
      }
      if (action === 100 || action === 201 || action === 203 || action === 300 || action === 401) {
        action = 2
      } // Power up
      if (action === 101 || action === 200 || action === 202 || action === 301 || action === 400) {
        action = 10
      } // Reset
      if (action === 11) {
        action = 10
      }

      // TODO: Advanced power actions
      if (action === 104) action = 10 // Reset with Remote Secure Erase
      // if (action == 999) action = AvdPowerDlg.Action;
      // console.log('RequestPowerStateChange:' + action);

      if (action < 999) {
        powerStateChange(uuid, action, amtstack, req, res)
      } else {
        // TODO: Advanced options
      }
    }
  )
}

// Request Power Change
function powerStateChange (uuid, action, amtstack, req, res): void {
  amtstack.RequestPowerStateChange(
    action,
    async (stack, name, response, status) => {
      stack.wsman.comm.socket.sendchannelclose()
      if (status === 200) {
        // log.info(`Power state change request successful for guid : ${uuid}`);
        MqttProvider.publishEvent('success', ['AMT_BootSettingData'], 'Sent Power Action ' + action, uuid)
        res.status(200).json(response).end()
      } else {
        log.error(`Power state change request failed for guid : ${uuid}`)
        res.status(status).json(ErrorResponse(status, 'PowerStateChange request failed.')).end()
      }
    }
  )
}
