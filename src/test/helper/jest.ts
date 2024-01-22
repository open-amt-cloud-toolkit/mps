/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { jest } from '@jest/globals'

export const createSpyObj = (baseName, methodNames): Record<string, jest.Mock<any>> => {
  const obj: any = {}

  for (let i = 0; i < methodNames.length; i++) {
    obj[methodNames[i]] = jest.fn()
  }

  return obj
}
