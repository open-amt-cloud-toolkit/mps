/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Handler to get amt device audit logs
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log, logger } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'
import { DeviceAction } from '../../amt/DeviceAction'

export async function hardwareInfo (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid

    MqttProvider.publishEvent('request', ['AMT_HardwareInfo'], 'Hardware Information Requested', guid)
    const response = await get(req.deviceAction, guid)
    if (Object.values(response).some(item => item == null)) {
      log.error(`Request failed during AMTHardware Information BatchEnum Exec for guid : ${guid}.`)
      MqttProvider.publishEvent('fail', ['AMT_HardwareInfo'], 'Failed to Get Hardware Information', guid)
      res.status(400).json(ErrorResponse(400, `Request failed during AMTHardware Information BatchEnum Exec for guid : ${guid}.`))
    } else {
      MqttProvider.publishEvent('success', ['AMT_HardwareInfo'], 'Sent Hardware Information', guid)
      logger.info(JSON.stringify(response, null, '\t'))
      res.status(200).json(formatResponse(response))
    }
  } catch (error) {
    log.error(`Exception in AMT HardwareInformation : ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_HardwareInfo'], 'Interanl Server Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during AMTHardware Information.'))
  }
}

export async function get (device: DeviceAction, guid: string): Promise<any> {
  const response: {[key: string]: any} = {}
  response.CIM_ComputerSystemPackage = await device.getComputerSystemPackage()
  response.CIM_Chassis = await device.getChassis()
  response.CIM_Card = await device.getCard()
  response.CIM_BIOSElement = await device.getBIOSElement()
  response.CIM_Processor = await device.getProcessor()
  response.CIM_PhysicalMemory = await device.getPhysicalMemory()
  response.CIM_MediaAccessDevice = await device.getMediaAccessDevice()
  response.CIM_PhysicalPackage = await device.getPhysicalPackage()
  response.CIM_SystemPackaging = await device.getSystemPackaging()
  response.CIM_Chip = await device.getChip()

  return response
}

// matches version 2.x API for Open AMT
// To do: CIM_ComputerSystemPackage and CIM_SystemPackaging returns same data, similarly CIM_Card and CIM_PhysicalPackage
export function formatResponse (response: any): any {
  return {
    CIM_ComputerSystemPackage: {
      response: response.CIM_ComputerSystemPackage?.Body?.CIM_ComputerSystemPackage,
      status: response.CIM_ComputerSystemPackage?.Body?.CIM_ComputerSystemPackage ? '200' : '400'
    },
    CIM_SystemPackaging: {
      responses: [response.CIM_SystemPackaging?.Body?.PullResponse?.Items.CIM_ComputerSystemPackage],
      status: response.CIM_SystemPackaging?.Body?.PullResponse?.Items.CIM_ComputerSystemPackage ? '200' : '400'
    },
    CIM_Chassis: {
      response: response.CIM_Chassis?.Body?.CIM_Chassis,
      status: response.CIM_Chassis?.Body?.CIM_Chassis ? '200' : '400'
    },
    CIM_Chip: {
      responses: [response.CIM_Chip?.Body?.PullResponse?.Items?.CIM_Chip],
      status: response.CIM_Chip?.Body ? '200' : '400'
    },
    CIM_Card: {
      response: response.CIM_Card?.Body?.CIM_Card,
      status: response.CIM_Card?.Body ? '200' : '400'
    },
    CIM_BIOSElement: {
      response: response.CIM_BIOSElement?.Body?.CIM_BIOSElement,
      status: response.CIM_BIOSElement?.Body ? '200' : '400'
    },
    CIM_Processor: {
      responses: [response.CIM_Processor?.Body?.PullResponse?.Items?.CIM_Processor],
      status: response.CIM_Processor?.Body?.PullResponse?.Items?.CIM_Processor ? '200' : '400'
    },
    CIM_PhysicalMemory: {
      responses: response.CIM_PhysicalMemory?.Body?.PullResponse?.Items?.CIM_PhysicalMemory,
      status: response.CIM_Processor?.Body?.PullResponse?.Items?.CIM_Processor ? '200' : '400'
    },
    CIM_MediaAccessDevice: {
      responses: [response.CIM_MediaAccessDevice?.Body?.PullResponse?.Items?.CIM_MediaAccessDevice],
      status: response.CIM_MediaAccessDevice?.Body?.PullResponse?.Items?.CIM_MediaAccessDevice ? '200' : '400'
    },
    CIM_PhysicalPackage: {
      responses: [response.CIM_PhysicalPackage?.Body?.PullResponse?.Items?.CIM_Card],
      status: response.CIM_PhysicalPackage?.Body?.PullResponse?.Items?.CIM_Card ? '200' : '400'
    }
  }
}
