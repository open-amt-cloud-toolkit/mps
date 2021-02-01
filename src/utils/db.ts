/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

/**
 * @description Database backend for credentials
 * @author Joko Banu Sastriawan
 * @copyright Intel Corporation 2018
 * @license Apache-2.0
 * @version 0.0.1
 */

import * as path from 'path'
import * as fs from 'fs'
import * as util from 'util'

import { configType } from '../models/Config'
import { logger as log } from './logger'
import { IDbProvider } from '../models/IDbProvider'
import { loggers } from 'winston'

const readFileAsync = util.promisify(fs.readFile)

export class dataBase implements IDbProvider {
  private config: configType;
  private datapath: string;

  constructor (config: configType) {
    try {
      this.config = config
      this.datapath = config.data_path
      if (!fs.existsSync(this.datapath)) { log.error(`DB Path is not valid. Check if ${this.datapath} exists.`) }
    } catch (error) {
      log.error(error)
      throw error
    }
  }

  // Mock up code, real deployment must use proper data providers
  async getAllGUIDS () {
    let guids = []
    try {
      if (this.datapath && fs.existsSync(this.datapath)) {
        const fileData = fs.readFileSync(this.datapath, 'utf8')
        const jsonData = JSON.parse(fileData)
        // console.log(jsonData)
        if (Array.isArray(jsonData.allowlist_guids)) { guids = guids.concat(jsonData.allowlist_guids) }

        log.silly(`Guids - ${JSON.stringify(guids)}`)
      }
    } catch (error) {
      log.error(`Error while reading guids from data.json ${error}`)
    }
    return guids
  }

  // Check: why orgs
  async getAllOrgs () {
    let orgs = []
    try {
      if (this.datapath && fs.existsSync(this.datapath)) {
        const fileData = fs.readFileSync(this.datapath, 'utf8')
        const jsonData = JSON.parse(fileData)
        if (Array.isArray(jsonData.allowlist_orgs)) { orgs = orgs.concat(jsonData.allowlist_orgs) }
        log.silly(`Orgs - ${JSON.stringify(orgs)}`)
      }
    } catch (error) {
      log.error(`Error while reading orgs from data.json ${error}`)
    }
    return orgs
  }

  async getAllCredentials () {
    let credentials = {}
    try {
      if (this.datapath && fs.existsSync(this.datapath)) {
        const fileData = fs.readFileSync(this.datapath, 'utf8')
        const jsonData = JSON.parse(fileData)
        log.silly(fileData)
        credentials = Object.keys(jsonData.credentials).reduce((prev, curr) => {
          prev[curr] = jsonData.credentials[curr]
          return prev
        }, credentials)

        log.silly(`Creds - ${JSON.stringify(credentials)}`)
      }
    } catch (error) {
      log.error(`Error while reading credentials from data.json ${error}`)
    }
    return credentials
  }

  async getCredentialsForGuid (guid) {
    let credentials = {}
    try {
      credentials = await this.getAllCredentials()
    } catch (error) {
      log.error(`Exception in getCredentialsForGuid: ${error}`)
      credentials = {}
    }
    return credentials[guid]
  }

  // get all credentials in credentials.json file
  async getAllAmtCredentials () {
    try {
      const cred = await this.getAllCredentials()
      // logger.debug(`All AMT credentials: ${JSON.stringify(cred, null, 4)}`);
      return cred
    } catch (error) {
      log.error(`Exception in getAllAmtCredentials: ${error}`)
      return {}
    }
  }

  // check if a GUID is allowed to connect
  async IsGUIDApproved (guid, cb) {
    try {
      let result = false
      if (this.config && this.config.use_allowlist) {
        const guids = await this.getAllGUIDS()
        if (guids.indexOf(guid) >= 0) {
          result = true
          log.silly('Guid found.')
        }
      } else {
        result = true
      }
      if (cb) {
        cb(result)
      }
    } catch (error) {
      log.error(`Exception in IsGUIDApproved: ${error}`)
    }
  }

  // check if a Organization is allowed to connect
  async IsOrgApproved (org, cb) {
    try {
      let result = false
      if (this.config && this.config.use_allowlist) {
        const orgs = await this.getAllOrgs()
        if (orgs.indexOf(org) >= 0) {
          result = true
        }
      } else {
        result = true
      }
      if (cb) {
        cb(result)
      }
    } catch (error) {
      log.error(`Exception in IsOrgApproved: ${error}`)
    }
  }

  // CIRA auth
  async CIRAAuth (guid, username, password, func) {
    try {
      let result = false
      const cred = await this.getCredentialsForGuid(guid)
      //log.info(cred)
      if (cred && cred.mpsuser == username && cred.mpspass == password) {
        result = true
      } else if (cred && this.config.use_global_mps_credentials) {
        if (this.config.username == username && this.config.pass == password) {
          result = true
          log.silly(`CIRAAuth successful. ${username} ${password}`)
        }
      }
      if (func) func(result)
    } catch (error) {
      log.error(`Exception in CIRAAuth: ${error}`)
    }
  }

  async getAmtPassword (uuid) {
    let result = ['admin', '']
    try {
      const amtcreds = await this.getCredentialsForGuid(uuid)
      if (amtcreds) {
        result = [amtcreds.amtuser, amtcreds.amtpass]
      }
    } catch (error) {
      log.error(`Exception in getAmtPassword: ${error}`)
    }
    return result
  }
}
