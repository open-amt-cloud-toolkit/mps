/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type configType } from '../models/Config'
export interface IServiceManager {
  health: (prefix: string) => Promise<boolean>
  get: (prefix: string) => Promise<any>
  process: (consulValues: any) => string
  seed: (prefix: string, config: configType) => Promise<boolean>
}
