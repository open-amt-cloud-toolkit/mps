/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import Consul from 'consul'
import { logger } from './../logging/index.js'
import { type configType } from './../models/Config.js'
import type { IServiceManager } from './../interfaces/IServiceManager.js'
import { Environment } from './../utils/Environment.js'

export class ConsulService implements IServiceManager {
  consul: Consul.Consul
  constructor (host: string, port: string) {
    this.consul = new Consul({
      host,
      port,
      secure: false // set to true if your Consul server uses https
    })
  }

  async health (serviceName: string): Promise<any> {
    return this.consul.health.service({ service: serviceName, passing: true })
  }

  async seed (prefix: string, config: configType): Promise<boolean> {
    try {
      await this.consul.kv.set(`${prefix}/config`, JSON.stringify(config, null, 2))
      logger.info('Wrote configuration settings to Consul.')
      return true
    } catch (e) {
      return false
    }
  }

  async get (prefix: string): Promise<any> {
    return this.consul.kv.get({ key: prefix + '/', recurse: true })
  }

  process (consulValues: object): string {
    let value: string
    for (const consulKey in consulValues) {
      value = consulValues[consulKey].Value
      Environment.Config = JSON.parse(value)
    }
    return value
  }
}
