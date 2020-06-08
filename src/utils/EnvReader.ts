/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { configType } from "../models/Config";

export class EnvReader {
  static GlobalEnvConfig: configType;
  static InitFromEnv(config: configType) {

    config.commonName = process.env.CERT_COMMON_NAME || config.commonName;
    config.mpsusername = process.env.MPS_USER || config.mpsusername;
    config.mpspass = process.env.MPS_PASSWORD || config.mpspass;
    config.sessionEncryptionKey = process.env.MPS_SESSION_ENCRYPTION_KEY || config.sessionEncryptionKey;
    
    if (process.env.HTTPS){
      config.https = (process.env.HTTPS === "true" ? true : false)
    }

    if (process.env.USE_WHITELIST){
      config.usewhitelist = (process.env.USE_WHITELIST === "true" ? true : false)
    }

    if (process.env.MPS_PORT){
      config.mpsport = parseInt(process.env.MPS_PORT);
    }
  
    if (process.env.MPS_ALIAS_PORT){
      config.mpsaliasport = parseInt(process.env.MPS_ALIAS_PORT);
    }
    
    if (process.env.WEB_PORT){
      config.webport = parseInt(process.env.WEB_PORT);
    }
   
    if (process.env.USE_GLOBAL_CREDENTIALS){
      config.useglobalmpscredentials = (process.env.USE_GLOBAL_CREDENTIALS === "true" ? true : false)
    }

    if (process.env.ENABLE_LOGGING){
      config.loggeroff = (process.env.ENABLE_LOGGING === "true" ? false : true); // its a contradictory flag..pay attention
    }
  
    if (process.env.LISTEN_ANY){
      config.listenany = (process.env.LISTEN_ANY === "true" ? true : false);
    }

    if (process.env.DEBUG){
      config.debug = config.mpsdebug = (process.env.DEBUG === "true" ? true : false);
    }

    if (process.env.USEVAULT){
      config.usevault = (process.env.USEVAULT === "true" ? true : false);
    }

    if(process.env.SECRETS_PATH){
      config.secretsPath = process.env.SECRETS_PATH;
     } 
     else{
       if(config.secretsPath){
        config.secretsPath =  config.secretsPath;
       }else{
        config.secretsPath ="secret/data/";
       }
    }

    if (config.secretsPath.lastIndexOf("/") !== config.secretsPath.length - 1) {
      config.secretsPath += "/";
    }

    if (process.env.GENERATE_CERTS){
      config.generateCertificates = (process.env.GENERATE_CERTS === "true" ? true : false);
    }

    if (process.env.DEBUG_LEVEL){
      config.debugLevel = parseInt(process.env.DEBUG_LEVEL)
    }

    if (process.env.DEVELOPER_MODE) {
      config.developermode = (process.env.DEVELOPER_MODE === "true" ? true : false);
    }

    if(process.env.MPS_TLS_OFFLOAD){
      config.mpstlsoffload = (process.env.MPS_TLS_OFFLOAD === "true" ? true : false)
    }

    config.guidspath = process.env.GUIDS_PATH || config.guidspath;
    config.credentialspath = process.env.CREDENTIALS_PATH || config.credentialspath;
    config.orgspath = process.env.ORGS_PATH || config.orgspath;
    config.country = process.env.COUNTRY || config.country;
    config.company = process.env.COMPANY || config.company;
    config.vaultaddress = process.env.VAULT_ADDR || config.vaultaddress;
    config.vaulttoken = process.env.VAULT_TOKEN || config.vaulttoken;
    config.webadminuser = process.env.WEB_ADMIN_USER || config.webadminuser;
    config.webadminpassword = process.env.WEB_ADMIN_PASSWORD || config.webadminpassword;
    config.mpsxapikey = process.env.MPSXAPIKEY || config.mpsxapikey;

    EnvReader.GlobalEnvConfig = config;
  }

  static getCertConfig() {
    let mpsTlsConfig = {
      "key": process.env.MPS_TLS_CERT_KEY,
      "cert": process.env.MPS_TLS_CERT,
      "requestCert": true,
      "rejectUnauthorized": false,
      "minVersion": "TLSv1",
      "ciphers": null,
      "secureOptions": ["SSL_OP_NO_SSLv2", "SSL_OP_NO_SSLv3"]
    }

    let webTlsConfig = {
      "key": process.env.WEB_TLS_CERT_KEY,
      "cert": process.env.WEB_TLS_CERT,
      "secureOptions": ["SSL_OP_NO_SSLv2", "SSL_OP_NO_SSLv3", "SSL_OP_NO_COMPRESSION" , "SSL_OP_CIPHER_SERVER_PREFERENCE", "SSL_OP_NO_TLSv1", "SSL_OP_NO_TLSv11"],
      "ca": ""
    }

    if(process.env.ROOT_CA_CERT) {
      webTlsConfig.ca = process.env.ROOT_CA_CERT
    }

    return { mpsConfig: mpsTlsConfig, webConfig: webTlsConfig }
  }
}