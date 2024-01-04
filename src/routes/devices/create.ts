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
    device = await req.db.devices.getById(req.body.guid as string, req.body.tenantId as string)
    if (device != null) {
      device = { ...device, ...req.body }
      const results = await req.db.devices.update(device)
      res.status(200).json(results)
    } else {
      const newEntry: Device = {
        tenantId: '',
        connectionStatus: false,
        ...req.body
      }
      const results = await req.db.devices.insert(newEntry)
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
