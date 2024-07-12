/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { logger } from './../logging/index.js'
import { Environment } from './../utils/Environment.js'
import { backOff } from 'exponential-backoff'
import { type configType } from './../models/Config.js'
import { type IServiceManager } from './../interfaces/IServiceManager.js'

export async function waitForServiceManager(service: IServiceManager, serviceName: string): Promise<void> {
  await backOff(async () => await service.health(serviceName), {
    retry: (e: any, attemptNumber: number) => {
      logger.info(`waiting for consul[${attemptNumber}] ${e.code || e.message || e}`)
      return true
    }
  })
}

export async function processServiceConfigs(consul: IServiceManager, config: configType): Promise<boolean> {
  const prefix = Environment.Config.consul_key_prefix
  const consulValues = await consul.get(prefix)
  if (consulValues == null) {
    await consul.seed(prefix, config)
  } else {
    consul.process(consulValues)
  }
  return true
}
