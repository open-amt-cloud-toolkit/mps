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
  solConnect: boolean
  iderConnect: boolean
  tenantId: string
  lastKeepAlive: Date

  constructor (
    ciraSocket: CIRASocket,
    readonly username: string,
    readonly password: string,
    tenantId: string,
    httpHandler: HttpHandler = new HttpHandler(),
    kvmConnect: boolean = false,
    limiter: Bottleneck = new Bottleneck({
      maxConcurrent: 3,
      minTime: 250
    }),
    solConnect: boolean = false,
    iderConnect: boolean = false
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
