/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { check } from 'express-validator'

export const metadataQueryValidator = (): any => {
  return [
    check('tags')
      .optional()
      .isString(),
    check('status')
      .optional()
      .isNumeric()
      .isIn([0, 1])
      .toInt(),
    check('method')
      .optional()
      .isIn(['AND', 'OR'])
      .isString()
  ]
}

export const validator = (): any => {
  return [
    check('guid')
      .isUUID(),
    check('hostname')
      .optional({ nullable: true })
      .isString(),
    check('tags')
      .optional()
      .isArray()
      .withMessage('tags should be an array of strings')
  ]
}
