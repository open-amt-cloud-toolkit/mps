/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { Device } from '../models/models'

export interface IDeviceDb {
  getCount: (tenantId?: string) => Promise<number>
  get: (top: number, skip: number, tenantId?: string) => Promise<Device[]>
  getDistinctTags: (tenantId?: string) => Promise<String[]>
  getById: (guid: string, tenantId?: string) => Promise<Device>
  getByTags: (tags: string[], method: string, top: number, skip: number, tenantId?: string) => Promise<Device[]>
  clearInstanceStatus: (mpsInstance: string, tenantId?: string) => void
  delete: (guid: string, tenantId?: string) => Promise<boolean>
  insert: (data: Device) => Promise<Device>
  update: (data: Device) => Promise<Device>
}
