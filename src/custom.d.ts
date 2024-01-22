/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type DeviceAction } from './amt/DeviceAction.js'
import { type IDB } from './interfaces/IDb.js'
import { type ISecretManagerService } from './interfaces/ISecretManagerService.js'
import { type certificatesType } from './models/Config.js'

declare module 'express' {
  export interface Request {
    secrets: ISecretManagerService
    certs: certificatesType
    db: IDB
    deviceAction: DeviceAction
    tenantId: string
  }
}
