/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { validationResult } from 'express-validator'
import { DeviceDb } from '../../db/device'
import { Device } from '../../models/models'
import { logger as log } from '../../utils/logger'

export async function insertDevice (req, res): Promise<void> {
  const db = new DeviceDb()
  let device: Device
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }
    device = await db.getById(req.body.guid)
    if (device != null) {
      device.hostname = req.body.hostname ?? device.hostname
      device.tags = req.body.tags ?? device.tags
      device.connectionStatus = device.connectionStatus ?? false
      const results = await db.update(device)
      res.status(200).json(results)
    } else {
      device = {
        connectionStatus: false,
        guid: req.body.guid,
        hostname: req.body.hostname ?? null,
        tags: req.body.tags ?? null,
        mpsInstance: null
      }
      const results = await db.insert(device)
      res.status(201).json(results)
    }
  } catch (err) {
    log.error(err)
    res.status(500).end()
  }
}
