/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: config type definitions
**********************************************************************/

export type configType ={
    usewhitelist: boolean,
    commonName: string,
    mpsport: number,
    mpsusername: string,
    mpspass: string,
    useglobalmpscredentials: boolean,
    country: string,
    company: string,
    debug: boolean,
    listenany: boolean,
    https: boolean,
    mpstlsoffload: boolean,
    webport : number,
    generateCertificates: boolean,
    mpsaliasport?: number,
    mpsdebug?: boolean,
    loggeroff: boolean,
    secretsPath?: string,
    usevault?: boolean,
    vaultaddress?: string,
    vaulttoken?: string,
    debugLevel: number,
    credentialspath: string,
    orgspath: string,
    guidspath: string,
    developermode: boolean,
    webadminuser: string,
    webadminpassword: string,
    sessionEncryptionKey: string,
    mpsxapikey: string
}

export type certificatesType = {
    mpsConfig: mpsConfigType, 
    webConfig: webConfigType
}

export type mpsConfigType = {
   cert: any,
   key: any,
   minVersion: any,
   secureOptions?: any,
   requestCert: boolean,
   rejectUnauthorized: boolean
}

export type webConfigType = {
    ca: any,
    cert: any,
    key: any, 
    secureOptions?: any,  
}

export type certAndKeyType = {
    cert: any,
    key: any
};

export type directConfigType = {
    ca: any,
    cert: any,
    key: any, 
    ciphers: string,
    secureOptions?: any,
    rejectUnauthorized: boolean
}