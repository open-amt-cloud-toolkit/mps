// Provides functions to abstract the interactions
// with mqtt

import url from 'url'
import { configType } from '../models/Config'
import { OpenAMTEvent } from '../models/models'
import { logger as log } from './logger'
import * as mqtt from 'mqtt'

const messageTypes: string[] = ['request', 'success', 'fail']

export class MqttProvider {
  client: mqtt.MqttClient
  turnedOn: boolean

  constructor (config: configType) {
    if (!config.mqtt_address) {
      this.turnedOn = false
      log.info('Mosquitto is turned off')
    } else {
      this.turnedOn = true
      const mqttUrl = new url.URL(config.mqtt_address)
      const myUrl = 'mqtt://' + mqttUrl.host
      const myPort: number = +mqttUrl.port
      const options = {
        port: myPort,
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8)
        // username: auth[0],
        // password: auth[1],
      }

      this.client = mqtt.connect(myUrl, options)

      this.client.publish('mps', 'Client Connected: ' + Date.now(), function () {
        log.info('Connect message published')
      })
    }
  }

  async getClient (): Promise<any> {
    return this.client
  }

  async publishEvent (type: string, methods: string[], message: string, guid?: string): Promise<void> {
    // Block message if mqtt option is off
    if (!this.turnedOn) return

    const event: OpenAMTEvent = {
      type: type,
      message: message,
      methods: methods,
      guid: guid,
      timestamp: Date.now()
    }

    // Enforce message type names before publishing
    if (messageTypes.includes(event.type)) {
      return await new Promise((resolve, reject) => {
        this.client.publish('mps/events', JSON.stringify(event), function () {
          log.info('Event message published')
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        log.error('Invalid message type: ' + event.type + '\nValid types names are: ' + messageTypes)
        this.client.publish('mps/events', 'Invalid Message Attempted', function () {
          log.info('Error message published')
        })
      })
    }
  }

  end (): void {
    log.info('MQTT client closed')
    this.client.end()
  }

  test (): void {
    if (this.turnedOn) return

    this.client.publish('mps/test', 'Test message', function () {
      log.info('Message connect is published')
    })
  }
}
