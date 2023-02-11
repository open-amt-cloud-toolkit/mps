/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type Device } from '../../models/models'
import { logger, messages } from '../../logging'
import { MPSValidationError } from '../../utils/MPSValidationError'
import { type Request, type Response } from 'express'

export async function insertDevice (req: Request, res: Response): Promise<void> {
  let device: Device
  try {
    device = await req.db.devices.getById(req.body.guid, req.body.tenantId)
    if (device != null) {
      device.hostname = req.body.hostname ?? device.hostname
      device.tags = req.body.tags ?? device.tags
      device.connectionStatus = device.connectionStatus ?? false
      device.mpsusername = req.body.mpsusername ?? device.mpsusername
      device.tenantId = req.body.tenantId ?? ''
      device.friendlyName = req.body.friendlyname ?? ''
      device.dnsSuffix = req.body.dnssuffix ?? ''
      const results = await req.db.devices.update(device)
      res.status(200).json(results)
    } else {
      device = {
        connectionStatus: false,
        guid: req.body.guid,
        hostname: req.body.hostname ?? null,
        tags: req.body.tags ?? null,
        mpsusername: req.body.mpsusername,
        mpsInstance: null,
        tenantId: req.body.tenantId ?? '',
        friendlyName: null,
        dnsSuffix: null
      }
      const results = await req.db.devices.insert(device)
      res.status(201).json(results)
    }
  } catch (err) {
    logger.error(`${messages.DEVICE_CREATE_FAILED} : ${req.body.guid}`, err)
    if (err instanceof MPSValidationError) {
      res.status(err.status).json({ error: err.name, message: err.message }).end()
    } else {
      res.status(500).end()
    }
  }
}
