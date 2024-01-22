/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type certificatesType } from '../models/Config.js'

export interface ISecretManagerService {
  getSecretFromKey: (path: string, key: string) => Promise<string>
  getSecretAtPath: (path: string) => Promise<any>
  getAMTCredentials: (path: string) => Promise<string[]>
  getMPSCerts: () => Promise<certificatesType>
  writeSecretWithObject: (path: string, data: any) => Promise<boolean>
  deleteSecretAtPath: (path: string) => Promise<void>
  health: () => Promise<any>
}
