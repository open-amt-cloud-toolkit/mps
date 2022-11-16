/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import Bottleneck from 'bottleneck'
import { CIRASocket } from '../models/models'
import { HttpHandler } from './HttpHandler'

export class ConnectedDevice {
  httpHandler: HttpHandler
  ciraSocket: CIRASocket
  limiter: Bottleneck
  kvmConnect: boolean

  constructor (ciraSocket: CIRASocket, readonly username: string, readonly password: string) {
    this.ciraSocket = ciraSocket
    this.httpHandler = new HttpHandler()
    this.kvmConnect = false
    this.limiter = new Bottleneck({
      maxConcurrent: 3,
      minTime: 250
    })
  }
}
