/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { Device } from '../../models/models'
import { logger as log } from '../../utils/logger'
import { DataWithCount } from '../../models/Config'

export async function getAllDevices (req, res): Promise<void> {
  const count = req.query.$count
  try {
    let list: Device[] = []

    if (req.query.tags != null) {
      const tags = req.query.tags.split(',')
      list = await req.db.devices.getByTags(tags, req.query.method, req.query.$top, req.query.$skip)
    } else {
      list = await req.db.devices.get(req.query.$top, req.query.$skip)
    }
    if (req.query.$status != null) {
      list = list.filter(x => x.connectionStatus === req.query.status)
    }
    if (count != null && (count === true || count === 1)) {
      const count: number = await req.db.devices.getCount()
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
