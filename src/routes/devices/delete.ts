/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type Request, type Response } from 'express'
import { logger, messages } from '../../logging'

export async function deleteDevice (req: Request, res: Response): Promise<void> {
  try {
    // If req.tenantId is defined the Delete request came through the API gateway and tenantId came from the request header.
    // If not, the request came from a toolkit service (ie. RPS) and tenantId comes for the URL query string
    const tenantId: string = req.tenantId === undefined ? req.query.tenantId as string : req.tenantId

    const device = await req.db.devices.getById(req.params.guid, tenantId)
    if (device == null) {
      res.status(404).json({ error: 'NOT FOUND', message: `Device ID ${req.params.guid} not found` }).end()
    } else {
      const results = await req.db.devices.delete(req.params.guid, tenantId)
      if (results) {
        res.status(204).end()
      }
    }
  } catch (err) {
    logger.error(`${messages.DEVICE_DELETE_FAILED}: ${req.params.guid}`, err)
    res.status(500).end()
  }
}
