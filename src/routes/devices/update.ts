/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { validationResult } from 'express-validator'
import { DeviceDb } from '../../db/device'
import { logger as log } from '../../utils/logger'
import { MPSValidationError } from '../../utils/MPSValidationError'
import { Request, Response } from 'express'

export async function updateDevice (req: Request, res: Response): Promise<void> {
  const db = new DeviceDb()
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }
    let device = await db.getById(req.body.guid)
    if (device == null) {
      res.status(404).json({ error: 'NOT FOUND', message: `Device ID ${req.body.guid} not found` }).end()
    } else {
      device = { ...device, ...req.body }
      device.tenantId = '' // ensure from token and not overwritten
      const results = await db.update(device)
      res.status(200).json(results).end()
    }
  } catch (err) {
    log.error(`Failed to update device : ${req.body.guid}`, err)
    if (err instanceof MPSValidationError) {
      res.status(err.status).json({ error: err.name, message: err.message }).end()
    } else {
      res.status(500).end()
    }
  }
}
