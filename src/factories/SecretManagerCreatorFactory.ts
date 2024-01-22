/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type ILogger } from '../interfaces/ILogger.js'
import { type ISecretManagerService } from '../interfaces/ISecretManagerService.js'
import { Environment } from '../utils/Environment.js'

export class SecretManagerCreatorFactory {
  private static instance: ISecretManagerService

  async getSecretManager (logger: ILogger): Promise<ISecretManagerService> {
    if (SecretManagerCreatorFactory.instance == null) {
      const { default: Provider }: { default: new (logger: ILogger) => ISecretManagerService } =
        await import(`../secrets/${Environment.Config.secrets_provider}/index.js`)

      SecretManagerCreatorFactory.instance = new Provider(logger)
    }

    return SecretManagerCreatorFactory.instance
  }
}
