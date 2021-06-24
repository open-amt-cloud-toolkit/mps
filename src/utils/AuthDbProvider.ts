/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { IDbProvider } from '../models/IDbProvider'
import { ISecretManagerService } from '../models/ISecretManagerService'
import { configType } from '../models/Config'
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

  async CIRAAuth (guid: string, username: string, password: string): Promise<boolean> {
    try {
      const results = await this.deviceDb.getById(guid)
      if (results != null) {
        this.logger.debug(`CIRAAuth: device found: ${guid}, ${JSON.stringify(results)}`)
      } else {
        this.logger.warn(`CIRAAuth: device not found: ${guid}`)
        return false
      }

      const pwd = await this.secretsManager.getSecretFromKey(`${this.secretsPath}devices/${guid}`, 'MPS_PASSWORD')
      if (username === results.mpsusername && password === pwd) {
        return true
      }
      this.logger.warn('invalid mps credentials')
      return false
    } catch (error) {
      this.logger.error('Error while retrieving server credentials :', error)
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
      this.logger.error('Error while retrieving device credentials :', error)
      return null
    }
  }

  async IsGUIDApproved (guid: string): Promise<boolean> {
    try {
      let result: boolean = false
      const results = await this.deviceDb.getById(guid)
      if (results != null) {
        this.logger.debug(`IsGUIDApproved: device found: ${guid}, ${JSON.stringify(results)}`)
        result = true
      } else {
        this.logger.warn(`IsGUIDApproved: device not found: ${guid}`)
        result = false
      }
      return result
    } catch (error) {
      this.logger.error('Error while retrieving guid:', error)
    }
  }
}
