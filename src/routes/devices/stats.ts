import { DeviceDb } from '../../db/device'

/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
export async function stats (req, res): Promise<void> {
  const db = new DeviceDb()
  const devices = await db.get()
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
