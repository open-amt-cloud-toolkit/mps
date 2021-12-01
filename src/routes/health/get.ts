/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Request, Response } from 'express'
import { POSTGRES_RESPONSE_CODES } from '../../data/postgres'
import { HealthCheck } from '../../models/models'
import { ErrorResponse } from '../../utils/amtHelper'
import { Environment } from '../../utils/Environment'
import { logger } from '../../utils/logger'
import { MqttProvider } from '../../utils/MqttProvider'

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
    try {
      await req.db.query('SELECT 1')
    } catch (dbError) {
      status.db.status = POSTGRES_RESPONSE_CODES(dbError?.code)
    }
    try {
      const secretManagerHealth = await req.secrets.health()
      status.secretStore.status = secretManagerHealth
    } catch (secretProviderError) {
      if (secretProviderError.error) {
        status.secretStore.status = secretProviderError.error.code
      } else {
        status.secretStore.status = secretProviderError
      }
    }

    res.status(200)
    if (status.db.status !== 'OK' || status.secretStore.status.initialized !== true || status.secretStore.status.sealed !== false) {
      res.status(503)
    }

    res.json(status).end()
  } catch (error) {
    MqttProvider.publishEvent('fail', ['getHealthCheck'], 'Failed to get health')
    logger.error('Failed to get health', JSON.stringify(error))
    res.status(500)
    res.json(ErrorResponse(500, 'Health Check failed')).end()
  }
}
