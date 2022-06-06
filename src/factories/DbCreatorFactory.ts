/*********************************************************************
* Copyright (c) Intel Corporation
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { IDB } from '../interfaces/IDb'
import { Environment } from '../utils/Environment'

export class DbCreatorFactory {
  static instance: IDB

  async getDb (): Promise<IDB> {
    const provider = await import(`../data/${Environment.Config.db_provider}`)

    if (DbCreatorFactory.instance == null) {
      // eslint-disable-next-line new-cap
      return new provider.default(Environment.Config.connection_string)
    } else {
      return DbCreatorFactory.instance
    }
  }
}
