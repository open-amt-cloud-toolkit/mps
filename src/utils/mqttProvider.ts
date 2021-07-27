// Provides functions to abstract the interactions
// with mqtt broker

import url from 'url'
import { configType } from '../models/Config'
import { eventType, OpenAMTEvent } from '../models/models'
import { logger as log } from './logger'
import { MqttClient, connect } from 'mqtt'

export class MqttProvider {
  client: MqttClient
  turnedOn: boolean
  mqttUrl: url.URL
  baseUrl: string
  port: number
  options: any

  static instance: MqttProvider

  constructor (config: configType) {
    if (!config.mqtt_address) {
      this.turnedOn = false
      log.info('MQTT is turned off')
    } else {
      this.turnedOn = true
      this.mqttUrl = new url.URL(config.mqtt_address)
      this.baseUrl = 'mqtt://' + this.mqttUrl.host
      this.port = +this.mqttUrl.port
      this.options = {
        port: this.port,
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8)
        // username: auth[0],
        // password: auth[1],
      }
    }
  }

  connectBroker (): void {
    if (!this.turnedOn) return

    this.client = connect(this.baseUrl, this.options)
    MqttProvider.instance = this
  }

  static async publishEvent (type: eventType, methods: string[], message: string, guid?: string): Promise<void> {
    // Block message if mqtt option is off
    if (!MqttProvider.instance.turnedOn) return

    const event: OpenAMTEvent = {
      type: type,
      message: message,
      methods: methods,
      guid: guid,
      timestamp: Date.now()
    }

    // Enforce message type names before publishing
    return await new Promise((resolve, reject) => {
      MqttProvider.instance.client.publish('mps/events', JSON.stringify(event), function (err) {
        if (err == null) {
          log.debug('Event message published')
          resolve()
        } else {
          log.error('Event message failed')
          reject(new Error('Event message failed: ' + err.message))
        }
      })
    })
  }

  static endBroker (): void {
    if (!MqttProvider.instance.turnedOn) return

    MqttProvider.instance.client = MqttProvider.instance.client.end()
    log.info('MQTT client closed')
  }
}
