/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { type CIRASocket } from '../models/models'
import { ConnectedDevice } from './ConnectedDevice'

const socket: CIRASocket = null

describe('Connected Device', () => {
  it('should initialize', () => {
    const device = new ConnectedDevice(socket, 'admin', 'P@ssw0rd')
    expect(device.ciraSocket).toBeNull()
    expect(device.httpHandler).toBeDefined()
  })
})
