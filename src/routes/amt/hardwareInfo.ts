/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device audit logs
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { amtPort } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'

export async function hardwareInfo (req: Request, res: Response): Promise<void> {
  try {
    const guid = req.params.guid
    const ciraconn = req.mpsService.mpsserver.ciraConnections[guid]
    if (ciraconn && ciraconn.readyState === 'open') {
      const cred = await req.mpsService.db.getAmtPassword(guid)
      const amtstack = req.amtFactory.getAmtStack(guid, amtPort, cred[0], cred[1], 0)
      req.mpsService.mqtt.publishEvent('request', ['AMT_HardwareInfo'], 'Hardware Information Requested', guid)

      amtstack.BatchEnum('', ['*CIM_ComputerSystemPackage',
        'CIM_SystemPackaging', '*CIM_Chassis', 'CIM_Chip', '*CIM_Card', '*CIM_BIOSElement',
        'CIM_Processor', 'CIM_PhysicalMemory', 'CIM_MediaAccessDevice', 'CIM_PhysicalPackage'],
      (stack, name, responses, status) => {
        stack.wsman.comm.socket.sendchannelclose()
        if (status !== 200) {
          log.error(`Request failed during AMTHardware Information BatchEnum Exec for guid : ${guid}.`)
          req.mpsService.mqtt.publishEvent('fail', ['AMT_HardwareInfo'], 'Failed to Get Hardware Information', guid)
          return res.status(status).json(ErrorResponse(status, `Request failed during AMTHardware Information BatchEnum Exec for guid : ${guid}.`)).end()
        } else {
          req.mpsService.mqtt.publishEvent('success', ['AMT_HardwareInfo'], 'Sent Hardware Information', guid)
          res.status(status).json(responses).end()
        }
      })
    } else {
      req.mpsService.mqtt.publishEvent('fail', ['AMT_HardwareInfo'], 'Device Not Found', guid)
      res.status(404).json(ErrorResponse(404, `guid : ${guid}`, 'device')).end()
    }
  } catch (error) {
    log.error(`Exception in AMT HardwareInformation : ${error}`)
    req.mpsService.mqtt.publishEvent('fail', ['AMT_HardwareInfo'], 'Interanl Server Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMTHardware Information.')).end()
  }
}
