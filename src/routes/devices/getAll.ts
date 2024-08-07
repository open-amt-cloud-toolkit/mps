/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type Device } from '../../models/models.js'
import { logger, messages } from '../../logging/index.js'
import { type DataWithCount } from '../../models/Config.js'
import { type Request, type Response } from 'express'

export async function getAllDevices(req: Request, res: Response): Promise<void> {
  const count: boolean = req.query.$count as any // converted in validator
  try {
    let list: Device[] = []

    if (req.query.hostname != null) {
      list = await req.db.devices.getByHostname(req.query.hostname as string, req.tenantId)
    } else if (req.query.friendlyName != null) {
      list = await req.db.devices.getByFriendlyName(req.query.friendlyName as string, req.tenantId)
    } else if (req.query.tags != null) {
      const tags = (req.query.tags as string).split(',')
      list = await req.db.devices.getByTags(
        tags,
        req.query.method as string,
        req.query.$top as string,
        req.query.$skip as string,
        req.tenantId
      )
    } else {
      list = await req.db.devices.get(req.query.$top as string, req.query.$skip as string, req.tenantId)
    }
    if (req.query.status != null) {
      list = list.filter((x) => {
        const convertedStatus = x.connectionStatus ? 1 : 0
        return convertedStatus === (req.query.status as any)
      })
    }
    if (count != null && count) {
      const count: number = await req.db.devices.getCount(req.tenantId)
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
