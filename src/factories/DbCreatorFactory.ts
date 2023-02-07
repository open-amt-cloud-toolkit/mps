/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type IDB } from '../interfaces/IDb'
import { Environment } from '../utils/Environment'

export class DbCreatorFactory {
  private static instance: IDB
  async getDb (): Promise<IDB> {
    if (DbCreatorFactory.instance == null) {
      const { default: Provider }: { default: new (connectionString: string) => IDB } =
        await import(`../data/${Environment.Config.db_provider}`)
      DbCreatorFactory.instance = new Provider(Environment.Config.connection_string)
    }
    return DbCreatorFactory.instance
  }
}
