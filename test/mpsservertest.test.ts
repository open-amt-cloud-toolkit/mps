/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import * as tls from "tls";
import * as net from "net";
import * as fs from 'fs';
import * as https from 'https';
import * as forge from 'node-forge';
import { certificates } from '../src/utils/certificates';
import { certificatesType } from '../src/models/Config';
import * as path from 'path';
import { dataBase } from "../src/utils/db";
import { mpsMicroservice } from '../src/mpsMicroservice';
import { mpsServer } from '../src/server/mpsserver';

// Parsing configuration
let config = {
    "usewhitelist": false,
    "commonName": "localhost",
    "mpsport": 4433,
    "mpsusername": "standalone",
    "mpspass": "P@ssw0rd",
    "useglobalmpscredentials": true,
    "country": "US",
    "company": "NoCorp",
    "debug": true,
    "listenany": true,
    "https": true,
    "mpstlsoffload": false,
    "webport": 3000,
    "generateCertificates": true,
    "loggeroff": true
};

let pki = forge.pki;
let certs : certificatesType;
let certPath = path.join(__dirname, 'private');
let db: dataBase;
let mpsService: mpsMicroservice;
let mps: mpsServer;

describe('MPS Server', function () {
    var server;
    beforeAll(async function () {
        jest.setTimeout(60000);
        try {
            if(!fs.existsSync(certPath)) 
                fs.mkdirSync(certPath, { recursive: true });
        } catch (e) {
            console.log(`Failed to create Cert path ${certPath}. Create if it doesnt exist`);
        }
        certs = await certificates.generateCertificates(config, certPath);
        db = new dataBase(config, null);
        mpsService = new mpsMicroservice(config, db, certs);
        mps = new mpsServer(mpsService);
        
        // DB initialization
        server = mps;
    });

    it("Accept TLS connection test", function (done) {
        var tlsOptions = { rejectUnauthorized: false, secureProtocol: 'TLSv1_1_method' }
        try {
            var socket = tls.connect(config.mpsport, 'localhost', tlsOptions, function () {
                socket.end();
                done();
            })
        } catch (e) {
            done(e);
        }
    });

    it("Reject Non-TLS connection test", function (done) {
        var socket = new net.Socket();
        var terminated = false;
        socket.on("end", function () {
            // check if it was previously terminated
            if (terminated) {
                done(new Error("Terminated not by TLS server"));
            } else {
                done();
            }
        });

        socket.on('data', function (data) {
            console.log(data);
        })

        socket.connect(config.mpsport, function () {
            socket.write("1234567890\n");
            setTimeout(function () {
                terminated = true;
                socket.end();
            }, 2000);
        })
    });

    it("Server Fingerprint Test", function (done) {
        var tlsOptions = { rejectUnauthorized: false, secureProtocol: 'TLSv1_1_method' }
        var socket = tls.connect(config.mpsport, "localhost", tlsOptions, function () {
            var fingerprint = socket.getPeerCertificate().fingerprint.toLowerCase().replace(/\:/gi, "");
            socket.end();

            //Generate Thumbprint of the certificate
            const md = forge.md.sha1.create();
            md.update(forge.asn1.toDer(forge.pki.certificateToAsn1(pki.certificateFromPem(mps.certs.mpsConfig.cert))).getBytes());
            const serverFingerprint = md.digest().toHex();
            if (serverFingerprint == fingerprint) {
                done();
            } else {
                done(new Error("Certificate fingerprint mismatch"));
            }
        })
    });

    it("Get MPS details on HTTPS GET", function (done) {
        const get_options = {
            hostname: 'localhost',
            port: config.mpsport,
            path: '/',
            method: 'GET',
            ca: certs.mpsConfig.cert.ca,
            strictSSL: false,
            rejectUnauthorized: false
        };
        // console.log(get_options);
        https.get(get_options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode == 200) {
                    done();
                }
                else {
                    console.log('Status code and message from mps server', res.statusCode, res.statusMessage);
                    done(new Error("Invalid status response"));
                }
            });

        }).on("error", (err) => {
            done(err);
        });

    });

    it("Validate UserAuth for a valid MPS connection request", function (done) {
        jest.setTimeout(10000);
        var obj : any = {};
        var args = {
            host: config.commonName,
            port: config.mpsport,
            clientName: 'hostname-prefix',
            uuid: "12345678-9abc-def1-2345-123456789000",//GUID template, last few chars of the string will be replaced
            username: config.mpsusername, // mps username
            password: config.mpspass, // mps password
            keepalive: 60000, // interval for keepalive ping
            debug: false,
            testciraState: 'USERAUTH_SUCCESS' //USERAUTH_SERVICE_ACCEPT, PFWD_SERVICE_ACCEPT, GLOBAL_REQUEST_SUCCESS, USERAUTH_SUCCESS, USERAUTH_FAILURE, PROTOCOL_VERSION_SENT, KEEPALIVE_REPLY
        };

        obj.ciraclient = require("./helper/ciraclient.js").CreateCiraClient(obj, args);
        obj.ciraclient.connect(function () {
            obj.ciraclient.disconnect();
            done();
        });
    });

    it("Validate APF USERAUTH_SERVICE_ACCEPT Message", function (done) {
        jest.setTimeout(10000);
        var obj : any = {};
        var args = {
            host: config.commonName,
            port: config.mpsport,
            clientName: 'hostname-prefix',
            uuid: "12345678-9abc-def1-2345-123456789000",//GUID template, last few chars of the string will be replaced
            username: config.mpsusername, // mps username
            password: config.mpspass, // mps password
            keepalive: 60000, // interval for keepalive ping
            debug: false,
            testciraState: 'USERAUTH_SERVICE_ACCEPT' //USERAUTH_SERVICE_ACCEPT, PFWD_SERVICE_ACCEPT, GLOBAL_REQUEST_SUCCESS, USERAUTH_SUCCESS, USERAUTH_FAILURE, PROTOCOL_VERSION_SENT, KEEPALIVE_REPLY
        };

        obj.ciraclient = require("./helper/ciraclient.js").CreateCiraClient(obj, args);
        obj.ciraclient.connect(function () {
            obj.ciraclient.disconnect();
            done();
        });
    });

    it("Validate APF PFWD_SERVICE_ACCEPT Message", function (done) {
        jest.setTimeout(10000);
        var obj:any = {};
        var args = {
            host: config.commonName,
            port: config.mpsport,
            clientName: 'hostname-prefix',
            uuid: "12345678-9abc-def1-2345-123456789000",//GUID template, last few chars of the string will be replaced
            username: config.mpsusername, // mps username
            password: config.mpspass, // mps password
            keepalive: 60000, // interval for keepalive ping
            debug: false,
            testciraState: 'PFWD_SERVICE_ACCEPT' //USERAUTH_SERVICE_ACCEPT, PFWD_SERVICE_ACCEPT, GLOBAL_REQUEST_SUCCESS, USERAUTH_SUCCESS, USERAUTH_FAILURE, PROTOCOL_VERSION_SENT, KEEPALIVE_REPLY
        };

        obj.ciraclient = require("./helper/ciraclient.js").CreateCiraClient(obj, args);
        obj.ciraclient.connect(function () {
            obj.ciraclient.disconnect();
            done();
        });
    });

    it("Validate APF GLOBAL_REQUEST_SUCCESS Message", function (done) {
        jest.setTimeout(10000);
        var obj:any = {};
        var args = {
            host: config.commonName,
            port: config.mpsport,
            clientName: 'hostname-prefix',
            uuid: "12345678-9abc-def1-2345-123456789000",//GUID template, last few chars of the string will be replaced
            username: config.mpsusername, // mps username
            password: config.mpspass, // mps password
            keepalive: 60000, // interval for keepalive ping
            debug: false,
            testciraState: 'GLOBAL_REQUEST_SUCCESS' //USERAUTH_SERVICE_ACCEPT, PFWD_SERVICE_ACCEPT, GLOBAL_REQUEST_SUCCESS, USERAUTH_SUCCESS, USERAUTH_FAILURE, PROTOCOL_VERSION_SENT, KEEPALIVE_REPLY
        };

        obj.ciraclient = require("./helper/ciraclient.js").CreateCiraClient(obj, args);
        obj.ciraclient.connect(function () {
            obj.ciraclient.disconnect();
            done();
        });
    });

    it("Validate APF PROTOCOL_VERSION_SENT Message", function (done) {
        jest.setTimeout(5000);
        var obj:any = {};
        var args = {
            host: config.commonName,
            port: config.mpsport,
            clientName: 'hostname-prefix',
            uuid: "12345678-9abc-def1-2345-123456789000",//GUID template, last few chars of the string will be replaced
            username: config.mpsusername, // mps username
            password: config.mpspass, // mps password
            keepalive: 60000, // interval for keepalive ping
            debug: false,
            testciraState: 'PROTOCOL_VERSION_SENT' //USERAUTH_SERVICE_ACCEPT, PFWD_SERVICE_ACCEPT, GLOBAL_REQUEST_SUCCESS, USERAUTH_SUCCESS, USERAUTH_FAILURE, PROTOCOL_VERSION_SENT, KEEPALIVE_REPLY
        };

        obj.ciraclient = require("./helper/ciraclient.js").CreateCiraClient(obj, args);
        obj.ciraclient.connect(function () {
            obj.ciraclient.disconnect();
            done();
        });
    });

    it("Validate APF KEEPALIVE_REPLY Message", function (done) {
        jest.setTimeout(90000);
        var obj:any = {};
        var args = {
            host: config.commonName,
            port: config.mpsport,
            clientName: 'hostname-prefix',
            uuid: "12345678-9abc-def1-2345-123456789000",//GUID template, last few chars of the string will be replaced
            username: config.mpsusername, // mps username
            password: config.mpspass, // mps password
            keepalive: 10000, // interval for keepalive ping
            debug: false,
            testciraState: 'KEEPALIVE_REPLY' //USERAUTH_SERVICE_ACCEPT, PFWD_SERVICE_ACCEPT, GLOBAL_REQUEST_SUCCESS, USERAUTH_SUCCESS, USERAUTH_FAILURE, PROTOCOL_VERSION_SENT, KEEPALIVE_REPLY
        };

        obj.ciraclient = require("./helper/ciraclient.js").CreateCiraClient(obj, args);
        obj.ciraclient.connect(function () {
            obj.ciraclient.disconnect();
            done();
        });
    });

    it("Validate APF USERAUTH_FAILURE Message (using wrong password)", function (done) {
        jest.setTimeout(10000);
        var obj:any = {};
        var args = {
            host: config.commonName,
            port: config.mpsport,
            clientName: 'hostname-prefix',
            uuid: "12345678-9abc-def1-2345-123456789000",//GUID template, last few chars of the string will be replaced
            username: config.mpsusername, // mps username
            password: "pasdbenaksd", // Invalid mps password
            keepalive: 60000, // interval for keepalive ping
            debug: false,
            testciraState: 'USERAUTH_FAILURE' //USERAUTH_SERVICE_ACCEPT, PFWD_SERVICE_ACCEPT, GLOBAL_REQUEST_SUCCESS, USERAUTH_SUCCESS, USERAUTH_FAILURE, PROTOCOL_VERSION_SENT, KEEPALIVE_REPLY
        };

        obj.ciraclient = require("./helper/ciraclient.js").CreateCiraClient(obj, args);
        obj.ciraclient.connect(function () {
            obj.ciraclient.disconnect();
            done();
        });
    });

    afterAll(function () {
        console.log('closing server');
        mps.server.close();
    });
});
