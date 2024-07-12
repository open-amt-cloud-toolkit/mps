/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { check } from 'express-validator'
import { DMTFPowerStates } from '../../utils/constants.js'

export const powerActionValidator = (): any => [
  check('action').isIn(DMTFPowerStates).isNumeric()
]
