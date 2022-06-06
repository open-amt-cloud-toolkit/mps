/*********************************************************************
* Copyright (c) Intel Corporation
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
