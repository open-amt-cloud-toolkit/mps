/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device audit logs
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort, MPSMode } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'

export async function hardwareInfo (req: Request, res: Response): Promise<void> {
  try {
    const guid = req.params.guid
    const ciraconn = await req.mpsService.ciraConnectionFactory.getConnection(guid)
    if (ciraconn && ciraconn.readyState === 'open') {
      const cred = await req.mpsService.db.getAmtPassword(guid)
      const amtstack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
      req.mpsService.mqtt.message({type: 'request', method: 'AMT_HardwareInfo', guid, message: "Hardware Information Requested"})

      amtstack.BatchEnum('', ['*CIM_ComputerSystemPackage',
        'CIM_SystemPackaging', '*CIM_Chassis', 'CIM_Chip', '*CIM_Card', '*CIM_BIOSElement',
        'CIM_Processor', 'CIM_PhysicalMemory', 'CIM_MediaAccessDevice', 'CIM_PhysicalPackage'],
      (stack, name, responses, status) => {
        if (req.mpsService.config.startup_mode === MPSMode.Standalone) {
          stack.wsman.comm.socket.sendchannelclose()
        }
        if (status !== 200) {
          log.error(`Request failed during AMTHardware Information BatchEnum Exec for guid : ${guid}.`)
          req.mpsService.mqtt.message({type: 'fail', method: 'AMT_HardwareInfo', guid, message: "Failed to Get Hardware Information"})
          return res.status(status).json(ErrorResponse(status, `Request failed during AMTHardware Information BatchEnum Exec for guid : ${guid}.`)).end()
        } else {
          req.mpsService.mqtt.message({type: 'success', method: 'AMT_HardwareInfo', guid, message: "Sent Hardware Information"})
          res.status(status).json(responses).end()
        }
      })
    } else {
      req.mpsService.mqtt.message({type: 'fail', method: 'AMT_HardwareInfo', guid, message: "Device Not Found"})
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in AMT HardwareInformation : ${error}`)
    req.mpsService.mqtt.message({type: 'fail', method: 'AMT_HardwareInfo', guid: null, message: "Interanl Server Error"})
    res.status(500).json(ErrorResponse(500, 'Request failed during AMTHardware Information.')).end()
  }
}
