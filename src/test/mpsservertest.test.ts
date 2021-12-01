/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import * as tls from 'tls'
import * as net from 'net'
import * as fs from 'fs'
import * as https from 'https'
import * as forge from 'node-forge'
import { Certificates } from '../utils/certificates'
import { certificatesType } from '../models/Config'
import { MPSServer } from '../server/mpsserver'
import { ISecretManagerService } from '../interfaces/ISecretManagerService'
import { Device } from '../models/models'
import { IDeviceTable } from '../interfaces/IDeviceTable'
import { IDB } from '../interfaces/IDb'
import { config } from './helper/config'

const pki = forge.pki
let certs: certificatesType
const certPath = config.cert_path
let db: IDB
let devicesMock: IDeviceTable
let secrets: ISecretManagerService
let mps: MPSServer

xdescribe('MPS Server', function () {
  beforeAll(async function () {
    jest.setTimeout(60000)
    try {
      if (!fs.existsSync(certPath)) { fs.mkdirSync(certPath, { recursive: true }) }
    } catch (e) {
      console.log(`Failed to create Cert path ${certPath}. Create if it doesn't exist`)
    }
    const certificates = new Certificates(config, secrets)
    certs = certificates.generateCertificates()
    const device = { mpsusername: 'admin' }
    devicesMock = {
      get: async () => { return [] as Device[] },
      getCount: async () => { return 0 },
      getDistinctTags: async () => { return ['tag'] },
      getByName: async (guid) => { return device as Device },
      getByTags: async (tags) => { return [device] as Device[] },
      clearInstanceStatus: async () => {},
      delete: async (guid) => { return true },
      insert: async (device) => { return device },
      update: async () => { return device as Device }
    }

    db = {
      devices: devicesMock,
      query: async (text, params): Promise<any> => {

      }
    }
    secrets = {
      getSecretFromKey: async (path: string, key: string) => { return 'P@ssw0rd' },
      getSecretAtPath: async (path: string) => { return {} as any },
      getAMTCredentials: async (path: string) => { return ['admin', 'P@ssw0rd'] },
      health: async () => { return {} }
    }
    mps = new MPSServer(certs, db, secrets)
  })

  it('Accept TLS connection test', function (done) {
    const tlsOptions = { rejectUnauthorized: false, secureProtocol: 'TLSv1_1_method' }
    try {
      const socket = tls.connect(config.port, 'localhost', tlsOptions, function () {
        socket.end()
        done()
      })
    } catch (e) {
      done(e)
    }
  })

  it('Reject Non-TLS connection test', function (done) {
    const socket = new net.Socket()
    let terminated = false
    socket.on('end', function () {
      // check if it was previously terminated
      if (terminated) {
        done(new Error('Terminated not by TLS server'))
      } else {
        done()
      }
    })

    socket.on('data', function (data) {
      console.log(data)
    })

    socket.connect(config.port, function () {
      socket.write('1234567890\n')
      setTimeout(function () {
        terminated = true
        socket.end()
      }, 2000)
    })
  })

  it('Server Fingerprint Test', function (done) {
    const tlsOptions = { rejectUnauthorized: false, secureProtocol: 'TLSv1_1_method' }
    const socket = tls.connect(config.port, 'localhost', tlsOptions, function () {
      const fingerprint = socket.getPeerCertificate().fingerprint.toLowerCase().replace(/:/gi, '')
      socket.end()

      // Generate Thumbprint of the certificate
      const md = forge.md.sha1.create()
      md.update(forge.asn1.toDer(forge.pki.certificateToAsn1(pki.certificateFromPem(mps.certs.mps_tls_config.cert))).getBytes())
      const serverFingerprint = md.digest().toHex()
      if (serverFingerprint === fingerprint) {
        done()
      } else {
        done(new Error('Certificate fingerprint mismatch'))
      }
    })
  })

  it('Get MPS details on HTTPS GET', function (done) {
    const getOptions = {
      hostname: 'localhost',
      port: config.port,
      path: '/',
      method: 'GET',
      ca: certs.mps_tls_config.cert.ca,
      strictSSL: false,
      rejectUnauthorized: false
    }
    // console.log(get_options);
    https.get(getOptions, (res) => {
      // let data = ''
      res.on('data', (chunk) => {
        // data += chunk
      })

      res.on('end', () => {
        if (res.statusCode === 200) {
          done()
        } else {
          console.log('Status code and message from mps server', res.statusCode, res.statusMessage)
          done(new Error('Invalid status response'))
        }
      })
    }).on('error', (err) => {
      done(err)
    })
  })

  it('Validate UserAuth for a valid MPS connection request', function (done) {
    jest.setTimeout(60000)
    const obj: any = {}
    const args = {
      host: config.common_name,
      port: config.port,
      clientName: 'hostname-prefix',
      uuid: '12345678-9abc-def1-2345-123456789000', // GUID template, last few chars of the string will be replaced
      username: 'admin', // mps username
      password: 'P@ssw0rd', // mps password
      keepalive: 10000, // interval for keepalive ping
      debug: false,
      testciraState: 'USERAUTH_SUCCESS' // USERAUTH_SERVICE_ACCEPT, PFWD_SERVICE_ACCEPT, GLOBAL_REQUEST_SUCCESS, USERAUTH_SUCCESS, USERAUTH_FAILURE, PROTOCOL_VERSION_SENT, KEEPALIVE_REPLY
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    obj.ciraclient = require('./helper/ciraclient.js').CreateCiraClient(obj, args)
    obj.ciraclient.connect(function () {
      obj.ciraclient.disconnect()
      done()
    })
  })

  it('Validate APF USERAUTH_SERVICE_ACCEPT Message', function (done) {
    jest.setTimeout(60000)
    const obj: any = {}
    const args = {
      host: config.common_name,
      port: config.port,
      clientName: 'hostname-prefix',
      uuid: '12345678-9abc-def1-2345-123456789000', // GUID template, last few chars of the string will be replaced
      username: 'admin', // mps username
      password: 'P@ssw0rd', // mps password
      keepalive: 10000, // interval for keepalive ping
      debug: false,
      testciraState: 'USERAUTH_SERVICE_ACCEPT' // USERAUTH_SERVICE_ACCEPT, PFWD_SERVICE_ACCEPT, GLOBAL_REQUEST_SUCCESS, USERAUTH_SUCCESS, USERAUTH_FAILURE, PROTOCOL_VERSION_SENT, KEEPALIVE_REPLY
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    obj.ciraclient = require('./helper/ciraclient.js').CreateCiraClient(obj, args)
    obj.ciraclient.connect(function () {
      obj.ciraclient.disconnect()
      done()
    })
  })

  it('Validate APF PFWD_SERVICE_ACCEPT Message', function (done) {
    jest.setTimeout(60000)
    const obj: any = {}
    const args = {
      host: config.common_name,
      port: config.port,
      clientName: 'hostname-prefix',
      uuid: '12345678-9abc-def1-2345-123456789000', // GUID template, last few chars of the string will be replaced
      username: 'admin', // mps username
      password: 'P@ssw0rd', // mps password
      keepalive: 10000, // interval for keepalive ping
      debug: false,
      testciraState: 'PFWD_SERVICE_ACCEPT' // USERAUTH_SERVICE_ACCEPT, PFWD_SERVICE_ACCEPT, GLOBAL_REQUEST_SUCCESS, USERAUTH_SUCCESS, USERAUTH_FAILURE, PROTOCOL_VERSION_SENT, KEEPALIVE_REPLY
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    obj.ciraclient = require('./helper/ciraclient.js').CreateCiraClient(obj, args)
    obj.ciraclient.connect(function () {
      obj.ciraclient.disconnect()
      done()
    })
  })

  it('Validate APF GLOBAL_REQUEST_SUCCESS Message', function (done) {
    jest.setTimeout(60000)
    const obj: any = {}
    const args = {
      host: config.common_name,
      port: config.port,
      clientName: 'hostname-prefix',
      uuid: '12345678-9abc-def1-2345-123456789000', // GUID template, last few chars of the string will be replaced
      username: 'admin', // mps username
      password: 'P@ssw0rd', // mps password
      keepalive: 10000, // interval for keepalive ping
      debug: false,
      testciraState: 'GLOBAL_REQUEST_SUCCESS' // USERAUTH_SERVICE_ACCEPT, PFWD_SERVICE_ACCEPT, GLOBAL_REQUEST_SUCCESS, USERAUTH_SUCCESS, USERAUTH_FAILURE, PROTOCOL_VERSION_SENT, KEEPALIVE_REPLY
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    obj.ciraclient = require('./helper/ciraclient.js').CreateCiraClient(obj, args)
    obj.ciraclient.connect(function () {
      obj.ciraclient.disconnect()
      done()
    })
  })

  it('Validate APF PROTOCOL_VERSION_SENT Message', function (done) {
    jest.setTimeout(60000)
    const obj: any = {}
    const args = {
      host: config.common_name,
      port: config.port,
      clientName: 'hostname-prefix',
      uuid: '12345678-9abc-def1-2345-123456789000', // GUID template, last few chars of the string will be replaced
      username: 'admin', // mps username
      password: 'P@ssw0rd', // mps password
      keepalive: 10000, // interval for keepalive ping
      debug: false,
      testciraState: 'PROTOCOL_VERSION_SENT' // USERAUTH_SERVICE_ACCEPT, PFWD_SERVICE_ACCEPT, GLOBAL_REQUEST_SUCCESS, USERAUTH_SUCCESS, USERAUTH_FAILURE, PROTOCOL_VERSION_SENT, KEEPALIVE_REPLY
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    obj.ciraclient = require('./helper/ciraclient.js').CreateCiraClient(obj, args)
    obj.ciraclient.connect(function () {
      obj.ciraclient.disconnect()
      done()
    })
  })

  it('Validate APF KEEPALIVE_REPLY Message', function (done) {
    jest.setTimeout(15000)
    const obj: any = {}
    const args = {
      host: config.common_name,
      port: config.port,
      clientName: 'hostname-prefix',
      uuid: '12345678-9abc-def1-2345-123456789000', // GUID template, last few chars of the string will be replaced
      username: 'admin', // mps username
      password: 'P@ssw0rd', // mps password
      keepalive: 10000, // interval for keepalive ping
      debug: false,
      testciraState: 'KEEPALIVE_REPLY' // USERAUTH_SERVICE_ACCEPT, PFWD_SERVICE_ACCEPT, GLOBAL_REQUEST_SUCCESS, USERAUTH_SUCCESS, USERAUTH_FAILURE, PROTOCOL_VERSION_SENT, KEEPALIVE_REPLY
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    obj.ciraclient = require('./helper/ciraclient.js').CreateCiraClient(obj, args)
    obj.ciraclient.connect(function () {
      obj.ciraclient.disconnect()
      done()
    })
  })

  it('Validate APF USERAUTH_FAILURE Message (using wrong password)', function (done) {
    jest.setTimeout(60000)
    const obj: any = {}
    const args = {
      host: config.common_name,
      port: config.port,
      clientName: 'hostname-prefix',
      uuid: '12345678-9abc-def1-2345-123456789000', // GUID template, last few chars of the string will be replaced
      username: 'admin', // mps username
      password: 'pasdbenaksd', // Invalid mps password
      keepalive: 10000, // interval for keepalive ping
      debug: false,
      testciraState: 'USERAUTH_FAILURE' // USERAUTH_SERVICE_ACCEPT, PFWD_SERVICE_ACCEPT, GLOBAL_REQUEST_SUCCESS, USERAUTH_SUCCESS, USERAUTH_FAILURE, PROTOCOL_VERSION_SENT, KEEPALIVE_REPLY
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    obj.ciraclient = require('./helper/ciraclient.js').CreateCiraClient(obj, args)
    obj.ciraclient.connect(function () {
      obj.ciraclient.disconnect()
      done()
    })
  })

  afterAll(function () {
    console.log('closing server')
    mps.server.close()
  })
})
