/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { IDbProvider } from '../models/IDbProvider'
import { ISecretManagerService } from '../models/ISecretManagerService'
import { configType } from '../models/Config'
import { Credentials } from '../models/models'
import { IDeviceDb } from '../interfaces/IDeviceDb'

export class AuthDbProvider implements IDbProvider {
  secretsManager: ISecretManagerService
  deviceDb: IDeviceDb
  secretsPath: string
  logger: any
  config: configType
  constructor (secretsManager: ISecretManagerService, deviceDb: IDeviceDb, logger: any, config: configType) {
    this.secretsManager = secretsManager
    this.deviceDb = deviceDb
    this.secretsPath = config.secrets_path
    this.logger = logger
  }

  async CIRAAuth (guid: string, username: string, password: string, cb: any): Promise<boolean> {
    try {
      const results = await this.deviceDb.getById(guid)
      if (results != null) {
        this.logger.debug(`CIRAAuth: device found: ${guid}, ${JSON.stringify(results)}`)
      } else {
        this.logger.warn(`CIRAAuth: device not found: ${guid}`)
        if (cb) cb(false)
        return false
      }

      const pwd = await this.secretsManager.getSecretFromKey(`${this.secretsPath}devices/${guid}`, 'MPS_PASSWORD')

      if (username === results.mpsusername && password === pwd) {
        if (cb) {
          cb(true)
        }
        return
      }
      this.logger.info('invalid mps credentials')
      if (cb) cb(false)
    } catch (error) {
      this.logger.error('Error while retrieving server credentials\r\n')
      this.logger.error(error)
      return false
    }
  }

  async getAmtPassword (guid: string): Promise<string[]> {
    try {
      const user = 'admin'
      const data: any = await this.secretsManager.getSecretAtPath(`${this.secretsPath}devices/${guid}`)
      const amtpass = data.data.AMT_PASSWORD
      return [user, amtpass]
    } catch (error) {
      this.logger.error('Error while retrieving device credentials\r\n')
      this.logger.error(error)
      return null
    }
  }

  async IsGUIDApproved (guid: string, cb: any): Promise<void> {
    try {
      let result = false

      const results = await this.deviceDb.getById(guid)
      if (results != null) {
        this.logger.debug(`IsGUIDApproved: device found: ${guid}, ${JSON.stringify(results)}`)
        result = true
      } else {
        this.logger.warn(`IsGUIDApproved: device not found: ${guid}`)
        result = false
      }

      if (cb) {
        cb(result)
      }
    } catch (error) {
      this.logger.error('Error while retrieving guids allowlist\r\n')
      this.logger.error(error)
    }
  }

  async IsOrgApproved (org: string, cb: any): Promise<void> {
    try {
      let result = false
      const orgs = await this.secretsManager.getSecretFromKey(`${this.secretsPath}global`, 'orgs_allowlist')

      if (orgs.includes(org)) {
        result = true
      }
      if (cb) {
        cb(result)
      }
    } catch (error) {
      this.logger.error('Error while retrieving org allowlist\r\n')
      this.logger.error(error)
      if (cb) {
        cb(null, 'error while retrieving org allowlist')
      }
    }
  }

  async getAllAmtCredentials (): Promise<Credentials> {
    try {
      try {
        const path = this.secretsPath.replace('data', 'metadata')
        const creds = await this.secretsManager.listSecretsAtPath(`${path}devices`)

        return creds.reduce((acc, cur) => {
          acc[cur] = {}
          return acc
        }, {})
      } catch (error) {
        this.logger.error('Error while retrieving org allowlist\r\n')
        this.logger.error(error)
      }
    } catch (error) {
      this.logger.error('Error while retrieving all amt device list\r\n')
      this.logger.error(error)
      return null
    }
  }
}
