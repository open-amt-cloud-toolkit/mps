/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { ServiceVersion } from '../../utils/constants'
import { Request, Response } from 'express'

export function getVersion (req: Request, res: Response): void {
  const response = {
    serviceVersion: ServiceVersion
  }
  res.status(200).json(response).end()
}
