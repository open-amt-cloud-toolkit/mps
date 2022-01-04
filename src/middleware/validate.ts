/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Request, Response } from 'express'
import { validationResult } from 'express-validator'

const validateMiddleware = async (req: Request, res: Response, next): Promise<void> => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
  } else {
    next()
  }
}
export default validateMiddleware
