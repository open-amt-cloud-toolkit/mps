/*********************************************************************
* Copyright (c) Intel Corporation
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export interface configType {
  common_name: string
  port: number
  country: string
  company: string
  listen_any: boolean
  https?: boolean
  web_port: number
  generate_certificates: boolean
  secrets_path?: string
  data_path?: string
  cert_path: string
  cert_format: string
  vault_address?: string
  vault_token?: string
  mqtt_address?: string
  jwt_secret: string
  jwt_issuer: string
  jwt_expiration: number
  web_admin_user: string
  web_admin_password: string
  mps_tls_config: any
  web_tls_config: any
  tls_cert: string
  tls_cert_key: string
  tls_cert_ca: string
  web_tls_cert: string
  web_tls_cert_key: string
  web_tls_cert_ca: string
  db_provider: string
  connection_string: string
  instance_name: string
  redirection_expiration_time: number
  web_auth_enabled: boolean
}

export interface certificatesType {
  mps_tls_config: mpsConfigType
  web_tls_config: webConfigType
  root_key?: string
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

export interface queryParams {
  host: string
  port: number
  p: number
  tls: number
  tls1only: number
}

export class DataWithCount {
  data: any[]
  totalCount: number
}
