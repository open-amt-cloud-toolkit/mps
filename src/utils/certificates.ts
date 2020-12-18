/**
* @fileoverview Script Compiler / Decompiler / Runner
* @author Ylian Saint-Hilaire
* @copyright Intel Corporation 2018
* @license Apache-2.0
* @version v0.1.0e
*/

import * as fs from 'fs'

import { logger as log } from './logger'
import { certificatesType, mpsConfigType, webConfigType, certAndKeyType } from '../models/Config'

const certoperation = require('./certoperations.js').CertificateOperations()

export class certificates {
  static generateCertificates (config, certpath): certificatesType {
    let certificates: certificatesType
    let mpsConfig: mpsConfigType
    let webConfig: webConfigType
    let mpsCertAndKey: certAndKeyType
    let rootCertificate, rootPrivateKey
    let rootCertAndKey: certAndKeyType
    let mpsCertificate, mpsPrivateKey

    if (fs.existsSync(certpath + '/root-cert-public.crt') && fs.existsSync(certpath + '/root-cert-private.key')) {
      // load certificate
      rootCertificate = fs.readFileSync(certpath + '/root-cert-public.crt', 'utf8')
      rootPrivateKey = fs.readFileSync(certpath + '/root-cert-private.key', 'utf8')
      rootCertAndKey = { cert: certoperation.pki.certificateFromPem(rootCertificate), key: certoperation.pki.privateKeyFromPem(rootPrivateKey) }
    } else {
      log.info('Generating Root certificate...')
      rootCertAndKey = certoperation.GenerateRootCertificate(true, 'MPSRoot', null, null, true)
      rootCertificate = certoperation.pki.certificateToPem(rootCertAndKey.cert)
      rootPrivateKey = certoperation.pki.privateKeyToPem(rootCertAndKey.key)
      fs.writeFileSync(certpath + '/root-cert-public.crt', rootCertificate)
      fs.writeFileSync(certpath + '/root-cert-private.key', rootPrivateKey)
    }

    if (fs.existsSync(certpath + '/mpsserver-cert-public.crt') && fs.existsSync(certpath + '/mpsserver-cert-private.key')) {
      // Keep the console certificate we have
      mpsCertificate = fs.readFileSync(certpath + '/mpsserver-cert-public.crt', 'utf8')
      mpsPrivateKey = fs.readFileSync(certpath + '/mpsserver-cert-private.key', 'utf8')
      mpsCertAndKey = { cert: certoperation.pki.certificateFromPem(mpsCertificate), key: certoperation.pki.privateKeyFromPem(mpsPrivateKey) }
    } else {
      log.info('Generating Intel AMT MPS certificate...')
      mpsCertAndKey = certoperation.IssueWebServerCertificate(rootCertAndKey, false, config.common_name, config.country, config.organization, null, false)
      mpsCertificate = certoperation.pki.certificateToPem(mpsCertAndKey.cert)
      mpsPrivateKey = certoperation.pki.privateKeyToPem(mpsCertAndKey.key)
      fs.writeFileSync(certpath + '/mpsserver-cert-public.crt', mpsCertificate)
      fs.writeFileSync(certpath + '/mpsserver-cert-private.key', mpsPrivateKey)
    }

    // Set MPS TLS Configuration
    mpsConfig = { cert: mpsCertificate, key: mpsPrivateKey, minVersion: 'TLSv1', requestCert: true, rejectUnauthorized: false }

    // Set WebServer TLS Configuration
    // certificates.web.root.key = rootPrivateKey;
    webConfig = { ca: rootCertificate, cert: mpsCertificate, key: mpsPrivateKey }

    certificates = { mps_tls_config: mpsConfig, web_tls_config: webConfig }

    return certificates// return mps and web certificates
  }
}
