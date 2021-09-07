/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { IDB } from '../interfaces/IDb'
import { configType } from '../models/Config'

export class DbCreatorFactory {
  static instance: IDB
  config: configType
  constructor (config: configType) {
    this.config = config
  }

  async getDb (): Promise<IDB> {
    const provider = await import(`../data/${this.config.db_provider}`)

    if (DbCreatorFactory.instance == null) {
      // eslint-disable-next-line new-cap
      return new provider.default(this.config.connection_string)
    } else {
      return DbCreatorFactory.instance
    }
  }
}
