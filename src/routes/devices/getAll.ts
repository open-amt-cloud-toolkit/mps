/*********************************************************************
* Copyright (c) Intel Corporation
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Device } from '../../models/models'
import { logger, messages } from '../../logging'
import { DataWithCount } from '../../models/Config'
import { Request, Response } from 'express'

export async function getAllDevices (req: Request, res: Response): Promise<void> {
  const count: boolean = req.query.$count as any // converted in validator
  try {
    let list: Device[] = []

    if (req.query.hostname != null) {
      list = await req.db.devices.getByHostname(req.query.hostname as string)
    } else if (req.query.tags != null) {
      const tags = (req.query.tags as string).split(',')
      list = await req.db.devices.getByTags(tags, req.query.method as string, req.query.$top as any, req.query.$skip as any)
    } else {
      list = await req.db.devices.get(req.query.$top as any, req.query.$skip as any)
    }
    if (req.query.status != null) {
      list = list.filter(x => {
        const convertedStatus = x.connectionStatus ? 1 : 0
        return convertedStatus === req.query.status as any
      })
    }
    if (count != null && count) {
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
    logger.error(`${messages.DEVICE_GET_ALL_EXCEPTION}: ${err}`)
    res.status(500).end()
  }
}
