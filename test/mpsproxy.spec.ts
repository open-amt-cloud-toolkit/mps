/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { MpsProxy } from "../src/server/proxies/MpsProxy"
import { certificatesType, configType } from '../src/models/Config'
const common = require('../src/utils/common.js')
import { MPSMicroservice } from '../src/mpsMicroservice'
import { Database } from '../src/utils/db'

describe('mpsProxy Object creation test', () => {
    it ('mpsProxy Object creation test', async () => {
      const config: configType = {
        use_allowlist: false,
        common_name: 'localhost',
        port: 4433,
        username: 'standalone',
        pass: 'P@ssw0rd',
        use_global_mps_credentials: true,
        country: 'US',
        company: 'NoCorp',
        debug: true,
        listen_any: true,
        https: true,
        tls_offload: false,
        web_port: 3000,
        generate_certificates: true,
        debug_level: 2,
        logger_off: false,
        data_path: "",
        cert_format: 'file',
        cert_path: "",        
        web_admin_user: 'standalone',
        web_admin_password: 'G@ppm0ym',
        distributed_kv_name: "HashiCorpConsul",
        distributed_kv_ip: "127.0.0.1",
        distributed_kv_port: 8500,
        startup_mode: "web",
        web_proxy_port: 8100,
        network_adaptor: "eth0",
        jwt_secret: "secret",
        jwt_issuer: "issuer",
        jwt_expiration: 24,
        tls_cert: "",
        tls_cert_key: "",
        tls_cert_ca: "",
        web_tls_cert: "",
        web_tls_cert_key: "",
        web_tls_cert_ca: "",
        cors_origin: '*',
        cors_headers: '*',
        cors_methods: '*',
        connection_string: '',
        instance_name: 'localhost',
        mps_tls_config: {
          key: '../private/mpsserver-cert-private.key',
          cert: '../private/mpsserver-cert-public.crt',
          requestCert: true,
          rejectUnauthorized: false,
          minVersion: 'TLSv1',
          ciphers: null,
          secureOptions: ['SSL_OP_NO_SSLv2', 'SSL_OP_NO_SSLv3']
        },
        web_tls_config: {
          key: '../private/mpsserver-cert-private.key',
          cert: '../private/mpsserver-cert-public.crt',
          ca: ['../private/root-cert-public.crt'],
          secureOptions: ['SSL_OP_NO_SSLv2', 'SSL_OP_NO_SSLv3', 'SSL_OP_NO_COMPRESSION', 'SSL_OP_CIPHER_SERVER_PREFERENCE', 'SSL_OP_NO_TLSv1', 'SSL_OP_NO_TLSv11']
        }
      }
        const uuid = "1cc7c617-22fa-4120-8b65-54b2038d3e8a"
        let db: Database
        let certs : certificatesType
        db = new Database(config)
        let mpsService = new MPSMicroservice(config, db, certs)

        let mpsProxy = new MpsProxy(uuid, mpsService, null)

        expect(mpsProxy instanceof MpsProxy).toBe(true);
        
    })
  })
