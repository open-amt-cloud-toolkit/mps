/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import Bottleneck from 'bottleneck'
import { type CIRASocket } from '../models/models'
import { HttpHandler } from './HttpHandler'

export class ConnectedDevice {
  httpHandler: HttpHandler
  ciraSocket: CIRASocket
  limiter: Bottleneck
  kvmConnect: boolean
  tenantId: string

  constructor (ciraSocket: CIRASocket, readonly username: string, readonly password: string, tenantId: string, httpHandler: HttpHandler = new HttpHandler(), kvmConnect: boolean = false, limiter: Bottleneck = new Bottleneck({
    maxConcurrent: 3,
    minTime: 250
  })) {
    this.ciraSocket = ciraSocket
    this.httpHandler = httpHandler
    this.kvmConnect = kvmConnect
    this.tenantId = tenantId
    this.limiter = limiter
  }
}
