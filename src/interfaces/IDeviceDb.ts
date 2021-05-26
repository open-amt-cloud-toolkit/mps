/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { Device } from '../models/models'

export interface IDeviceDb {
  get: () => Promise<Device[]>
  getDistinctTags: () => Promise<String[]>
  getById: (guid: string) => Promise<Device>
  getByTags: (tags: string[], method: string) => Promise<Device[]>
  delete: (guid: string) => Promise<boolean>
  insert: (data: Device) => Promise<Device>
  update: (data: Device) => Promise<Device>
}
