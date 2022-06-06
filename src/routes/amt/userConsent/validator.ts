/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { check } from 'express-validator'
export const validator = (): any => {
  return [
    check('consentCode')
      .isNumeric()
  ]
}
