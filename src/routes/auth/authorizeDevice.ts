/*********************************************************************
* Copyright (c) Intel Corporation
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Request, Response } from 'express'
import { logger } from '../../logging/logger'
import { Environment } from '../../utils/Environment'
import { signature } from './signature'

export async function authorizeDevice (req: Request, res: Response): Promise<void> {
  const guid: string = req.params.guid
  const device = await req.db.devices.getById(guid)
  if (device) {
    const expirationMinutes = Number(Environment.Config.redirection_expiration_time)
    res.status(200).send({ token: signature(expirationMinutes, guid) })
  } else {
    logger.silly(`device: ${guid} not found`)
    res.status(404).end()
  }
}
