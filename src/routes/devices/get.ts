/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { logger, messages } from '../../logging'
import { Request, Response } from 'express'

export async function getDevice (req: Request, res: Response): Promise<void> {
  try {
    let id
    if (req.params.guid && req.params.guid.length === 36) { id = req.params.guid }
    if (req.params.hostname && req.params.hostname.length < 256) { id = req.params.hostname }
    const results = await req.db.devices.getById(id)
    if (results != null) {
      res.status(200).json(results).end()
    } else {
      res.status(404).end()
    }
  } catch (err) {
    logger.error(`${messages.DEVICE_GET_EXCEPTION}: ${err}`)
    res.status(500).end()
  }
}
