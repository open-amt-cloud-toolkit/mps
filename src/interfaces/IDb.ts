/*********************************************************************
* Copyright (c) Intel Corporation
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { IDeviceTable } from './IDeviceTable'

export interface IDB {
  devices: IDeviceTable
  query: (text: string, params?: any) => Promise<any>
}
