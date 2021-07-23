/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Description: stores amt profiles
 * Author: Ramu Bachala
 **********************************************************************/

export interface ISecretManagerService {
  getSecretFromKey: (path: string, key: string) => Promise<string>
  getSecretAtPath: (path: string) => Promise<any>
  getAMTCredentials: (path: string) => Promise<string[]>
}
