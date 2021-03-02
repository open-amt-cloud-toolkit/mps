/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: config type definitions
**********************************************************************/

export interface configType {
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
  use_vault?: boolean
  use_db?: boolean
  vault_address?: string
  vault_token?: string
  debug_level: number
  web_admin_user: string
  web_admin_password: string
  mps_tls_config: any
  web_tls_config: any
  session_encryption_key: string
  mpsxapikey: string
  auth_enabled?: boolean
  cors_origin: string
  cors_headers: string
  cors_methods: string
  connection_string: string
}

export interface certificatesType {
  mps_tls_config: mpsConfigType
  web_tls_config: webConfigType
}

export interface mpsConfigType {
  cert: any
  key: any
  minVersion: any
  secureOptions?: any
  requestCert: boolean
  rejectUnauthorized: boolean
}

export interface webConfigType {
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

export interface apiResponseType {
  statuscode: number
  payload: any
}
