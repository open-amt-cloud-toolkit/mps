/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import { Device } from '../models/models'

export function mapToDevice (result): Device {
  return {
    guid: result.guid,
    hostname: result.hostname,
    tags: result.tags,
    mpsInstance: result.mpsinstance,
    connectionStatus: result.connectionstatus
  }
}
