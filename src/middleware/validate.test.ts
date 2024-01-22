/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { createSpyObj } from '../test/helper/jest.js'
import { jest } from '@jest/globals'
let mockReturnValue = true
jest.unstable_mockModule('express-validator', () => ({
  validationResult: () => ({
    isEmpty: jest.fn().mockReturnValue(mockReturnValue),
    array: jest.fn().mockReturnValue([{ test: 'error' }])
  } as any)
}))

const v = await import('./validate.js')

describe('Validate Middleware', () => {
  let next: jest.Mock<any>
  let resSpy

  beforeEach(() => {
    next = jest.fn()
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()
  })
  it('should call next() when no errors', async () => {
    await v.default(false as any, resSpy, next)
    expect(resSpy.json).not.toHaveBeenCalled()
    expect(resSpy.status).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
  it('should return 400 when validation errors', async () => {
    mockReturnValue = false
    await v.default(true as any, resSpy, next)
    expect(resSpy.json).toHaveBeenCalled()
    expect(resSpy.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })
})
