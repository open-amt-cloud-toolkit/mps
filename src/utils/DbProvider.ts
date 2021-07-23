/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { IDbProvider } from '../interfaces/IDbProvider'
import { IDeviceDb } from '../interfaces/IDeviceDb'

export class DbProvider implements IDbProvider {
  devices: IDeviceDb
  logger: any
  constructor (deviceDb: IDeviceDb) {
    this.devices = deviceDb
  }
}
