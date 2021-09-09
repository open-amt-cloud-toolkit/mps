/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { logger as log } from '../../utils/logger'
import { Request, Response } from 'express'
import { ErrorResponse } from '../../utils/amtHelper'

export async function mpsrootcert (req: Request, res: Response): Promise<void> {
  try {
    if (req.mpsService.certs?.web_tls_config?.ca == null) {
      res.status(500).json(ErrorResponse(500, 'MPS root certificate does not exists.')).end()
      return
    }
    res.send(req.mpsService.certs.web_tls_config.ca)
  } catch (error) {
    log.error(`Exception while downloading MPS root certificate: ${error}`)
    res.status(500).json(ErrorResponse(500, 'Request failed while downloading MPS root certificate.')).end()
  }
}
