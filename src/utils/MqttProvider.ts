import url from 'url'
import { eventType, OpenAMTEvent } from '../models/models'
import { logger as log } from './logger'
import { MqttClient, connect } from 'mqtt'
import { Environment } from './Environment'
// Provides functions to abstract the interactions
// with mqtt broker
export class MqttProvider {
  client: MqttClient
  turnedOn: boolean
  mqttUrl: url.URL
  baseUrl: string
  port: number
  options: any

  static instance: MqttProvider

  constructor () {
    if (!Environment.Config.mqtt_address) {
      this.turnedOn = false
      log.info('MQTT is turned off')
    } else {
      this.turnedOn = true
      this.mqttUrl = new url.URL(Environment.Config.mqtt_address)
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

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  // Return type is any to get around the linter - Rule : no-floating-promises
  // Publish event is meant to be fire and forget
  static publishEvent (type: eventType, methods: string[], message: string, guid?: string): any {
    // Block message if mqtt option is off
    if (!MqttProvider.instance?.turnedOn) return

    const event: OpenAMTEvent = {
      type: type,
      message: message,
      methods: methods,
      guid: guid,
      timestamp: Date.now()
    }

    // Enforce message type names before publishing
    return new Promise((resolve, reject) => {
      MqttProvider.instance.client.publish('mps/events', JSON.stringify(event), function (err) {
        if (err == null) {
          log.debug('Event message published')
          resolve(null)
        } else {
          log.error('Event message failed')
          reject(new Error('Event message failed: ' + err.message))
        }
      })
    }).catch((error) => {
      log.error(`Event message failed: ${error}`)
    })
  }

  static endBroker (): void {
    if (!MqttProvider.instance?.turnedOn) return

    MqttProvider.instance.client = MqttProvider.instance.client.end()
    log.info('MQTT client closed')
  }
}
