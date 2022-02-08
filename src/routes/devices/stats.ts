/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Request, Response } from 'express'
import { DEFAULT_SKIP, DEFAULT_TOP } from '../../utils/constants'

export async function stats (req: Request, res: Response): Promise<void> {
  const devices = await req.db.devices.get(DEFAULT_TOP, DEFAULT_SKIP)
  let connectedCount = 0
  let totalCount = 0
  if (devices != null) {
    totalCount = devices.length
  }
  if (totalCount !== 0) {
    connectedCount = devices.filter(device => device.connectionStatus).length
  }

  res.json({
    totalCount,
    connectedCount,
    disconnectedCount: Math.max(totalCount - connectedCount, 0)
  })
}
