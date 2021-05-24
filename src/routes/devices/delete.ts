/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { validationResult } from 'express-validator'
import { DeviceDb } from '../../db/device'
import { logger as log } from '../../utils/logger'

export async function deleteDevice (req, res): Promise<void> {
  const db = new DeviceDb()
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const device = await db.getById(req.params.guid)
    if (device == null) {
      res.status(404).json({ error: 'NOT FOUND', message: `Device ID ${req.params.guid} not found` }).end()
    } else {
      const results = await db.delete(req.params.guid)
      if (results) {
        res.status(204).end()
      }
    }
  } catch (err) {
    log.error(`Failed to delete device: ${req.params.guid}`, err)
    res.status(500).end()
  }
}
