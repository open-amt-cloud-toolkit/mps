/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { jest } from '@jest/globals'

export const createSpyObj = (baseName, methodNames): Record<string, jest.Mock<any>> => {
  const obj: any = {}

  for (const methodName of methodNames) {
    obj[methodName] = jest.fn()
  }

  return obj
}
