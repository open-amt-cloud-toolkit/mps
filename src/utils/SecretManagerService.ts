/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Description: stores amt profiles
 * Author: Ramu Bachala
 **********************************************************************/

import { ISecretManagerService } from '../interfaces/ISecretManagerService'
import { certificatesType } from '../models/Config'
import NodeVault = require('node-vault')
import { Environment } from './Environment'
import { DeviceSecrets } from '../models/models'
import { ILogger } from '../interfaces/ILogger'
import { messages } from '../logging'

export class SecretManagerService implements ISecretManagerService {
  vaultClient: NodeVault.client
  secretsPath: string
  logger: ILogger
  constructor (logger: ILogger, vault?: any) {
    this.logger = logger
    this.secretsPath = Environment.Config.secrets_path
    if (vault) {
      this.vaultClient = vault
      return
    }

    const options: NodeVault.VaultOptions = {
      apiVersion: 'v1', // default
      endpoint: Environment.Config.vault_address, // default
      token: Environment.Config.vault_token // optional client token; can be fetched after valid initialization of the server
    }
    this.secretsPath = Environment.Config.secrets_path
    this.vaultClient = NodeVault(options)
  }

  async getSecretFromKey (path: string, key: string): Promise<string> {
    try {
      const fullPath = `${this.secretsPath}${path}`
      this.logger.verbose(`${messages.SECRET_MANAGER_GETTING_SECRET} ${fullPath}`)
      const data = await this.vaultClient.read(fullPath)
      this.logger.debug(`${messages.SECRET_MANAGER_RECEIVED_SECRET} ${fullPath}`)
      if (data.data.data[key] != null) {
        return data.data.data[key]
      }
    } catch (error) {
      this.logger.error(`${messages.SECRET_MANAGER_GET_SECRET_FROM_KEY_ERROR} error :`, error)
    }
    return null
  }

  async getSecretAtPath (path: string): Promise<any> {
    try {
      const fullPath = `${this.secretsPath}${path}`
      this.logger.verbose(`${messages.SECRET_MANAGER_SECRET_PATH}: ${fullPath}`)
      const data = await this.vaultClient.read(fullPath)
      this.logger.debug(`${messages.SECRET_MANAGER_DATA_FROM_SECRET_STORE}: ${fullPath}`)
      return data.data
    } catch (error) {
      this.logger.error(`${messages.SECRET_MANAGER_GET_SECRET_AT_PATH_ERROR} ${path} error :`, error)
      return null
    }
  }

  async writeSecretWithObject (path: string, data: any): Promise<boolean> {
    try {
      this.logger.verbose(messages.SECRET_MANAGER_WRITING_DATA_TO_SECRET_STORE)
      await this.vaultClient.write(`${this.secretsPath}${path}`, data)
      this.logger.debug(`${messages.SECRET_MANAGER_DATA_WRITTEN_TO_SECRET_STORE_SUCCESS}: ${path}`)
      return true
    } catch (error) {
      this.logger.error(`${messages.SECRET_MANAGER_WRITING_SECRETS_ERROR} :`, error)
      return false
    }
  }

  async getAMTCredentials (path: string): Promise<string[]> {
    const user = 'admin'
    const secret: {data: DeviceSecrets} = await this.getSecretAtPath(`devices/${path}`)
    if (secret == null) {
      return null
    }
    const amtpass: string = secret.data.AMT_PASSWORD
    return [user, amtpass]
  }

  async getMPSCerts (): Promise<certificatesType> {
    const secret: {data: certificatesType} = await this.getSecretAtPath('MPSCerts')
    if (secret == null) {
      return null
    }
    const certs: certificatesType = secret.data
    return certs
  }

  async health (): Promise<any> {
    const result = await this.vaultClient.health()
    return result
  }
}
