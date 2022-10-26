/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Device } from '../models/models'
import { ITable } from './ITable'

export interface IDeviceTable extends ITable<Device> {
  getConnectedDevices: (tenantId?: string) => Promise<number>
  getDistinctTags: (tenantId?: string) => Promise<String[]>
  getByTags: (tags: string[], method: string, top: number, skip: number, tenantId?: string) => Promise<Device[]>
  getByHostname: (hostname: string, tenantId?: string) => Promise<Device[]>
  clearInstanceStatus: (mpsInstance: string, tenantId?: string) => void
}
