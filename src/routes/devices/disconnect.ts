/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { ErrorResponse } from '../../utils/amtHelper'
import { logger as log } from '../../utils/logger'
import { Request, Response } from 'express'
import { devices } from '../../server/mpsserver'

export async function disconnect (req: Request, res: Response): Promise<void> {
  try {
    const guid = req.params.guid
    const device = devices[guid]
    device.ciraSocket.destroy()
    res.json({ success: 200, description: `CIRA connection disconnected : ${guid}` })
  } catch (error) {
    log.error(`Exception in Disconnect: ${JSON.stringify(error)} `)
    res.status(500).json(ErrorResponse(500, 'Request failed while disconnecting device.'))
  }
}
