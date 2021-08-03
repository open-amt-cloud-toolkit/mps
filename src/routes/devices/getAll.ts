/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { DeviceDb } from '../../db/device'
import { Device } from '../../models/models'
import { logger as log } from '../../utils/logger'
import { validationResult } from 'express-validator'
import { DataWithCount } from '../../models/Config'

export async function getAllDevices (req, res): Promise<void> {
  const db = new DeviceDb()
  const count = req.query.$count
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }
    let list: Device[] = []

    if (req.query.tags != null) {
      const tags = req.query.tags.split(',')
      list = await db.getByTags(tags, req.query.method, req.query.$top, req.query.$skip)
    } else {
      list = await db.get(req.query.$top, req.query.$skip)
    }
    if (req.query.$status != null) {
      list = list.filter(x => x.connectionStatus === req.query.status)
    }
    if (count != null && (count === true || count === 1)) {
      const count: number = await db.getCount()
      const dataWithCount: DataWithCount = {
        data: list,
        totalCount: count
      }
      res.status(200).json(dataWithCount).end()
    } else {
      res.status(200).json(list).end()
    }
  } catch (err) {
    log.error(`getAllDevices exception: ${err}`)
    res.status(500).end()
  }
}
