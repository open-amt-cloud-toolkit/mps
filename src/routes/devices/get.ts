/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { validationResult } from 'express-validator'
import { MetadataDb } from '../../db/metadata'
import { Device, DeviceMetadata } from '../../models'
import { logger as log } from '../../utils/logger'

export async function get (req, res): Promise<void> {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const guid = req.params.guid
    const db = new MetadataDb()
    const metadata: DeviceMetadata = await db.getById(guid)

    const device: Device = {
      connectionStatus: req.mpsService.mpsComputerList[guid] == null ? 0 : 1,
      guid: guid,
      hostname: metadata.hostname,
      metadata: metadata
    }

    res.status(200).json(device).end()
  } catch (err) {
    log.error(err)
    res.status(500).end()
  }
}
