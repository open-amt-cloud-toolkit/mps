/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { configType, certificatesType } from './models/Config'
import { WebServer } from './server/webserver'
import { MPSServer } from './server/mpsserver'
import { logger as log } from './utils/logger'
import { Device } from './models/models'
import { ISecretManagerService } from './interfaces/ISecretManagerService'
import { IDB } from './interfaces/IDb'
import { MqttProvider } from './utils/mqttProvider'

export class MPSMicroservice {
  mpsserver: MPSServer
  webserver: WebServer
  config: configType
  certs: certificatesType
  mpsComputerList = {}
  db: IDB
  secrets: ISecretManagerService
  constructor (config: configType, db: IDB, secrets: ISecretManagerService, certs: certificatesType) {
    try {
      this.config = config
      this.db = db
      this.secrets = secrets
      this.certs = certs
    } catch (e) {
      log.error(`Exception in MPS Microservice: ${e}`)
    }
  }

  start (): void {
    this.webserver = new WebServer(this)
    this.mpsserver = new MPSServer(this)
  }

  async CIRAConnected (guid: string): Promise<void> {
    const device: Device = await this.db.devices.getByName(guid)
    device.connectionStatus = true
    device.mpsInstance = this.config.instance_name
    const results = await this.db.devices.update(device)
    if (results) {
      MqttProvider.publishEvent('success', ['CIRA_Connected'], 'CIRA Connection Established', guid)
      log.debug(`CIRA connection established for ${guid}`)
    } else {
      MqttProvider.publishEvent('fail', ['CIRA_Connected'], 'CIRA Connection Failed', guid)
      log.error(`Failed to update CIRA Connection established status in DB ${guid}`)
    }

    if (this.webserver) {
      this.webserver.notifyUsers({ host: guid, event: 'node_connection', status: 'connected' })
    }
  }

  async CIRADisconnected (guid: string): Promise<void> {
    const device: Device = await this.db.devices.getByName(guid)
    if (device != null) {
      device.connectionStatus = false
      device.mpsInstance = null
      const results = await this.db.devices.update(device)
      if (results) {
        log.debug(`Device connection status updated in db : ${guid}`)
      }
    }

    if (guid && this.mpsComputerList[guid]) {
      log.verbose(`delete mpsComputerList[${guid}]`)
      delete this.mpsComputerList[guid]
      if (this.webserver) {
        this.webserver.notifyUsers({
          host: guid,
          event: 'node_connection',
          status: 'disconnected'
        })
      }
      MqttProvider.publishEvent('fail', ['CIRA_Disconnected'], 'CIRA Connection Disconnected', guid)
      log.debug(`CIRA connection disconnected for device : ${guid}`)
    }
  }
}
