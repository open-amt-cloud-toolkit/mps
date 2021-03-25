/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Author: Vinay G
**********************************************************************/

import { configType } from '../models/Config'
import { IDistributedKV } from './IDistributedKV'
import { logger as log } from './logger'
import { MPSMicroservice } from '../mpsMicroservice'
import { MpsProxy } from '../server/proxies/MpsProxy'
import * as os from 'os'
import { DefaultNetworkingAdaptor } from './constants'
import consulClient from 'consul'

// Class for HashiCorp consul
export class Consul implements IDistributedKV {
  private readonly config: configType
  private mpsService: MPSMicroservice
  private static instance: IDistributedKV = null
  private readonly consul
  private connectedDevices: any = {}
  private disconnectedDevices: any = {}

  private constructor (mpsservice: MPSMicroservice) {
    this.config = mpsservice.config
    this.mpsService = mpsservice
    this.consul = consulClient({ host: this.config.distributed_kv_ip, port: this.config.distributed_kv_port })
  }

  static createObject (mpsservice: MPSMicroservice): IDistributedKV {
    if (!Consul.instance) {
      log.silly('Create Consul Object')
      Consul.instance = new Consul(mpsservice)
      return Consul.instance
    } else {
      log.silly('return already created Consul Object')
      return Consul.instance
    }
  }

  // add watch to consul
  addEventWatch (): void {
    // Get an update from consul for event [device conn/disconn]
    let updateFirstTimeCall = true
    let deleteFirstTimeCall = true

    // add consul watch on event name 'update'
    const watchUpdate = this.consul.watch({
      method: this.consul.event.list,
      options: { type: 'event', name: 'update' },
      backoffFactor: 1000
    })
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this

    // handle event on 'update' from server
    watchUpdate.on('change', async function (data, res) {
      if (data === 'undefined') {
        log.error('consul watchUpdate.on change data undefined')
      } else {
        // When we receive event list first time
        // there may be devices connected over to the mpsServer
        // so we need to go through the complete list to find out
        // the lastest event for the device.
        if (updateFirstTimeCall) {
          log.silly(`number of events received for update event: ${data.length}`)
          // reset flag
          updateFirstTimeCall = false

          // go over the received event list from the last
          for (let index = data.length - 1; index >= 0; --index) {
            const recvObject = JSON.parse(data[index].Payload)
            log.silly(`interate over the data Object:${index} for guid:${recvObject.guid}`)

            // check if an event is already received for this device
            // do nothing else populate in connectedDevices
            if (((typeof that.connectedDevices === 'undefined') ||
                            (typeof that.connectedDevices[recvObject.guid] === 'undefined'))) {
              log.silly(`this is latest event for the device ${recvObject.guid}`)

              // if the entry not there in disconnectedDevices
              // go update in connectedDevices
              if ((that.disconnectedDevices == null) || that.disconnectedDevices[recvObject.guid] == null) {
                // update the connectedDevices with Server IP and timestamp
                log.silly(`entry for ${recvObject.guid} do not exist in disconnectedDevices`)
                const reqObject = {
                  serverIP: recvObject.serverIP,
                  timeStamp: recvObject.timeStamp
                }
                log.silly(`populate the connectedDevices with IP:${recvObject.serverIP} and timestamp:${recvObject.timeStamp}`)
                that.connectedDevices[recvObject.guid] = reqObject
                log.silly(`create socket for ${recvObject.guid}`)
                await MpsProxy.getSocketForGuid(recvObject.guid, that.mpsService)
              } else {
                // this is already present in disconnectedDevices
                // check time stamp so see which is latest
                log.silly(`entry for ${recvObject.guid} is present in disconnectedDevices`)
                // if the event is not latest in disconnectedDevices
                // then update connectedDevices
                if (that.disconnectedDevices[recvObject.guid].timeStamp < recvObject.timeStamp) {
                  // update the connectedDevices with Server IP and timestamp
                  log.silly('timeStamp received is later than in disconnectedDevices')
                  const reqObject = {
                    serverIP: recvObject.serverIP,
                    timeStamp: recvObject.timeStamp
                  }
                  log.silly(`populate ${recvObject.guid} in connectedDevices with IP:${recvObject.serverIP} timeStamp:${recvObject.timeStamp}}`)

                  that.connectedDevices[recvObject.guid] = reqObject
                  log.silly(`create socket for ${recvObject.guid}`)
                  await MpsProxy.getSocketForGuid(recvObject.guid, that.mpsService)
                  // delete entry from disconnectedDevices
                  delete that.disconnectedDevices[recvObject.guid]
                }
              }
            }
          }
          // populate mpsService.mpsComputerList from connectedDevices
          for (const index in that.connectedDevices) {
            log.silly(`connectedDevices[${index}]`)
            let computerEntry = {
              host: undefined,
              amtuser: undefined
            }
            if (typeof that.mpsService.mpsComputerList[index] !== 'undefined') {
              log.silly(`already in mpsComputerList: ${that.mpsService.mpsComputerList[index]}`)
            } else {
              log.silly('populate in mpsComputerList')
              computerEntry = {
                host: index,
                amtuser: 'admin'
              }
              that.mpsService.mpsComputerList[index] = computerEntry
            }
          }
        } else {
        // if we receive the event while running then
        // pick the last event and process it. [we can discard the older events
        // as we have already would have taken care of them]
          log.silly(`received update event length: ${data.length}`)
          const recvObject = JSON.parse(data[data.length - 1].Payload)

          // for connected event populate the guid in mpsService.mpsComputerList
          // and call mpsService.CIRAConnected
          log.info(`received connected event for guid(${recvObject.guid}) for server(${recvObject.serverIP})`)

          // if this guid is in disconnectedDevices then delete the
          // entry and add to connectedDevices
          if (((typeof that.disconnectedDevices !== 'undefined') &&
                        (typeof that.disconnectedDevices[recvObject.guid] !== 'undefined'))) {
            log.silly(`delete the entry from disconnectedDevices for ${recvObject.guid}`)
            delete that.disconnectedDevices[recvObject.guid]
          }
          // update the connectedDevices with Server IP and timestamp
          const reqObject = {
            serverIP: recvObject.serverIP,
            timeStamp: recvObject.timeStamp
          }
          that.connectedDevices[recvObject.guid] = reqObject
          log.silly(`create socket for ${recvObject.guid}`)
          await MpsProxy.getSocketForGuid(recvObject.guid, that.mpsService)

          // update mpsComputerList
          let computerEntry = {
            host: undefined,
            amtuser: undefined
          }
          if (typeof that.mpsService.mpsComputerList[recvObject.guid] !== 'undefined') {
            log.silly('already in mpsComputerList')
          } else {
            log.silly('populate in mpsComputerList')
            computerEntry = {
              host: recvObject.guid,
              amtuser: 'admin'
            }
            that.mpsService.mpsComputerList[recvObject.guid] = computerEntry
          }
          that.mpsService.CIRAConnected(recvObject.guid)
        }

        for (const index in that.connectedDevices) {
          log.silly(`from update event watch: connectedDevices[${index}]`)
        }
        for (const index in that.disconnectedDevices) {
          log.silly(`from update event watch: disconnectedDevices[${index}]`)
        }
      }
    })

    watchUpdate.on('error', function (err) {
      log.error('error: watchUpdate', err)
    })

    // for disconnection
    const watchDelete = this.consul.watch({
      method: this.consul.event.list,
      options: { type: 'event', name: 'delete' },
      backoffFactor: 1000
    })

    // handle 'delete' event from consul
    watchDelete.on('change', function (data, res) {
      if (data === 'undefined') {
        log.silly('delete on change empty data')
      } else {
        log.silly(`consul called on delete with: ${JSON.stringify(data)}`)
        // When we receive event list first time
        // there may be devices connected or disconnected over to the mpsServer
        // so we need to go through the complete list to find out
        // the lastest event for the device.
        if (deleteFirstTimeCall) {
          log.silly(`number of events received for delete: ${data.length}`)
          // reset flag
          deleteFirstTimeCall = false

          // go over the received event list from the last
          for (let index = data.length - 1; index >= 0; --index) {
            const recvObject = JSON.parse(data[index].Payload)
            log.silly(`interate over the data Object:${index} for guid:${recvObject.guid}`)

            // check if an event is already received for this device
            // do nothing else populate in disconnectedDevices
            if (((typeof that.disconnectedDevices === 'undefined') ||
                            (typeof that.disconnectedDevices[recvObject.guid] === 'undefined'))) {
              log.silly(`this is latest event for the device ${recvObject.guid}`)

              // if the entry is not there in connectedDevices so go
              // update in disconnectedDevices
              if ((typeof that.connectedDevices === 'undefined') ||
                                (typeof that.connectedDevices[recvObject.guid] === 'undefined')) {
                // update the connectedDevices with Server IP and timestamp
                log.silly(`no entry for connectedDevices[${recvObject.guid}]`)
                const reqObject = {
                  serverIP: recvObject.serverIP,
                  timeStamp: recvObject.timeStamp
                }
                log.silly(`add entry for disconnectedDevices[${recvObject.guid}]`)

                that.disconnectedDevices[recvObject.guid] = reqObject
              } else {
              // this is already present in connectedDevices
              // check time stamp so see which is latest
                log.silly(`${recvObject.guid} exists in connectedDevices`)
                // if the latest event is not latest in connectedDevices
                // then update disconnectedDevices
                if (that.connectedDevices[recvObject.guid].timeStamp < recvObject.timeStamp) {
                  // update the connectedDevices with Server IP and timestamp
                  log.silly(`timeStamp received for ${recvObject.guid} is latest`)
                  const reqObject = {
                    serverIP: recvObject.serverIP,
                    timeStamp: recvObject.timeStamp
                  }

                  that.disconnectedDevices[recvObject.guid] = reqObject
                  // delete the entry from connectedDevices
                  delete that.connectedDevices[recvObject.guid]
                }
              }
            }
          }

          // update mpsService.mpsComputerList from connectedDevices
          if (typeof that.mpsService.mpsComputerList !== 'undefined') {
            log.silly('mpsComputerList is not empty')
            delete that.mpsService.mpsComputerList
            that.mpsService.mpsComputerList = {}
          }
          for (const index in that.connectedDevices) {
            log.silly(`connectedDevices[${index}]`)
            let computerEntry = {
              host: undefined,
              amtuser: undefined
            }
            if (typeof that.mpsService.mpsComputerList[index] !== 'undefined') {
              log.silly('already in mpsComputerList')
            } else {
              log.silly('populate in mpsComputerList')
              computerEntry = {
                host: index,
                amtuser: 'admin'
              }
              that.mpsService.mpsComputerList[index] = computerEntry
            }
          }
        } else {
        // if we receive the event while running then
        // pick the last event and process it. [we can discard the older events
        // as we have already would have taken care of them]
          log.silly(`change dataPayload: ${data[data.length - 1].Payload}`)
          const recvObject = JSON.parse(data[data.length - 1].Payload)

          // for connected event populate the guid in mpsService.mpsComputerList
          // and call mpsService.CIRAConnected
          log.info(`received disconnected event for guid(${recvObject.guid}) for server(${recvObject.serverIP})`)

          // if this guid is in connectedDevices then delete the
          // entry and add to disconnectedDevices
          if (((typeof that.connectedDevices !== 'undefined') &&
                        (typeof that.connectedDevices[recvObject.guid] !== 'undefined'))) {
            log.silly(`delete the entry from connectedDevices for ${recvObject.guid}`)
            delete that.connectedDevices[recvObject.guid]
          }
          // update the disconnectedDevices with Server IP and timestamp
          const reqObject = {
            serverIP: recvObject.serverIP,
            timeStamp: recvObject.timeStamp
          }
          that.disconnectedDevices[recvObject.guid] = reqObject

          // call mpsService.CIRADisconnected to update mpsComputerList
          that.mpsService.CIRADisconnected(recvObject.guid)
        }
        for (const index in that.connectedDevices) {
          log.silly(`delete event watch: connectedDevices[${index}]`)
        }
        for (const index in that.disconnectedDevices) {
          log.silly(`delete event watch: disconnectedDevices[${index}]`)
        }
      }
    })

    watchDelete.on('error', function (err) {
      log.error(`error: watchDelete, ${err}`)
    })
  }

  // Method to fetch the value from the key passed as arg
  async lookup (uuid: string): Promise<string> {
    // Make call to HashiCorp Consul Server
    return await new Promise((resolve, reject) => {
      if (this.connectedDevices[uuid] !== 'undefined') {
        log.silly(`consul called lookup with: ${JSON.stringify(this.connectedDevices[uuid])} `)
        resolve(this.connectedDevices[uuid].serverIP)
      } else {
        reject(new Error(`consul lookup key not found for ${uuid}`))
      }
    })
  }

  getIpAddress (): any {
    const ifaces = os.networkInterfaces()

    let ipAddress

    let desiredInterface: string = DefaultNetworkingAdaptor

    if (this.config?.network_adaptor) {
      desiredInterface = this.config.network_adaptor
      log.silly(`looking for configured network adaptor: ${desiredInterface}`)
    } else {
      log.warn(`looking for default network adaptor: ${desiredInterface}`)
    }

    Object.keys(ifaces).forEach(function (ifname) {
      let alias = 0

      ifaces[ifname].forEach(function (iface) {
        if (iface.family !== 'IPv4' || iface.internal) {
          log.silly(`skipping over ${JSON.stringify(iface)}`)
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return
        }

        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          log.silly(ifname + ':' + alias, iface.address)
        } else {
          log.silly(`found network interface: ${ifname}: ${iface.address}`)
          // this interface has only one ipv4 adress

          if (!ipAddress) {
            if (iface?.address?.startsWith(desiredInterface)) {
              log.debug(`using network interface: ${ifname}: ${iface.address}`)
              ipAddress = iface.address
            } else if (ifname === desiredInterface) {
              log.debug(`using network interface: ${ifname}: ${iface.address}`)
              ipAddress = iface.address
            }
          }
        }
        ++alias
      })
    })

    if (!ipAddress) {
      log.error(`no ip address found for interface: ${desiredInterface}`)
    }

    return ipAddress
  }

  // Register the UUID as Consul Key and Server IP as the value
  async updateKV (guid: string): Promise<any> {
    return await new Promise((resolve, reject) => {
      const serverIP = this.getIpAddress()
      log.silly(`IP Address from OS Interface: ${serverIP}`)
      // set Value for key:guid on HashiCorp Consul Server
      this.consul.kv.set(guid, serverIP, function (err, result) {
        if (err) {
          log.error(`error updating Consul server for ${guid}`)
          reject(err)
        }
      })
      log.silly(`updated Consul server for guid:${guid} serverIP:${serverIP}`)

      const timeStamp = Date.now()
      const objToSend = { guid, serverIP, timeStamp }
      // fire event for device guid on HashiCorp Consul Server
      this.consul.event.fire('update',
        JSON.stringify(objToSend),
        function (err, result) {
          if (err) {
            log.error(`error event.fire for ${guid} on Consul server`)
            reject(err)
          }
        })
      resolve('updating consul server for KV and send update event:done')
    })
  }

  // delete KV entry from Consul Server
  async deleteKV (guid: string): Promise<any> {
    // Make call to HashiCorp Consul Server
    return await new Promise((resolve, reject) => {
      // delete Value for key:guid on HashiCorp Consul Server
      this.consul.kv.del(guid, function (err) {
        if (err) {
          log.error(`error deleting KV pair for ${guid} in Consul server`)
          reject(err)
        }
      })
      log.silly(`deleted Consul Server with key ${guid}`)

      const serverIP = this.getIpAddress() // this.config.common_name;
      const timeStamp = Date.now()
      const objToSend = { guid, serverIP, timeStamp }
      // fire event for device guid on HashiCorp Consul Server
      this.consul.event.fire('delete',
        JSON.stringify(objToSend),
        function (err, result) {
          if (err) {
            log.error(`error event.fire for ${guid} on Consul server`)
            reject(err)
          }
        })
      resolve('deleting KV pair and fire delete event on consul server:done')
    })
  }
}
