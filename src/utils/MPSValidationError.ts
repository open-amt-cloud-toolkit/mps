/*********************************************************************
* Copyright (c) Intel Corporation
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export class MPSValidationError extends Error {
  constructor (public message: string, public status?: number, public errorName?: string) {
    super(message)
    if (errorName) {
      this.name = errorName
    }
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, MPSValidationError.prototype)
  }
}
