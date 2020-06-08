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

import * as path from "path";
import * as fs from "fs";
import * as util from "util";

import { configType } from "../models/Config";
import { logger as log } from "./logger";
import { IDbProvider } from '../models/IDbProvider';

const readFileAsync = util.promisify(fs.readFile);

export class dataBase implements IDbProvider {
  private config: configType;
  private datapath: string;

  constructor(config: configType, datapath: string) {
    try {
      this.config = config;
      this.datapath = datapath;
    } catch (error) {
      log.error(error);
    }
  }

  // Mock up code, real deployment must use proper data providers
  async getAllGUIDS() {
    let guids = [];
    let guidsFilePath = path.join(this.datapath, this.config.guidspath);
    try {
      if (fs.existsSync(guidsFilePath)) {
        guids = JSON.parse(await readFileAsync(guidsFilePath, "utf8"));
      } else {
        log.debug(`File guids.json does not exists ${guidsFilePath}`);
      }
    } catch (error) {
      log.error(`Exception in getAllGUIDS: ${error}`);
    }
    return guids;
  }

  //Check: why orgs
  async getAllOrgs() {
    var guids = [];
    let orgsFilePath = path.join(this.datapath, this.config.orgspath);
    try {
      if (fs.existsSync(orgsFilePath)) {
        guids = JSON.parse(await readFileAsync(orgsFilePath, "utf8"));
      } else {
        log.debug(`File orgs.json does not exists ${orgsFilePath}`);
      }
    } catch (error) {
        log.error(`Exception in getAllOrgs: ${error}`);
    }
    return guids;
  }

  async getAllCredentials() {
    var credentials = {};
    let credentialsFilePath = path.join(this.datapath,  this.config.credentialspath);
    try {
      if (fs.existsSync(credentialsFilePath)) {
        credentials = JSON.parse(
          await readFileAsync(credentialsFilePath, "utf8")
        );
      } else {
        log.debug(`File credentials.json does not exists ${credentialsFilePath}`);
      }
    } catch (error) {
        log.error(`Exception in getAllCredentials: ${error}`);
      return {};
    }
    return credentials;
  }

  async getCredentialsForGuid(guid) {
    var credentials = {};
    try {
      credentials = await this.getAllCredentials();
    } catch (error) {
        log.error(`Exception in getCredentialsForGuid: ${error}`);
      credentials = {};
    }
    return credentials[guid];
  }

  // get all credentials in credentials.json file
  async getAllAmtCredentials() {
    try {
      var cred = await this.getAllCredentials();
      // logger.debug(`All AMT credentials: ${JSON.stringify(cred, null, 4)}`);
      return cred;
    } catch (error) {
        log.error(`Exception in getAllAmtCredentials: ${error}`);
      return {};
    }
  }

  // check if a GUID is allowed to connect
  async IsGUIDApproved(guid, cb) {
    try {
      var result = false;
      if (this.config && this.config.usewhitelist) {
        var guids = await this.getAllGUIDS();
        if (guids.indexOf(guid) >= 0) {
          result = true;
        }
      } else {
        result = true;
      }
      if (cb) {
        cb(result);
      }
    } catch (error) {
        log.error(`Exception in IsGUIDApproved: ${error}`);
    }
  }

  // check if a Organization is allowed to connect
  async IsOrgApproved(org, cb) {
    try {
      var result = false;
      if (this.config && this.config.usewhitelist) {
        var orgs = await this.getAllOrgs();
        if (orgs.indexOf(org) >= 0) {
          result = true;
        }
      } else {
        result = true;
      }
      if (cb) {
        cb(result);
      }
    } catch (error) {
        log.error(`Exception in IsOrgApproved: ${error}`);
    }
  }

  // CIRA auth
  async CIRAAuth(guid, username, password, func) {
    try {
      var result = false;
      var cred = await this.getCredentialsForGuid(guid);
      if (cred && cred.mpsuser == username && cred.mpspass == password) {
        result = true;
      } else if (cred && this.config.useglobalmpscredentials) {
        if (this.config.mpsusername == username && this.config.mpspass == password) {
          result = true;
        }
      }
      if (func) func(result);
    } catch (error) {
        log.error(`Exception in CIRAAuth: ${error}`);
    }
  }

  async getAmtPassword(uuid) {
    var result = ["admin", ""];
    try {
      var amtcreds = await this.getCredentialsForGuid(uuid);
      if (amtcreds) {
        result = [amtcreds.amtuser, amtcreds.amtpass];
      }
    } catch (error) {
        log.error(`Exception in getAmtPassword: ${error}`);
    }
    return result;
  }
}
