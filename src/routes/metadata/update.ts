/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { validationResult } from 'express-validator'
import { MetadataDb } from '../../db/metadata'
import { logger as log } from '../../utils/logger'

export async function updateDevice (req, res): Promise<void> {
  const db = new MetadataDb()
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const results = await db.update(req.body)
    res.status(200).json(results).end()
  } catch (err) {
    log.error(err)
    res.status(500).end()
  }
}
