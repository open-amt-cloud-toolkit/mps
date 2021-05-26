/*********************************************************************
 * Copyright (c) Intel Corporation 2020
 * SPDX-License-Identifier: Apache-2.0
 * Author: Madhavi Losetty
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
