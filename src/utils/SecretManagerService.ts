/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Description: stores amt profiles
 * Author: Ramu Bachala
 **********************************************************************/

import { ISecretManagerService } from '../interfaces/ISecretManagerService'
import { certificatesType, configType } from '../models/Config'
import NodeVault = require('node-vault')
import { ILogger } from '../models/ILogger'

export class SecretManagerService implements ISecretManagerService {
  vaultClient: NodeVault.client
  secretsPath: string
  logger: ILogger
  constructor (config: configType, logger: ILogger, vault?: any) {
    this.logger = logger
    if (vault) {
      this.vaultClient = vault
      return
    }

    const options: NodeVault.VaultOptions = {
      apiVersion: 'v1', // default
      endpoint: config.vault_address, // default
      token: config.vault_token // optional client token; can be fetched after valid initialization of the server
    }
    this.secretsPath = config.secrets_path
    this.vaultClient = NodeVault(options)
  }

  async getSecretFromKey (path: string, key: string): Promise<string> {
    try {
      const fullPath = `${this.secretsPath}${path}`
      this.logger.verbose(`getting secret from ${fullPath}`)
      const data = await this.vaultClient.read(fullPath)
      this.logger.debug(`received secret from ${fullPath}`)
      return data.data.data[key]
    } catch (error) {
      this.logger.error('getSecretFromKey error :', error)
      return null
    }
  }

  async getSecretAtPath (path: string): Promise<any> {
    try {
      const fullPath = `${this.secretsPath}${path}`
      this.logger.verbose(`getting secrets from path: ${fullPath}`)
      const data = await this.vaultClient.read(fullPath)
      this.logger.debug(`got data back from vault at path: ${fullPath}`)
      return data.data
    } catch (error) {
      this.logger.error(`getSecretAtPath ${path} error :`, error)
      return null
    }
  }

  async writeSecretWithObject (path: string, data: any): Promise<void> {
    this.logger.verbose('writing data to vault:')
    await this.vaultClient.write(`${this.secretsPath}${path}`, data)
    this.logger.debug(`Successfully written data to vault at path: ${path}`)
  }

  async getAMTCredentials (path: string): Promise<string[]> {
    try {
      const user = 'admin'
      const secret: any = await this.getSecretAtPath(`devices/${path}`)
      const amtpass = secret.data.AMT_PASSWORD
      return [user, amtpass]
    } catch (error) {
      this.logger.error('Error while retrieving device credentials :', error)
      return null
    }
  }

  async getMPSCerts (): Promise<certificatesType> {
    try {
      const secret: any = await this.getSecretAtPath('MPSCerts')
      const certs: certificatesType = secret?.data
      return certs
    } catch (error) {
      this.logger.error('Error while retrieving device credentials :', error)
      return null
    }
  }

  async health (): Promise<any> {
    const result = await this.vaultClient.health()
    return result
  }
}
