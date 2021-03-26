/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { check } from 'express-validator'

export const metadataInsertValidator = (): any => {
  return [
    check('guid')
      .isUUID(),
    check('hostname')
      .optional({ nullable: true })
      .isString(),
    check('tags')
      .isArray()
  ]
}

export const metadataUpdateValidator = (): any => {
  return [
    check('guid')
      .isUUID(),
    check('hostname')
      .optional({ nullable: true })
      .isString(),
    check('tags')
      .optional()
      .isArray()
  ]
}
