/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
export async function stats (req, res): Promise<void> {
  const amtCredentials = await req.mpsService.db.getAllAmtCredentials()
  let connectedCount = 0
  let totalCount = 0
  if (amtCredentials != null) {
    totalCount = Object.keys(amtCredentials).length
  }
  if (req.mpsService.mpsComputerList != null) {
    connectedCount = Object.keys(req.mpsService.mpsComputerList).length
  }

  res.json({
    totalCount,
    connectedCount,
    disconnectedCount: totalCount - connectedCount
  })
}
