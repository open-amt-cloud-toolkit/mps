/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { IDB } from './interfaces/IDb'
import { MPSMicroservice } from './mpsMicroservice'

declare module 'express' {
  export interface Request {
    mpsService: MPSMicroservice
    db: IDB
    amtFactory: any
    amtStack: any
  }
}
