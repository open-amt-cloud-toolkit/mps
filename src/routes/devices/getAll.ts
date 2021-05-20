/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { validationResult } from 'express-validator'
import { MetadataDb } from '../../db/metadata'
import { Device, DeviceMetadata } from '../../models'
import { logger as log } from '../../utils/logger'

export async function getAll (req, res): Promise<void> {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    let metadata: DeviceMetadata[] = []
    let list: Device[] = []
    const db = new MetadataDb()

    if (req.query.tags != null) {
      const tags = req.query.tags.split(',')
      metadata = await db.getByTags(tags, req.query.method)
    } else {
      metadata = await db.get()
    }

    for (const m of metadata) {
      list.push({
        connectionStatus: req.mpsService.mpsComputerList[m.guid] == null ? 0 : 1,
        hostname: m.hostname,
        guid: m.guid,
        metadata: m
      })
    }

    if (req.query.status != null) {
      list = list.filter(x => x.connectionStatus === req.query.status)
    }

    res.status(200).json(list).end()
  } catch (err) {
    log.error(err)
    res.status(500).end()
  }
}
