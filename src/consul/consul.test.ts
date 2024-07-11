/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import type Consul from 'consul'
import { ConsulService } from './consul.js'
import { config } from './../test/helper/config.js'
import { jest } from '@jest/globals'
import { spyOn } from 'jest-mock'
const consul: Consul = new ConsulService('localhost', '8500')
let componentName: string
let serviceName: string

describe('consul', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
    jest.resetAllMocks()
    jest.resetModules()

    componentName = 'RPS'
    serviceName = 'consul'

    consul.consul.kv = {
      set: jest.fn(),
      get: jest.fn()
    }
  })

  describe('ConsulService', () => {
    it('get Consul health', async () => {
      const spyHealth = spyOn(consul.consul.health, 'service')
      await consul.health(serviceName)
      expect(spyHealth).toHaveBeenCalledWith({ passing: true, service: 'consul' })
    })
    it('seed Consul success', async () => {
      const result = await consul.seed(componentName, config)
      expect(result).toBe(true)
      expect(consul.consul.kv.set).toHaveBeenCalledWith(componentName + '/config', JSON.stringify(config, null, 2))
    })
    it('seed Consul failure', async () => {
      consul.consul.kv.set = spyOn(consul.consul.kv, 'set').mockResolvedValue(Promise.reject(new Error()))
      const result = await consul.seed(componentName, config)
      expect(result).toBe(false)
    })

    it('get from Consul success', async () => {
      await consul.get(componentName)
      expect(consul.consul.kv.get).toHaveBeenCalledWith({ key: componentName + '/', recurse: true })
    })

    it('process Consul', () => {
      const consulValues: { Key: string; Value: string }[] = [
        {
          Key: componentName + '/config',
          Value: '{"web_port": 8081, "delay_timer": 12}'
        }
      ]
      const result = consul.process(consulValues)
      expect(result).toBe('{"web_port": 8081, "delay_timer": 12}')
    })
  })
})
