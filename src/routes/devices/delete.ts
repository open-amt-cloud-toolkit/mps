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
    const results = await db.delete(req.params.guid)
    if (results) {
      res.status(204).end()
    } else {
      res.status(400).end()
    }
  } catch (err) {
    log.error(err)
    res.status(500).end()
  }
}
