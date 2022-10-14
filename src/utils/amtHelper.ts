/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { HTTPErrorTable } from './constants'

export const ErrorResponse = (status: number, errDesc?: string, error?: string): any => {
  let response
  if (error) {
    const errorMessage = HTTPErrorTable[status]
    response = { error: errorMessage[error] }
  } else {
    response = { error: HTTPErrorTable[status] }
  }
  if (errDesc) {
    response.errorDescription = errDesc
  }
  return response
}
