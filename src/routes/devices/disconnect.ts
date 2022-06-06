/*********************************************************************
* Copyright (c) Intel Corporation
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { ErrorResponse } from '../../utils/amtHelper'
import { logger, messages } from '../../logging'
import { Request, Response } from 'express'
import { devices } from '../../server/mpsserver'

export async function disconnect (req: Request, res: Response): Promise<void> {
  try {
    const guid = req.params.guid
    const device = devices[guid]
    device.ciraSocket.destroy()
    res.json({ success: 200, description: `${messages.DEVICE_DISCONNECTED_SUCCESS} : ${guid}` })
  } catch (error) {
    logger.error(`${messages.DEVICE_DISCONNECT_EXCEPTION}: ${JSON.stringify(error)} `)
    res.status(500).json(ErrorResponse(500, messages.DEVICE_DISCONNECT_EXCEPTION))
  }
}
