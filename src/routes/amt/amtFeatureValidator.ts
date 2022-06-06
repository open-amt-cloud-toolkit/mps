/*********************************************************************
* Copyright (c) Intel Corporation
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { check } from 'express-validator'

export const amtFeaturesValidator = (): any => {
  return [
    check('userConsent')
      .isIn(['kvm', 'all', 'none'])
      .isString(),
    check('enableSOL')
      .isBoolean()
      .toBoolean(),
    check('enableIDER')
      .isBoolean()
      .toBoolean(),
    check('enableKVM')
      .isBoolean()
      .toBoolean()
  ]
}
