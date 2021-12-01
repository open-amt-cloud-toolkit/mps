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
      this.logger.verbose(`getting secret from ${fullPath}`)
      const data = await this.vaultClient.read(fullPath)
      this.logger.debug(`received secret from ${fullPath}`)
      if (data.data.data[key] != null) {
        return data.data.data[key]
      }
    } catch (error) {
      this.logger.error('getSecretFromKey error :', error)
    }
    return null
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

  async writeSecretWithObject (path: string, data: any): Promise<boolean> {
    try {
      this.logger.verbose('writing data to vault:')
      await this.vaultClient.write(`${this.secretsPath}${path}`, data)
      this.logger.debug(`Successfully written data to vault at path: ${path}`)
      return true
    } catch (error) {
      this.logger.error('Error while writing secrets :', error)
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
