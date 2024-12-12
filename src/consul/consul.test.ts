/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import type Consul from 'consul'
import { ConsulService } from './consul.js'
import { config } from './../test/helper/config.js'
import { jest } from '@jest/globals'
import { spyOn } from 'jest-mock'
const consulService: ConsulService = new ConsulService('localhost', 8500)
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

    consulService.consul.kv = {
      set: jest.fn(),
      get: jest.fn()
    } as any
  })

  describe('ConsulService', () => {
    it('get Consul health', async () => {
      const spyHealth = spyOn(consulService, 'health')
      await consulService.health(serviceName)
      expect(spyHealth).toHaveBeenCalledWith('consul')
    })
    it('seed Consul success', async () => {
      const result = await consulService.seed(componentName, config)
      expect(result).toBe(true)
      expect(consulService.consul.kv.set).toHaveBeenCalledWith(
        componentName + '/config',
        JSON.stringify(config, null, 2)
      )
    })
    it('seed Consul failure', async () => {
      spyOn(consulService.consul.kv, 'set').mockRejectedValue(new Error())
      let result
      try {
        result = await consulService.seed(componentName, config)
      } catch (err) {
        expect(result).toBe(false)
      }
    })

    it('get from Consul success', async () => {
      await consulService.get(componentName)
      expect(consulService.consul.kv.get).toHaveBeenCalledWith({ key: componentName + '/', recurse: true })
    })

    it('process Consul', () => {
      const consulValues: { Key: string; Value: string }[] = [
        {
          Key: componentName + '/config',
          Value: '{"web_port": 8081, "delay_timer": 12}'
        }
      ]
      const result = consulService.process(consulValues)
      expect(result).toBe('{"web_port": 8081, "delay_timer": 12}')
    })
  })
})
