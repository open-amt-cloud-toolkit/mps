/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import Bottleneck from 'bottleneck'
import { type CIRASocket } from '../models/models.js'
import { HttpHandler } from './HttpHandler.js'

export class ConnectedDevice {
  httpHandler: HttpHandler
  ciraSocket: CIRASocket
  limiter: Bottleneck
  kvmConnect: boolean
  solConnect: boolean
  iderConnect: boolean
  tenantId: string
  lastKeepAlive: Date

  constructor(
    ciraSocket: CIRASocket,
    readonly username: string,
    readonly password: string,
    tenantId: string,
    httpHandler: HttpHandler = new HttpHandler(),
    kvmConnect = false,
    limiter: Bottleneck = new Bottleneck({
      maxConcurrent: 3,
      minTime: 250
    }),
    solConnect = false,
    iderConnect = false
  ) {
    this.ciraSocket = ciraSocket
    this.httpHandler = httpHandler
    this.kvmConnect = kvmConnect
    this.tenantId = tenantId
    this.limiter = limiter
    this.solConnect = solConnect
    this.iderConnect = iderConnect
  }
}
