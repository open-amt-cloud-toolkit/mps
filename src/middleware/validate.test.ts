/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { createSpyObj } from '../test/helper/jest'
import validateMiddleware from './validate'
jest.mock('express-validator', () => ({
  validationResult: jest.fn().mockImplementation((shouldHaveErrors) => {
    return {
      isEmpty: jest.fn().mockReturnValue(!shouldHaveErrors),
      array: jest.fn()
    }
  })
}))

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
    await validateMiddleware(false as any, resSpy, next)
    expect(resSpy.json).not.toHaveBeenCalled()
    expect(resSpy.status).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
  it('should return 400 when validation errors', async () => {
    await validateMiddleware(true as any, resSpy, next)
    expect(resSpy.json).toHaveBeenCalled()
    expect(resSpy.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })
})
