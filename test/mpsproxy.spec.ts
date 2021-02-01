/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { MpsProxy } from "../src/server/proxies/MpsProxy"
import { configType } from '../src/models/Config'
const common = require('../src/utils/common.js');

describe("mpsProxy Socket creation and communication test", () => {
    it ('getSocketForGuid', async () => {
        let config: configType = {
            usewhitelist: false,
            commonName: "",
            mpsport: 4433,
            mpsusername: "",
            mpspass: "",
            useglobalmpscredentials: true,
            country: "",
            company: "",
            debug: true,
            listenany: true,
            https: false,
            mpstlsoffload: false,
            webport: 3000,
            generateCertificates: true,
            mpsaliasport: 4433,
            mpsdebug: true,
            loggeroff: false,
            secretsPath: "",
            usevault: false,
            vaultaddress: "",
            vaulttoken: "",
            debugLevel: 1,
            credentialspath: "",
            orgspath: "string",
            guidspath: "string",
            developermode: false,
            webadminuser: "",
            webadminpassword: "",
            sessionEncryptionKey: "",
            startupMode: "standalone",
            distributedKVName: "HashiCorpConsul",
            distributedKVIP: "127.0.0.1",
            distributedKVPort: 8500,
            scalingEnabled: true,
            webProxyPort: 9002
        };
        const uuid = "1cc7c617-22fa-4120-8b65-54b2038d3e8a";
        let nextchannelid = 25;
        let targetport = 0;

        let msg =        // Channel Open    
      String.fromCharCode(90) +
      // UUID
      common.rstr2hex(uuid) +
      //  Channelid
      common.IntToStr(nextchannelid) +
      //  target port
      common.IntToStr(targetport);      
      
      let mps = MpsProxy.getSocketForGuid('1cc7c617-22fa-4120-8b65-54b2038d3e8a', config)
      mps.write(msg);
      await timeout(2000);
        //expect(consulObject1 === consulObject2).toBe(true);
    });
    function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));}


    function writeData()
{
  console.log('CLIENT: writedata called.');
}
});
