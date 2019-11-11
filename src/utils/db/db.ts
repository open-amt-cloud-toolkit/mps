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

import { configType } from "../../models/Config";
import { logger as log } from "../logger";

const readFileAsync = util.promisify(fs.readFile);

export abstract class dataBase {
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

  abstract getAmtPassword(uuid: string): Promise<string[]>; 

  getConfig(){
    return this.config;
  }

  // Mock up code, real deployment must use proper data providers
  async getAllGUIDS() {
    let guids = [];
    let guidsFilePath = path.join(__dirname, "../../private/guids.json");
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
    let orgsFilePath = path.join(__dirname, "../../private/orgs.json");
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

  // check if a Organization is allowed to connect
  async IsOrgApproved(org, func) {
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
      if (func) {
        func(result);
      }
    } catch (error) {
        log.error(`Exception in IsOrgApproved: ${error}`);
    }
  }

  // check if a GUID is allowed to connect
  async IsGUIDApproved(guid, func) {
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
      if (func) {
        func(result);
      }
    } catch (error) {
        log.error(`Exception in IsGUIDApproved: ${error}`);
    }
  }

}
