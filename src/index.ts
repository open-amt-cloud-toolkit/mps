/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { logger as log } from './utils/logger'
import { configType, certificatesType } from './models/Config'

import { Certificates } from './utils/certificates'
import tlsConfig from './utils/tlsConfiguration'
import { SecretManagerService } from './utils/SecretManagerService'
import { parseValue } from './utils/parseEnvValue'

import rc from 'rc'
import { Environment } from './utils/Environment'
import { MqttProvider } from './utils/MqttProvider'
import { ISecretManagerService } from './interfaces/ISecretManagerService'
import { DbCreatorFactory } from './factories/DbCreatorFactory'
import { IDB } from './interfaces/IDb'
import { WebServer } from './server/webserver'
import { MPSServer } from './server/mpsserver'

async function main (): Promise<void> {
  try {
    Environment.Config = loadConfig()

    // DB initialization
    const newDB = new DbCreatorFactory()
    const db = await newDB.getDb()

    await setupSignalHandling(db)
    // Secret store initialization
    const secrets: ISecretManagerService = new SecretManagerService(log)
    const certs = await loadCertificates(secrets)
    // MQTT Connection - Creates a static connection to be access across MPS
    const mqtt: MqttProvider = new MqttProvider()
    mqtt.connectBroker()

    const mpsServer = new MPSServer(certs, db, secrets)
    const webServer = new WebServer(secrets, certs)

    mpsServer.listen()
    webServer.listen()
  } catch (error) {
    log.error('Error starting MPS microservice. Check server logs.')
    log.error(error)
  }
}

function loadConfig (): configType {
  // To merge ENV variables. consider after lower-casing ENV since our config keys are lowercase
  process.env = Object.keys(process.env)
    .reduce((destination, key) => {
      destination[key.toLowerCase()] = parseValue(process.env[key])
      return destination
    }, {})

  // build config object
  const config: configType = rc('mps')

  if (!config.web_admin_password || !config.web_admin_user || !config.jwt_secret) {
    log.error('Web admin username, password and jwt secret are mandatory. Make sure to set values for these variables.')
    process.exit(1)
  }

  config.instance_name = config.instance_name === '{{.Task.Name}}' ? 'mps' : config.instance_name
  log.silly(`Updated config... ${JSON.stringify(config, null, 2)}`)
  return config
}
async function setupSignalHandling (db: IDB): Promise<void> {
  // Cleans the DB before exit when it listens to the signals
  const signals = ['SIGINT', 'exit', 'uncaughtException', 'SIGTERM', 'SIGHUP']
  signals.forEach((signal) => {
    process.on(signal, async () => {
      log.debug('signal received :', signal)
      await db.devices.clearInstanceStatus(Environment.Config.instance_name)
      MqttProvider.endBroker()
      if (signal !== 'exit') {
        setTimeout(() => process.exit(), 1000)
      }
    })
  })
}

async function loadCertificates (secrets: ISecretManagerService): Promise<certificatesType> {
  // path where Self-signed certificates are generated
  let certs: certificatesType
  // Certificate Configuration and Operations
  const certificates = new Certificates(Environment.Config, secrets)
  if (!Environment.Config.generate_certificates) {
    if (Environment.Config.cert_format === 'raw') { // if you want to read the cert raw from variable.
      log.debug('using cert format raw')

      if (Environment.Config.mps_tls_config) {
        Environment.Config.mps_tls_config.key = Environment.Config.tls_cert_key
        Environment.Config.mps_tls_config.cert = Environment.Config.tls_cert
      } else {
        Environment.Config.mps_tls_config = { cert: Environment.Config.tls_cert, key: Environment.Config.tls_cert_key, minVersion: 'TLSv1', requestCert: true, rejectUnauthorized: false }
      }

      if (Environment.Config.web_tls_config) {
        Environment.Config.web_tls_config.key = Environment.Config.web_tls_cert_key
        Environment.Config.web_tls_config.cert = Environment.Config.web_tls_cert
        Environment.Config.web_tls_config.ca = Environment.Config.web_tls_cert_ca
      } else {
        Environment.Config.web_tls_config = { ca: Environment.Config.web_tls_cert_ca, cert: Environment.Config.web_tls_cert, key: Environment.Config.web_tls_cert_key }
      }

      certs = { mps_tls_config: Environment.Config.mps_tls_config, web_tls_config: Environment.Config.web_tls_config }
    } else { // else read the certs from files
      log.debug('using cert from file')
      certs = { mps_tls_config: tlsConfig.mps(), web_tls_config: tlsConfig.web() }
    }
    log.debug('Loaded existing certificates')
  } else {
    certs = await certificates.getCertificates()
  }
  log.debug('certs loaded..')
  return certs
}

main().then().catch(err => {
  log.error(err)
})
