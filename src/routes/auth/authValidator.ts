/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { check } from 'express-validator'

export const authValidator = (): any => {
  return [
    check('username')
      .not()
      .isEmpty()
      .withMessage('User name is required'),
    check('password')
      .not()
      .isEmpty()
      .withMessage('Password is required')
  ]
}
