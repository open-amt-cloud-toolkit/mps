/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { Database } from '../src/utils/db'
import { configType } from '../src/models/Config'
import { join } from 'path'

describe('Use GUID allowlisting: ', () => {
  const config: configType = {
    use_allowlist: true,
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
    data_path: join(__dirname, 'private', 'data.json'),
    cert_format: 'file',
    cert_path: join(__dirname, 'private'),
    jwt_secret: "secret",
    jwt_issuer: "issuer",
    jwt_expiration: 24,
    web_admin_user: 'standalone',
    web_admin_password: 'G@ppm0ym',
    distributed_kv_name: "",
    distributed_kv_ip: "",
    distributed_kv_port: 8500,
    startup_mode: "standalone",
    web_proxy_port: 8100,
    network_adaptor: "eth0",
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
  const db = new Database(config)
  // console.log(config)
  // console.log(db.getAllGUIDS())
  it('Test if listed GUID is allowed', (done) => {
    const callback = (ret) => {
      try {
        // console.log('return value ', ret)
        expect(ret).toBe(true)
        done()
      } catch (error) {
        done(error)
      };
    }
    db.IsGUIDApproved('12345678-9abc-def1-2345-123456789000', callback)
  })

  it('Test if listed GUID is not allowed', (done) => {
    const callback = (ret) => {
      try {
        // console.log('return value ', ret)
        expect(ret).toBe(false)
        done()
      } catch (error) {
        done(error)
      };
    }
    db.IsGUIDApproved('12345678-9abc-def1-2345-12345678900', callback)
  })
  // ToDo:
  // it('Test if non listed GUID is not allowed', async() => {
  //       await db.IsGUIDApproved("12345678-9abc-def1-2345-123456789001", (ret) => {
  //         return ret;
  //       }).then((state) => {
  //         expect(state).toBe(false);
  //       })
  //       .catch((error) => {
  //         expect(error).toBe(false);
  //     });
  // });
})

describe('Do not use GUID allowlisting: ', () => {
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
    data_path: join(__dirname, 'private', 'data.json'),
    cert_format: 'file',
    cert_path: join(__dirname, 'private'),    
    web_admin_user: 'standalone',
    web_admin_password: 'G@ppm0ym',
    jwt_secret: "secret",
    jwt_issuer: "issuer",
    jwt_expiration: 24,
    distributed_kv_name: "",
    distributed_kv_ip: "",
    distributed_kv_port: 8500,
    startup_mode: "web",
    web_proxy_port: 8100,
    network_adaptor: "eth0",
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
  const db = new Database(config)
  it('Test if listed GUID is allowed', () => {
    db.IsGUIDApproved('12345678-9abc-def1-2345-123456789000', (ret) => {
      expect(ret).toBe(true)
    })
  })

  it('Test if non listed GUID is still allowed', () => {
    db.IsGUIDApproved('12345678-9abc-def1-2345-123456789001', (ret) => {
      expect(ret).toBe(true)
    })
  })
})
