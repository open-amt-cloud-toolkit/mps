/**
* @fileoverview Script Compiler / Decompiler / Runner
* @author Ylian Saint-Hilaire
* @copyright Intel Corporation 2018
* @license Apache-2.0
* @version v0.1.0e
*/

import { logger as log } from './logger'
import { certificatesType, mpsConfigType, webConfigType, certAndKeyType } from '../models/Config'
import { CertificateOperations } from './certoperations.js'

const certoperation = CertificateOperations()

export class Certificates {
  constructor (private readonly config: any, private readonly secrets: any) {
    this.config = config
    this.secrets = secrets
  }

  async getCertificates (): Promise<certificatesType> {
    let certificates: certificatesType = await this.secrets.getMPSCerts()
    if (certificates == null) {
      certificates = this.generateCertificates()
      await this.storeCertificates(certificates)
    }
    return certificates// return mps and web certificates
  }

  generateCertificates (): certificatesType {
    log.info('Generating Root certificate...')
    const rootCertAndKey: certAndKeyType = certoperation.GenerateRootCertificate(true, 'MPSRoot', null, null, true)
    const rootCertificate = certoperation.pki.certificateToPem(rootCertAndKey.cert)
    const rootPrivateKey = certoperation.pki.privateKeyToPem(rootCertAndKey.key)

    log.info('Generating Intel AMT MPS certificate...')
    const mpsCertAndKey: certAndKeyType = certoperation.IssueWebServerCertificate(rootCertAndKey, false, this.config.common_name, this.config.country, this.config.organization, null, false)
    const mpsCertificate = certoperation.pki.certificateToPem(mpsCertAndKey.cert)
    const mpsPrivateKey = certoperation.pki.privateKeyToPem(mpsCertAndKey.key)

    // Set MPS TLS Configuration
    const mpsConfig: mpsConfigType = { cert: mpsCertificate, key: mpsPrivateKey, minVersion: 'TLSv1', requestCert: true, rejectUnauthorized: false }
    // Set WebServer TLS Configuration
    const webConfig: webConfigType = { ca: rootCertificate, cert: mpsCertificate, key: mpsPrivateKey }
    const certificates: certificatesType = { mps_tls_config: mpsConfig, web_tls_config: webConfig, root_key: rootPrivateKey }
    return certificates// return mps and web certificates
  }

  async storeCertificates (certificates: certificatesType): Promise<void> {
    const data = {
      data: certificates
    }
    await this.secrets.writeSecretWithObject('MPSCerts', data)
  }
}
