/*********************************************************************
* Copyright (c) Intel Corporation
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { DeviceAction } from './amt/DeviceAction'
import { IDB } from './interfaces/IDb'
import { ISecretManagerService } from './interfaces/ISecretManagerService'
import { certificatesType } from './models/Config'

declare module 'express' {
  export interface Request {
    secrets: ISecretManagerService
    certs: certificatesType
    db: IDB
    deviceAction: DeviceAction
  }
}
