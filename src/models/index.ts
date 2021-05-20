/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
export interface Device {
  connectionStatus: number
  hostname: string
  guid: string
  metadata: DeviceMetadata | {}
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

export interface DeviceMetadata{
  guid: string
  tags: string[]
  hostname: string
}

export interface MPSConfig {
  use_allowlist: boolean
  common_name: string
  port: number
  username: string
  pass: string
  use_global_mps_credentials: boolean
  country: string
  company: string
  listen_any: boolean
  https: boolean
  tls_offload: boolean
  web_port: number
  generate_certificates: boolean
  alias_port?: number
  debug?: boolean
  logger_off: boolean
  secrets_path?: string
  data_path?: string
  cert_path: string
  cert_format: string
  vault_address?: string
  vault_token?: string
  debug_level: number
  jwt_secret: string
  jwt_issuer: string
  jwt_expiration: number
  web_admin_user: string
  web_admin_password: string
  mps_tls_config: any
  web_tls_config: any
  distributed_kv_name: string
  distributed_kv_ip?: string
  distributed_kv_port?: number
  startup_mode: string
  web_proxy_port: number
  network_adaptor: string
  tls_cert: string
  tls_cert_key: string
  tls_cert_ca: string
  web_tls_cert: string
  web_tls_cert_key: string
  web_tls_cert_ca: string
  cors_origin: string
  cors_headers: string
  cors_methods: string
  connection_string: string
}

export interface MPSCertificates {
  mps_tls_config: MPSCertConfig
  web_tls_config: WebCertConfig
}

export interface MPSCertConfig {
  cert: any
  key: any
  minVersion: any
  secureOptions?: any
  requestCert: boolean
  rejectUnauthorized: boolean
}

export interface WebCertConfig {
  ca: any
  cert: any
  key: any
  secureOptions?: any
}

export interface certAndKeyType {
  cert: any
  key: any
}

export interface directConfigType {
  ca: any
  cert: any
  key: any
  ciphers: string
  secureOptions?: any
  rejectUnauthorized: boolean
}

export interface QueryParams {
  host: string
  port: number
  p: number
  tls: number
  tls1only: number
}

export enum APFProtocol {
  UNKNOWN = 0,
  DISCONNECT= 1,
  SERVICE_REQUEST= 5,
  SERVICE_ACCEPT= 6,
  USERAUTH_REQUEST= 50,
  USERAUTH_FAILURE= 51,
  USERAUTH_SUCCESS= 52,
  GLOBAL_REQUEST= 80,
  REQUEST_SUCCESS= 81,
  REQUEST_FAILURE= 82,
  CHANNEL_OPEN= 90,
  CHANNEL_OPEN_CONFIRMATION= 91,
  CHANNEL_OPEN_FAILURE= 92,
  CHANNEL_WINDOW_ADJUST= 93,
  CHANNEL_DATA= 94,
  CHANNEL_CLOSE= 97,
  PROTOCOLVERSION= 192,
  KEEPALIVE_REQUEST= 208,
  KEEPALIVE_REPLY= 209,
  KEEPALIVE_OPTIONS_REQUEST= 210,
  KEEPALIVE_OPTIONS_REPLY= 211
}

export enum APFDisconnectCode{
  HOST_NOT_ALLOWED_TO_CONNECT= 1,
  PROTOCOL_ERROR= 2,
  KEY_EXCHANGE_FAILED= 3,
  RESERVED= 4,
  MAC_ERROR= 5,
  COMPRESSION_ERROR= 6,
  SERVICE_NOT_AVAILABLE= 7,
  PROTOCOL_VERSION_NOT_SUPPORTED= 8,
  HOST_KEY_NOT_VERIFIABLE= 9,
  CONNECTION_LOST= 10,
  BY_APPLICATION= 11,
  TOO_MANY_CONNECTIONS= 12,
  AUTH_CANCELLED_BY_USER= 13,
  NO_MORE_AUTH_METHODS_AVAILABLE= 14,
  INVALID_CREDENTIALS= 15,
  CONNECTION_TIMED_OUT= 16,
  BY_POLICY= 17,
  TEMPORARILY_UNAVAILABLE= 18
}

export enum APFChannelOpenFailCodes{
  ADMINISTRATIVELY_PROHIBITED= 1,
  CONNECT_FAILED= 2,
  UNKNOWN_CHANNEL_TYPE= 3,
  RESOURCE_SHORTAGE= 4,
}

export enum APFChannelOpenFailureReasonCode{
  AdministrativelyProhibited= 1,
  ConnectFailed= 2,
  UnknownChannelType= 3,
  ResourceShortage= 4,
}
