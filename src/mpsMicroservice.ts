/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { configType, certificatesType } from './models/Config'
import { WebServer } from './server/webserver'
import { MPSServer } from './server/mpsserver'
import { logger as log } from './utils/logger'
import { IDbProvider } from './models/IDbProvider'
import { getDistributedKV } from './utils/IDistributedKV'
import { MpsProxy } from './server/proxies/MpsProxy'
import { CiraConnectionFactory } from './CiraConnectionFactory'
import { CiraChannelFactory } from './CiraChannelFactory'
import { MPSMode } from './utils/constants'
import { DeviceDb } from './db/device'
import { Device } from './models/models'
import { Environment } from './utils/Environment'
export class MPSMicroservice {
  mpsserver: MPSServer
  webserver: WebServer
  config: configType
  certs: certificatesType
  debugLevel: number = 1
  mpsComputerList = {}
  db: IDbProvider
  ciraConnectionFactory: CiraConnectionFactory
  ciraChannelFactory: CiraChannelFactory
  deviceDb: DeviceDb
  constructor (config: configType, db: IDbProvider, certs: certificatesType) {
    try {
      this.config = config
      this.debugLevel = config.debug_level
      this.db = db
      this.certs = certs
    } catch (e) {
      log.error(`Exception in MPS Microservice: ${e}`)
    }
  }

  start (): void {
    this.deviceDb = new DeviceDb()
    if (this.config.startup_mode === MPSMode.Standalone) {
      this.webserver = new WebServer(this)
      this.mpsserver = new MPSServer(this)
      this.ciraConnectionFactory = new CiraConnectionFactory(async (hostGuid) => this.mpsserver.ciraConnections[hostGuid])
      this.ciraChannelFactory = new CiraChannelFactory((socket, port) => this.mpsserver.SetupCiraChannel(socket, port))
    } else if (this.config.startup_mode === MPSMode.WEB) { // Running in distributed mode
      this.webserver = new WebServer(this)
      getDistributedKV(this).addEventWatch()
      this.ciraConnectionFactory = new CiraConnectionFactory(async (hostGuid) => {
        const mpsProxy = await MpsProxy.getSocketForGuid(hostGuid, this)
        mpsProxy.nodeid = hostGuid
        return mpsProxy
      })
      this.ciraChannelFactory = new CiraChannelFactory((mpsProxy, port) => mpsProxy.SetupCiraChannel(port, mpsProxy.nodeid)) // here socket passed would be Mps Proxy
    } else if (this.config.startup_mode === MPSMode.MPS) { // Running in distributed mode
      this.mpsserver = new MPSServer(this) // MPS only takes in connections from web or devices. so no need to have a connection or channel factory
    } else {
      log.error('Unknown startup mode. Exiting.')
      process.exit(1)
    }
  }

  async CIRAConnected (guid: string): Promise<void> {
    // ToDo: Check if the device doesn't exist
    if (this.deviceDb != null) {
      const device: Device = await this.deviceDb.getById(guid)
      device.connectionStatus = true
      device.mpsInstance = Environment.Config.instance_name
      const results = await this.deviceDb.update(device)
      if (results) {
        log.info(`CIRA connection established for ${guid}`)
      } else {
        log.info(`Failed to update CIRA Connection established status in DB ${guid}`)
      }
    }
    if (this.config.startup_mode === MPSMode.MPS) {
      // update DistributedKV with key as device UUID
      // and value as Server IP.f
      getDistributedKV(this).updateKV(guid).then((v) => log.debug(v)).catch((reason) => log.error(reason))
    } else if (this.config.startup_mode === MPSMode.WEB) {
      MpsProxy.getSocketForGuid(guid, this).catch(err => {
        log.error(`failed to get socket for guid: ${guid}, result: ${err}`)
      })
    }

    if (this.webserver) {
      this.webserver.notifyUsers({ host: guid, event: 'node_connection', status: 'connected' })
    }
  }

  async CIRADisconnected (guid: string): Promise<void> {
    if (this.deviceDb != null) {
      const device: Device = await this.deviceDb.getById(guid)
      device.connectionStatus = false
      device.mpsInstance = null
      const results = await this.deviceDb.update(device)
      if (results) {
        log.info(`Main:CIRA connection closed for ${guid}`)
      } else {
        log.info(`Failed to update CIRA Connection closed status in DB ${guid}`)
      }
    }

    if (this.config.startup_mode === MPSMode.MPS) {
      // delete the KV pair in DistributedKV
      getDistributedKV(this).deleteKV(guid).then((v) => log.debug(v)).catch((reason) => log.error(reason))
    } else if (this.config.startup_mode === MPSMode.WEB) {
      if (MpsProxy.proxies[guid]) {
        log.silly('Cleaning up MpsProxy.proxies entry.')
        delete MpsProxy.proxies[guid]
      }
    }

    if (guid && this.mpsComputerList[guid]) {
      log.silly(`delete mpsComputerList[${guid}]`)
      delete this.mpsComputerList[guid]
      if (this.webserver) {
        this.webserver.notifyUsers({
          host: guid,
          event: 'node_connection',
          status: 'disconnected'
        })
      }
    }
  }
}
