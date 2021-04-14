/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { check } from 'express-validator'
import { DMTFPowerStates } from '../../utils/constants'

export const powerActionValidator = (): any => {
  return [
    check('action')
      .isIn(DMTFPowerStates)
      .isNumeric(),
    check('useSOL')
      .isBoolean()
      .toBoolean()
  ]
}
