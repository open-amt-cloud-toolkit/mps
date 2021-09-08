/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
export interface ITable<T> {
  getCount: (tenantId?: string) => Promise<number>
  get: (limit: number, offset: number, tenantId?: string) => Promise<T[]>
  getByName: (name: string, tenantId?: string) => Promise<T>
  delete: (name: string, tenantId?: string) => Promise<boolean>
  insert: (item: T) => Promise<T>
  update: (item: T) => Promise<T>
}
