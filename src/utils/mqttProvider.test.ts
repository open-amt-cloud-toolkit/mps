/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { MqttProvider } from './MqttProvider'
import { Environment } from './Environment'
import { config } from '../test/helper/config'
import mqtt1 from 'mqtt'

beforeEach(() => {
  Environment.Config = JSON.parse(JSON.stringify(config))
})

describe('MQTT Turned ON Tests', () => {
  beforeEach(() => {
    Environment.Config.mqtt_address = 'mqtt://127.0.0.1:8883'
    MqttProvider.instance = new MqttProvider()
  })

  it('Creates MQTT Helper', async () => {
    expect(MqttProvider.instance.turnedOn).toBe(true)
    expect(MqttProvider.instance.mqttUrl).toBeDefined()
    expect(MqttProvider.instance.baseUrl).toBe('mqtt://127.0.0.1:8883')
    expect(MqttProvider.instance.port).toBe(8883)
    expect(MqttProvider.instance.options).toBeDefined()
    expect(MqttProvider.instance.options.port).toBe(8883)
    // TODO: update this to check string prefix
    expect(MqttProvider.instance.options.clientId).toBeDefined()
  })

  it('Checks Connection', () => {
    jest.spyOn(mqtt1, 'connect').mockImplementation(() => {
      return {
        connected: true
      } as any
    })

    expect(MqttProvider.instance.client).toBeUndefined()
    MqttProvider.instance.connectBroker()
    expect(MqttProvider.instance.client.connected).toBe(true)
  })

  it('Should send an event message when turned on', async () => {
    MqttProvider.instance.client = {
      publish: (topic, message, callback) => { return {} as any }
    } as any
    const spy = jest.spyOn(MqttProvider.instance.client, 'publish').mockImplementation((topic, message, callback) => {
      callback()
      return {} as any
    })
    MqttProvider.instance.turnedOn = true
    try {
      MqttProvider.publishEvent('success', ['testMethod'], 'Test Message')
      expect(spy).toHaveBeenCalled()
    } catch (err) {

    }
  })

  it('Should throw error when event message publish fails', async () => {
    MqttProvider.instance.client = {
      publish: (topic, message, callback) => { return {} as any }
    } as any
    const spy = jest.spyOn(MqttProvider.instance.client, 'publish').mockImplementation((topic, message, callback) => {
      callback(new Error())
      return {} as any
    })
    MqttProvider.instance.turnedOn = true
    try {
      MqttProvider.publishEvent('success', ['testMethod'], 'Test Message')
    } catch (err) {
      expect(spy).toHaveBeenCalled()
      expect(err).toBeDefined()
    }
  })

  it('Should close client when promted', async () => {
    const client = {
      connected: true,
      end: function () {
        this.connected = false
      }
    } as any
    MqttProvider.instance.client = client
    MqttProvider.instance.turnedOn = true
    MqttProvider.endBroker()
    expect(MqttProvider.instance.client.connected).toBe(false)
  })
})

describe('MQTT Turned OFF Tests', () => {
  let client
  beforeEach(() => {
    client = {
      connected: false,
      publish: function (topic, message, callback) { return {} as any },
      end: function () {
        this.connected = false
      }
    } as any
    Environment.Config.mqtt_address = ''
    MqttProvider.instance = new MqttProvider()
    expect(MqttProvider.instance.turnedOn).toBeFalsy()
    MqttProvider.instance.client = client
  })

  it('Should NOT Send an event message', async () => {
    const spy = jest.spyOn(client, 'publish')
    MqttProvider.publishEvent('success', ['testMethod'], 'Test Message')
    expect(spy).not.toHaveBeenCalled()
  })
  it('Should early exit the end()', async () => {
    const spy = jest.spyOn(client, 'end')
    MqttProvider.endBroker()
    expect(spy).not.toHaveBeenCalled()
    MqttProvider.instance = null
    MqttProvider.endBroker()
    expect(spy).not.toHaveBeenCalled()
  })
})
