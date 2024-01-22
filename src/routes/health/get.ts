/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type Request, type Response } from 'express'
import { POSTGRES_RESPONSE_CODES } from '../../data/postgres/index.js'
import { type HealthCheck } from '../../models/models.js'
import { ErrorResponse } from '../../utils/amtHelper.js'
import { Environment } from '../../utils/Environment.js'
import { logger, messages } from '../../logging/index.js'
import { MqttProvider } from '../../utils/MqttProvider.js'
import { VaultResponseCodes } from '../../utils/constants.js'
import { type ISecretManagerService } from '../../interfaces/ISecretManagerService.js'
import { type IDB } from '../../interfaces/IDb.js'

export async function getHealthCheck (req: Request, res: Response): Promise<void> {
  try {
    const status: HealthCheck = {
      db: {
        name: Environment.Config.db_provider.toUpperCase(),
        status: 'OK'
      },
      secretStore: {
        name: 'VAULT',
        status: 'OK'
      }
    }

    status.db.status = await getDBHealth(req.db)
    status.secretStore.status = await getSecretStoreHealth(req.secrets)

    res.status(200)
    if (status.db.status !== 'OK' || status.secretStore.status.initialized !== true || status.secretStore.status.sealed !== false) {
      res.status(503)
    }

    res.json(status).end()
  } catch (error) {
    MqttProvider.publishEvent('fail', ['getHealthCheck'], messages.HEALTH_CHECK_FAILED)
    logger.error(messages.HEALTH_CHECK_FAILED, JSON.stringify(error))
    res.status(500)
    res.json(ErrorResponse(500, messages.HEALTH_CHECK_FAILED)).end()
  }
}

export async function getDBHealth (db: IDB): Promise<any> {
  try {
    await db.query('SELECT 1')
    return 'OK'
  } catch (dbError) {
    if (dbError.code) {
      return POSTGRES_RESPONSE_CODES(dbError?.code)
    } else {
      return POSTGRES_RESPONSE_CODES()
    }
  }
}

export async function getSecretStoreHealth (secretsManager: ISecretManagerService): Promise<any> {
  try {
    const secretProviderResponse = await secretsManager.health()
    return secretProviderResponse
  } catch (secretProviderError) {
    if (secretProviderError.error) {
      return VaultResponseCodes(secretProviderError.error.code)
    } else {
      return VaultResponseCodes(secretProviderError)
    }
  }
}
