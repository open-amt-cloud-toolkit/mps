/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { validationResult } from 'express-validator'
import { DeviceDb } from '../../db/device'
import { logger as log } from '../../utils/logger'
import { Request, Response } from 'express'

export async function getDevice (req: Request, res: Response): Promise<void> {
  const db = new DeviceDb()
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }
    const results = await db.getById(req.params.guid)
    if (results != null) {
      res.status(200).json(results).end()
    } else {
      res.status(404).end()
    }
  } catch (err) {
    log.error(err)
    res.status(500).end()
  }
}
