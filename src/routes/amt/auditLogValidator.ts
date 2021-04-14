/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { check } from 'express-validator'

export const auditLogValidator = (): any => {
  return [
    check('startIndex')
      .isNumeric()
      .optional()
      .default(0)
  ]
}
