/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

export interface ISecretManagerService {
  getSecretFromKey: (path: string, key: string) => Promise<string>
  getSecretAtPath: (path: string) => Promise<any>
  getAMTCredentials: (path: string) => Promise<string[]>
  deleteSecretAtPath: (path: string) => Promise<void>
  health: () => Promise<any>
}
