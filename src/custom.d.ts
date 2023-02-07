/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type DeviceAction } from './amt/DeviceAction'
import { type IDB } from './interfaces/IDb'
import { type ISecretManagerService } from './interfaces/ISecretManagerService'
import { type certificatesType } from './models/Config'

declare module 'express' {
  export interface Request {
    secrets: ISecretManagerService
    certs: certificatesType
    db: IDB
    deviceAction: DeviceAction
  }
}
