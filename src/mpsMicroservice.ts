/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { configType, certificatesType} from "./models/Config";
import {webServer } from './server/webserver';
import {mpsServer} from './server/mpsserver';
import { logger as log } from './utils/logger';
import { dataBase } from "./utils/db";
import { IDbProvider } from "./models/IDbProvider";

 
export class mpsMicroservice {
  mpsserver : any;
  webserver : any;
  config: configType;
  certs: certificatesType;
  debugLevel: number = 1;
  mpsComputerList = {};
  db: IDbProvider;

constructor(config: configType, db: IDbProvider, certs: certificatesType){
    try {
      this.config = config;    
      this.debugLevel = config.debugLevel;
      this.db = db;
      this.certs = certs;
    } catch (e) {
      log.error("Exception in MPS Microservice: " + e);
    }
  }

  start(){
    this.mpsserver = new mpsServer(this);
    this.webserver = new webServer(this);
  }

 CIRAConnected(guid) {
      log.info(`CIRA connection established for ${guid}`);
      if (this.webserver) {
          this.webserver.notifyUsers({ host: guid, event: "node_connection", status: "connected" });
      }
  }

  CIRADisconnected(guid) {
    log.info(`Main:CIRA connection closed for ${guid}`);
    if (guid && this.mpsComputerList[guid]) {
      delete this.mpsComputerList[guid];
      if (this.webserver) {
        this.webserver.notifyUsers({
          host: guid,
          event: "node_connection",
          status: "disconnected"
        });
      }
    }
  }
}
