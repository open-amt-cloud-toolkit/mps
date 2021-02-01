/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { Consul } from '../src/utils/consul';
import { IDistributedKV, getDistributedKV } from '../src/utils/IDistributedKV';
import { mpsMicroservice } from '../src/mpsMicroservice'
import { configType } from '../src/models/Config'

describe("Test Consul class Construction", () => {
    it('Test if Consul class Object Constructed only once', () => {
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
            webProxyPort: 9000
        };
        let mps = new mpsMicroservice(config, null, null);
        let consulObject1 = getDistributedKV(config);
        let consulObject2 = getDistributedKV(config);

        expect(consulObject1 === consulObject2).toBe(true);
    });
});

describe("Test for consul update", () => {

    it('Test for consul resolve', async () => {
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
            webProxyPort: 9000
        };
        let mps = new mpsMicroservice(config, null, null);
        let ip = getDistributedKV(config).updateKV('1cc7c617-22fa-4120-8b65-54b2038d3e8a', '127.0.0.1')
        await timeout(2000);
        
        //expect(ip).toBe('192.168.2.219')       
    });
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));}
});

describe("Test for consul lookup", () => {

    it('Test for consul resolve', async () => {
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
            webProxyPort: 9000
        };
        let mps = new mpsMicroservice(config, null, null);
        let ip = await getDistributedKV(config).lookup('1cc7c617-22fa-4120-8b65-54b2038d3e8a')
        expect(ip).toBe('192.168.2.219')       
    });
});
