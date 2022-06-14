/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { logger, messages } from '../../logging'
import { Request, Response } from 'express'
import { ErrorResponse } from '../../utils/amtHelper'

export async function mpsrootcert (req: Request, res: Response): Promise<void> {
  try {
    if (req.certs?.web_tls_config?.ca == null) {
      res.status(500).json(ErrorResponse(500, messages.MPS_ROOT_CERTIFICATE_DOES_NOT_EXIST)).end()
      return
    }
    if (Array.isArray(req.certs.web_tls_config.ca)) {
      res.send(req.certs.web_tls_config.ca[0])
    } else {
      res.send(req.certs.web_tls_config.ca)
    }
  } catch (error) {
    logger.error(`${messages.MPS_ROOT_CERTIFICATE_EXCEPTION}: ${error}`)
    res.status(500).json(ErrorResponse(500, messages.MPS_ROOT_CERTIFICATE_EXCEPTION)).end()
  }
}
