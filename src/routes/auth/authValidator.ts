/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { check, type ValidationChain } from 'express-validator'

export const authValidator = (): ValidationChain[] => [
  check('username')
    .isString()
    .not()
    .isEmpty()
    .withMessage('User name is required'),
  check('password')
    .not()
    .isEmpty()
    .withMessage('Password is required')
]
