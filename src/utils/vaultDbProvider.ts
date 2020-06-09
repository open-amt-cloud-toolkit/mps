/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { IDbProvider } from "../models/IDbProvider";
import { ISecretManagerService } from "../models/ISecretManagerService";
import { configType } from "../models/Config";

export class secretsDbProvider implements IDbProvider {
  
  secretsManager: ISecretManagerService
  secretsPath: string;
  logger: any;
  config: configType;
  constructor(secretsManager: ISecretManagerService, logger: any, config: configType) {
    this.secretsManager = secretsManager;
    this.secretsPath = config.secretsPath;
    this.logger = logger;
    this.config = config;
  }
  
  
  async CIRAAuth(guid: string, username: string, password: string, cb: any) {
    try {
      // let user = await this.secretsManager.getSecretFromKey(`${this.secretsPath}devices/${guid}`, `username`);
      // let pwd = await this.secretsManager.getSecretFromKey(`${this.secretsPath}devices/${guid}`, `password`);
      let user, pwd;
      if(this.config.useglobalmpscredentials) {
        // user = await this.secretsManager.getSecretFromKey(`${this.secretsPath}global`, `username`);
        // pwd = await this.secretsManager.getSecretFromKey(`${this.secretsPath}global`, `password`);

        // TODO: move this to vault.
        user = this.config.mpsusername;
        pwd = this.config.mpspass;

        if (username === user && password === pwd) {
          if(cb)
           cb(true);
          return;
        }
        this.logger.info("invalid mps credentials")
        if(cb) cb(false);
      }
      else {
        user = await this.secretsManager.getSecretFromKey(`${this.secretsPath}devices/${guid}`, `mps_username`);
        pwd = await this.secretsManager.getSecretFromKey(`${this.secretsPath}devices/${guid}`, `mps_password`);

        if (username === user && password === pwd) {
          if(cb)
           cb(true);
          return;
        }
        this.logger.info("invalid mps credentials")
        if(cb) cb(false);
      }
    } catch (error) {
      this.logger.error('Error while retrieving server credentials\r\n')
      this.logger.error(error)
      return false;
    }
  }  
  
  async getAmtPassword(guid: string): Promise<string[]> {
    try {
      let user = "admin";
      let pwd = await this.secretsManager.getSecretFromKey(`${this.secretsPath}devices/${guid}`, `${guid}`);
      return [user, pwd];
    } catch (error) {
      this.logger.error('Error while retrieving device credentials\r\n')
      this.logger.error(error)
      return null;
    }
  }

  async IsGUIDApproved(guid: string, cb: any) {
    try {
      let result = false;
      let guids = await this.secretsManager.getSecretFromKey(`${this.secretsPath}global`, `guids_whitelist`);
      if (guids.indexOf(guid) >= 0) {
        result = true;
      }
      if (cb) {
        cb(result);
      }
    } catch (error) {
      this.logger.error('Error while retrieving guids whitelist\r\n')
      this.logger.error(error)
    }
  }
  async IsOrgApproved(org: string, cb: any) {
    try {
      let result = false;
      let orgs = await this.secretsManager.getSecretFromKey(`${this.secretsPath}global`, `orgs_whitelist`);
      
      if (orgs.indexOf(org) >= 0) {
        result = true;
      }
      if (cb) {
        cb(result);
      }
    } catch (error) {
      this.logger.error('Error while retrieving org whitelist\r\n')
      this.logger.error(error)
      if (cb) {
        cb(null, 'error while retrieving org whitelist');
      }
    }
  }
  async getAllAmtCredentials(): Promise<any> {
    try {
      try {
        let result = false;
        let path = this.secretsPath.replace("data","metadata");
        let creds = await this.secretsManager.listSecretsAtPath(`${path}devices`);
        
        return creds.reduce((acc, cur)=> {
          acc[cur] = {};
          return acc;
        }, {})
        
      } catch (error) {
        this.logger.error('Error while retrieving org whitelist\r\n')
        this.logger.error(error)
        
      }
      
    } catch (error) {
      this.logger.error('Error while retrieving all amt device list\r\n')
      this.logger.error(error)
      return null;
    }
  }

}