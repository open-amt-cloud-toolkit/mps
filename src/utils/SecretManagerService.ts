/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { ISecretManagerService } from '../interfaces/ISecretManagerService'
import { certificatesType } from '../models/Config'
import got, { Got } from 'got'
import { Environment } from './Environment'
import { DeviceSecrets } from '../models/models'
import { ILogger } from '../interfaces/ILogger'
import { messages } from '../logging'

export class SecretManagerService implements ISecretManagerService {
  gotClient: Got
  logger: ILogger
  constructor (logger: ILogger) {
    this.logger = logger
    this.gotClient = got.extend({
      prefixUrl: `${Environment.Config.vault_address}/v1/${Environment.Config.secrets_path}`,
      headers: {
        'X-Vault-Token': Environment.Config.vault_token
      }
    })
  }

  async getSecretFromKey (path: string, key: string): Promise<string> {
    try {
      this.logger.verbose(`${messages.SECRET_MANAGER_GETTING_SECRET} ${path}`)
      const rspJson: any = await this.gotClient.get(path).json()
      this.logger.debug(`${messages.SECRET_MANAGER_RECEIVED_SECRET} ${path}`)
      if (rspJson.data?.data[key]) {
        return rspJson.data.data[key]
      }
    } catch (error) {
      this.logger.error(`${messages.SECRET_MANAGER_GET_SECRET_FROM_KEY_ERROR} error :`, error)
    }
    return null
  }

  async getSecretAtPath (path: string): Promise<any> {
    try {
      this.logger.verbose(`${messages.SECRET_MANAGER_GETTING_SECRET} ${path}`)
      const rspJson: any = await this.gotClient.get(path).json()
      this.logger.debug(`${messages.SECRET_MANAGER_RECEIVED_SECRET} ${path}`)
      return rspJson.data
    } catch (error) {
      this.logger.error(`${messages.SECRET_MANAGER_GET_SECRET_AT_PATH_ERROR} ${path} error :`, error)
      return null
    }
  }

  async writeSecretWithObject (path: string, data: any): Promise<boolean> {
    try {
      this.logger.verbose(messages.SECRET_MANAGER_WRITING_DATA_TO_SECRET_STORE)
      await this.gotClient.post(path, { json: data })
      this.logger.debug(`${messages.SECRET_MANAGER_DATA_WRITTEN_TO_SECRET_STORE_SUCCESS}: ${path}`)
      return true
    } catch (error) {
      this.logger.error(`${messages.SECRET_MANAGER_WRITING_SECRETS_ERROR} :`, error)
      return false
    }
  }

  async getAMTCredentials (path: string): Promise<string[]> {
    const user = 'admin'
    const secret: { data: DeviceSecrets } = await this.getSecretAtPath(`devices/${path}`)
    if (secret == null) {
      return null
    }
    const amtpass: string = secret.data.AMT_PASSWORD
    return [user, amtpass]
  }

  async getMPSCerts (): Promise<certificatesType> {
    const secret: { data: certificatesType } = await this.getSecretAtPath('MPSCerts')
    if (secret == null) {
      return null
    }
    const certs: certificatesType = secret.data
    return certs
  }

  async deleteSecretAtPath (path: string): Promise<void> {
    // to permanently delete the key, we use metadata path
    const basePath = Environment.Config.secrets_path.replace('/data/', '/metadata/')
    this.logger.verbose(`Deleting data from vault:${path}`)
    await this.gotClient.delete(`${path}`, {
      prefixUrl: `${Environment.Config.vault_address}/v1/${basePath}`
    }).json()
    this.logger.debug(`Successfully Deleted data from vault: ${path}`)
  }

  async health (): Promise<any> {
    const rspJson: any = await this.gotClient.get('sys/health', {
      prefixUrl: `${Environment.Config.vault_address}/v1/`
    }).json()
    return rspJson
  }
}
