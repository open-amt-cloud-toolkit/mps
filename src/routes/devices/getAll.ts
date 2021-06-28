/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { DeviceDb } from '../../db/device'
import { Device } from '../../models/models'
import { logger as log } from '../../utils/logger'
import { Request, Response } from 'express'

export async function getAllDevices (req: Request<any, any, any, {tags?: string, method?: string, status?: boolean}>, res: Response): Promise<void> {
  const db = new DeviceDb()
  try {
    let list: Device[] = []

    if (req.query.tags != null) {
      const tags = req.query.tags.split(',')
      list = await db.getByTags(tags, req.query.method)
    } else {
      list = await db.get()
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
