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

//path where Self-signed certificates are generated
const certPath = path.join(__dirname, "../private");
let configPath = path.join(__dirname, "../private/config.json");
let config: configType;
let certs: certificatesType;
let db: dataBase;

try {
  if (fs.existsSync(configPath)) {
    // Parsing configuration
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    log.silent = config.loggeroff;
    config.commonName = process.env.CERT_COMMON_NAME || config.commonName;
    log.info(`Loaded config... ${JSON.stringify(config, null, 2)}`);
  } else {
    log.error(`config file does not exists in the path ${configPath}`);
  }

  // DB initialization
  db = new dataBase(config, null);

  //Certificate Configuration and Operations
  if (config.https || !config.mpstlsoffload) {
    if (!config.generateCertificates) {
      certs = { mpsConfig: tlsConfig.mps(), webConfig: tlsConfig.web() };
      log.info(`Loaded existing certificates`);
    } else {
      certs = certificates.generateCertificates(config, certPath);
    }
  }
} catch (error) {
  log.error(error);
}

let mps = new mpsMicroservice(config, db, certs);
mps.start();
