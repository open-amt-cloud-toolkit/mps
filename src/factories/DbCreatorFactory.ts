/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type IDB } from '../interfaces/IDb.js'
import { Environment } from '../utils/Environment.js'

export class DbCreatorFactory {
  private static instance: IDB
  async getDb (): Promise<IDB> {
    if (DbCreatorFactory.instance == null) {
      const { default: Provider }: { default: new (connectionString: string) => IDB } =
        await import(`../data/${Environment.Config.db_provider}/index.js`)
      DbCreatorFactory.instance = new Provider(Environment.Config.connection_string)
    }
    return DbCreatorFactory.instance
  }
}
