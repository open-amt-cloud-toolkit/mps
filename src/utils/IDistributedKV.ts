/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Author: Vinay G
**********************************************************************/

import { Consul } from './consul'
import { MPSMicroservice } from '../mpsMicroservice'
import { KeyValueStore } from './constants'

export interface IDistributedKV {
  // Method to fetch the value from the key passed as arg
  lookup: (uuid: string) => Promise<string>
  updateKV: (uuid: string) => Promise<any>
  deleteKV: (uuid: string) => Promise<any>
  addEventWatch: () => any
}

// Factory method to create Distributed Key/Value pair class object
export function getDistributedKV (mpsservice: MPSMicroservice): IDistributedKV {
  // Create object for HashiCorp Consul
  if (mpsservice.config.distributed_kv_name === KeyValueStore.HashiCorpConsul) {
    return Consul.createObject(mpsservice)
  } else {
    throw (new Error('Unknown distributed KV store name.'))
  }
}
