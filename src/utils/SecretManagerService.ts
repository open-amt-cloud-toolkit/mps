/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Description: stores amt profiles
 * Author: Ramu Bachala
 **********************************************************************/



import NodeVault = require("node-vault");
import { ISecretManagerService } from '../models/ISecretManagerService'
import { configType } from "../models/Config";

export class SecretManagerService implements ISecretManagerService {
  
  vaultClient: NodeVault.client;
  logger: any;
  constructor(config:configType, logger: any, vault?: any) {
    this.logger = logger;
    if(vault) {
      this.vaultClient = vault;
      return;
    }

    var options : NodeVault.VaultOptions = {
      apiVersion: 'v1', // default
      endpoint: config.vaultaddress, // default
      token: config.vaulttoken // optional client token; can be fetched after valid initialization of the server
    };

    this.vaultClient = NodeVault(options);
  }  

  async listSecretsAtPath(path:string): Promise<any> {
    try {
      this.logger.info('list secret ' + path)
      let data = await this.vaultClient.list(path);
      this.logger.info('got data back from vault ')
      this.logger.info(JSON.stringify(data));
      // { data: data: { "key": "keyvalue"}}
      return data.data.keys; 
    } catch (error) {
      this.logger.error('listSecretFromKey error \r\n')
      this.logger.error(error)
      return null;
    }
    
  }  
  async getSecretFromKey(path:string, key: string): Promise<string> {
    try {
      this.logger.info('getting secret ' + path + ' ' + key)
      let data = await this.vaultClient.read(path);
      this.logger.info('got data back from vault ')
      // { data: data: { "key": "keyvalue"}}
      return data.data.data[key]; 
    } catch (error) {
      this.logger.error('getSecretFromKey error \r\n')
      this.logger.error(error)
      return null;
    }
    
  }  
  
  async readJsonFromKey(path: string, key: string): Promise<string> {
    var data = await this.getSecretFromKey(path, key);
    return (data ? JSON.parse(data) : null);
  }

  async writeSecretWithKey(path: string, key:string, keyValue: any): Promise<void> {
    let data = { data: {}};
    data.data[key] = keyValue;
    //this.logger.info('writing:' + JSON.stringify(data))
    this.logger.info('writing data to vault:')
    await this.vaultClient.write(path, data);
    this.logger.info('Successfully written data to vault')
  }

}