/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { validationResult } from 'express-validator'
import { MetadataDb } from '../../db/metadata'
import { logger as log } from '../../utils/logger'

export async function insertDevice (req, res): Promise<void> {
  const db = new MetadataDb()
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }
    // replace behavior if metadata already exists
    const exists = await db.getById(req.body.guid)
    if (exists != null) {
      const results = await db.update(req.body)
      res.status(200).json(results)
    } else {
      const results = await db.insert(req.body)
      res.status(201).json(results)
    }
  } catch (err) {
    log.error(err)
    res.status(500).end()
  }
}
