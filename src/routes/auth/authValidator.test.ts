/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import * as authValidator from './authValidator'

describe('Check authValidator from auth', () => {
  let authSpy: jest.SpyInstance
  beforeEach(() => {
    authSpy = jest.spyOn(authValidator, 'authValidator')
  })
  it('should pass if defined', async () => {
    expect(authSpy).toBeDefined()
  })
})
