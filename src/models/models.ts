/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Socket } from 'net'
import { DetailedPeerCertificate, TLSSocket } from 'tls'
import { CIRAChannel } from '../amt/CIRAChannel'

export interface Device {
  connectionStatus: boolean
  mpsInstance: string
  hostname: string
  guid: string
  mpsusername: string
  tags: string[]
  tenantId: string
}
export interface Credentials {
  [key: string]: AMTCredential
}
export interface AMTCredential {
  name: string
  mpsuser: string
  mpspass: string
  amtuser: string
  amtpass: string
}
export type eventType = 'request' | 'success' | 'fail'
export interface OpenAMTEvent {
  type: eventType
  message: string
  methods: string[]
  guid: string
  timestamp: number
}

export interface CIRASocket extends TLSSocket{
  tag?: {
    first: boolean
    clientCert?: DetailedPeerCertificate
    accumulator: string
    activetunnels: number
    boundPorts: number[]
    socket: Socket
    host: string
    nextchannelid: number
    channels: {[key: string]: CIRAChannel}
    nextsourceport: number
    nodeid: string
    SystemId?: string // same as nodeid?
    MajorVersion?: Number
    MinorVersion?: Number
    certauth?: string
  }
}
export interface HealthCheck {
  db: HealthCheckStatus
  secretStore: HealthCheckStatus
}
export interface HealthCheckStatus{
  name: string
  status: any
}

export interface DeviceSecrets{
  AMT_PASSWORD: string
  MEBX_PASSWORD?: string
  MPS_PASSWORD?: string
}
