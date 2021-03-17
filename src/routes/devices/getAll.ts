/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { validationResult } from 'express-validator'
import { MetadataDb } from '../../db/metadata'
import { Credentials, Device, DeviceMetadata } from '../../models/models'
import { logger as log } from '../../utils/logger'

export async function getAll (req, res): Promise<void> {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    let amtCredentials: Credentials = {}
    // TODO: Address being able to query specific guids from VAULT
    amtCredentials = await req.mpsService.db.getAllAmtCredentials()

    let metadata: DeviceMetadata[] = []
    const list: Device[] = []
    const db = new MetadataDb()

    if (req.query.tags != null) {
      const tags = req.query.tags.split(',')
      metadata = await db.getByTags(tags, req.query.method)

      for (const m of metadata) {
        list.push({
          amtuser: amtCredentials ? amtCredentials[m.guid]?.amtuser : null,
          conn: req.mpsService.mpsComputerList[m.guid] == null ? 0 : 1,
          host: m.guid,
          mpsuser: amtCredentials ? amtCredentials[m.guid]?.mpsuser : null,
          name: amtCredentials ? amtCredentials[m.guid]?.name : null,
          metadata: m
        })
      }
    } else {
      metadata = await db.get()
      for (const i in amtCredentials) {
        list.push({
          amtuser: amtCredentials[i].amtuser,
          conn: req.mpsService.mpsComputerList[i] == null ? 0 : 1,
          host: i,
          mpsuser: amtCredentials[i].mpsuser,
          name: amtCredentials[i].name,
          metadata: metadata.find(z => z.guid === i) ?? {}
        })
      }
    }
    res.status(200).json(list).end()
  } catch (err) {
    log.error(err)
    res.status(500).end()
  }
}
