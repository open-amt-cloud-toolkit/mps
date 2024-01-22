/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { authValidator } from './authValidator.js'

describe('Check authValidator from auth', () => {
  it('should pass if defined', async () => {
    const result = authValidator()
    expect(result).toBeDefined()
    expect(result.length).toBe(2)
  })
})
