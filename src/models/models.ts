/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
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
