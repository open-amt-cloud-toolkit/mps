/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { check } from 'express-validator'

export const auditLogValidator = (): any => {
  return [
    check('startIndex')
      .isNumeric()
      .isFloat({ min: 0 }) // At time of writing, isNumberic does not have a min, isFloat can be used instead
      .optional()
      .default(0)
  ]
}
