//Provides functions to abstract the interactions
//with mqtt

import url from 'url'
import { configType } from '../models/Config';
import { OpenAMTEvent } from '../models/models';
import { logger as log } from './logger'
var mqtt = require('mqtt')

const messageTypes:string[] = ['request', 'success', 'fail']

export class mqttProvider {
    client: any
    turnedOn: boolean

    constructor (config: configType) {

        if (config.mqtt_address.toLocaleLowerCase() == 'off') {
            this.turnedOn = false
            console.log("Mosquitto is turned off")
        } else {
            this.turnedOn = true
            var mqtt_url = url.parse(config.mqtt_address);
            var myUrl = "mqtt://" + mqtt_url.host;
            var options = {
                port: mqtt_url.port,
                clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
                //username: auth[0],
                //password: auth[1],
            }

            this.client = mqtt.connect(myUrl, options);

            this.client.publish('mps', 'Client Connected: ' + Date.now(), function() {
                console.log("Connect message published");
            });
        }
    }


    async getClient(): Promise<any> {
        return this.client
    }

    message(message: OpenAMTEvent) {
        if (this.turnedOn) {
            //Enforce message type names
            if (messageTypes.includes(message.type)) {
                message.timestamp = Date.now()
                this.client.publish('mps/events', JSON.stringify(message), function() {
                    console.log("Message published");
                })
            } else  {
                log.error('Invalid message type: ' + message.type + '\nValid types names are: ' + messageTypes);
                this.client.publish('mps/events', 'Invalid Message Attempted', function() {
                    console.log("Error message published");
                })
            }
        }   
    }

    end() {
        this.client.end()
    }

    test() {
        if (this.turnedOn) {
            this.client.publish('mps/test', 'Test message', function() {
                console.log("Message connect is published");
            });
        }
    }
}