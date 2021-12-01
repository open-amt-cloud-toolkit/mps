/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device audit logs
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'

export async function hardwareInfo (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid

    MqttProvider.publishEvent('request', ['AMT_HardwareInfo'], 'Hardware Information Requested', guid)

    req.amtStack.BatchEnum('', ['*CIM_ComputerSystemPackage',
      'CIM_SystemPackaging', '*CIM_Chassis', 'CIM_Chip', '*CIM_Card', '*CIM_BIOSElement',
      'CIM_Processor', 'CIM_PhysicalMemory', 'CIM_MediaAccessDevice', 'CIM_PhysicalPackage'],
    async (stack, name, responses, status) => {
      stack.wsman.comm.socket.sendchannelclose()
      if (status !== 200) {
        log.error(`Request failed during AMTHardware Information BatchEnum Exec for guid : ${guid}.`)
        MqttProvider.publishEvent('fail', ['AMT_HardwareInfo'], 'Failed to Get Hardware Information', guid)
        return res.status(status).json(ErrorResponse(status, `Request failed during AMTHardware Information BatchEnum Exec for guid : ${guid}.`)).end()
      } else {
        MqttProvider.publishEvent('success', ['AMT_HardwareInfo'], 'Sent Hardware Information', guid)
        res.status(status).json(responses).end()
      }
    })
  } catch (error) {
    log.error(`Exception in AMT HardwareInformation : ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_HardwareInfo'], 'Interanl Server Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMTHardware Information.')).end()
  }
}
