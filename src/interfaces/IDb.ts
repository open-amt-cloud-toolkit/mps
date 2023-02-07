/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type IDeviceTable } from './IDeviceTable'

export interface IDB {
  devices: IDeviceTable
  query: (text: string, params?: any) => Promise<any>
}
