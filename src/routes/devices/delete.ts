/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { Request, Response } from 'express'
import { logger, messages } from '../../logging'

export async function deleteDevice (req: Request, res: Response): Promise<void> {
  try {
    const device = await req.db.devices.getById(req.params.guid)
    if (device == null) {
      res.status(404).json({ error: 'NOT FOUND', message: `Device ID ${req.params.guid} not found` }).end()
    } else {
      const results = await req.db.devices.delete(req.params.guid)
      if (results) {
        res.status(204).end()
      }
    }
  } catch (err) {
    logger.error(`${messages.DEVICE_DELETE_FAILED}: ${req.params.guid}`, err)
    res.status(500).end()
  }
}
