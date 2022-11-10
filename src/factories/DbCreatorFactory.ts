/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { IDB } from '../interfaces/IDb'
import { Environment } from '../utils/Environment'

export class DbCreatorFactory {
  private static instance: IDB
  async getDb (): Promise<IDB> {
    if (DbCreatorFactory.instance == null) {
      const { default: Provider }: { default: new () => IDB } =
        await import(`../data/${Environment.Config.db_provider}`)
      DbCreatorFactory.instance = new Provider()
    }
    return DbCreatorFactory.instance
  }
}
