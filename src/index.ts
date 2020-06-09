/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import * as fs from "fs";
import * as path from "path";
import { logger as log } from "./utils/logger";
import { mpsMicroservice } from "./mpsMicroservice";
import { configType, certificatesType } from "./models/Config";
import { dataBase } from "./utils/db";

import { certificates } from "./utils/certificates";
import { tlsConfig } from "./utils/tlsConfiguration";
import { IDbProvider } from "./models/IDbProvider";
import { EnvReader } from "./utils/EnvReader";
import { SecretManagerService } from "./utils/SecretManagerService";
import { secretsDbProvider } from "./utils/vaultDbProvider";

//path where Self-signed certificates are generated
const certPath = path.join(__dirname, "../private");
let configPath = path.join(__dirname, "../private/config.json");
const dbPath = path.join(__dirname, "../private");
let config: configType;
let certs: certificatesType;
let db: IDbProvider;

try {
  config = <configType>{};
  if (fs.existsSync(configPath)) {
    // Parsing configuration
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    log.silent = config.loggeroff;
    log.info(`Loaded config... ${JSON.stringify(config, null, 2)}`);
  } else {
    log.error(`config file does not exists in the path ${configPath}`);
  }

  EnvReader.InitFromEnv(config);

  if(!config.webadminpassword || !config.webadminuser || !config.mpsxapikey){
    log.error(`Web admin username, password and API key are mandatory. Make sure to set values for these variables.`)
    process.exit(1);
  }

  if (config.developermode === true) {
    log.debug(`starting dev mode`);
    config.usevault = false;
    config.loggeroff = false;
  }

  log.verbose(`Updated config... ${JSON.stringify(config, null, 2)}`);

  // DB initialization
  if(config.usevault){
    log.info("Using secrets db provider");
    db = new secretsDbProvider(new SecretManagerService(config, log), log, config)
  }
  else {
    db = new dataBase(config, dbPath);
  }
  //Certificate Configuration and Operations
  if (config.https || !config.mpstlsoffload) {
    if(process.env.MPS_TLS_CERT 
      && process.env.WEB_TLS_CERT 
      && process.env.MPS_TLS_CERT_KEY 
      && process.env.WEB_TLS_CERT_KEY ){ // load config from ENV if provided. For prod environments
      log.info("Read cert info from env..")
      certs = EnvReader.getCertConfig();

    }
    else if (!config.generateCertificates) {
      certs = { mpsConfig: tlsConfig.mps(), webConfig: tlsConfig.web() };
      log.info(`Loaded existing certificates`);
    } else {
      certs = certificates.generateCertificates(config, certPath);
    }

    log.info("certs loaded..");

    // comment this out for release
    // log.info(JSON.stringify(certs));
  }
} catch (error) {
  log.error(error);
}

let mps = new mpsMicroservice(config, db, certs);
mps.start();
