/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { logger, messages } from '../../logging'
import { Request, Response } from 'express'

export async function getDistinctTags (req: Request, res: Response): Promise<void> {
  try {
    const results = await req.db.devices.getDistinctTags()
    if (results != null) {
      res.status(200).json(results).end()
    } else {
      res.status(404).end()
    }
  } catch (err) {
    logger.error(`${messages.DEVICE_TAGS_EXCEPTION}: ${err}`)
    res.status(500).end()
  }
}
