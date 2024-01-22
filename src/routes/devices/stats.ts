/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type Request, type Response } from 'express'
import { logger } from '../../logging/index.js'
import { messages } from '../../logging/messages.js'

export async function stats (req: Request, res: Response): Promise<void> {
  try {
    const connectedCount = await req.db.devices.getConnectedDevices(req.tenantId)
    const totalCount = await req.db.devices.getCount(req.tenantId)
    res.json({
      totalCount,
      connectedCount,
      disconnectedCount: Math.max(totalCount - connectedCount, 0)
    })
  } catch (err) {
    logger.error(`${messages.DEVICE_GET_STATES_EXCEPTION}: ${err}`)
    res.status(500).end()
  }
}
