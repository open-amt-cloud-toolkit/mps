/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { logger as log } from '../../utils/logger'
import { Request, Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import { ErrorResponse } from '../../utils/amtHelper'

export async function mpsrootcert (req: Request, res: Response): Promise<void> {
  try {
    const certPath = path.join(__dirname, '../../../private/root-cert-public.crt')
    if (fs.existsSync(certPath)) {
      res.send(fs.readFileSync(certPath))
    } else {
      res.status(500).json(ErrorResponse(500, 'MPS root certificate does not exists.')).end()
    }
  } catch (error) {
    log.error(`Exception while downloading MPS root certificate: ${error}`)
    res.status(500).json(ErrorResponse(500, 'Request failed while downloading MPS root certificate.')).end()
  }
}
