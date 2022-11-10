/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { logger } from './logging'
import { configType, certificatesType } from './models/Config'
import { Certificates } from './utils/certificates'
import tlsConfig from './utils/tlsConfiguration'
import { parseValue } from './utils/parseEnvValue'
import rc from 'rc'
import { Environment } from './utils/Environment'
import { MqttProvider } from './utils/MqttProvider'
import { ISecretManagerService } from './interfaces/ISecretManagerService'
import { DbCreatorFactory } from './factories/DbCreatorFactory'
import { SecretManagerCreatorFactory } from './factories/SecretManagerCreatorFactory'
import { IDB } from './interfaces/IDb'
import { WebServer } from './server/webserver'
import { MPSServer } from './server/mpsserver'

export async function main (): Promise<void> {
  try {
    // To merge ENV variables. consider after lower-casing ENV since our config keys are lowercase
    process.env = Object.keys(process.env)
      .reduce((destination, key) => {
        destination[key.toLowerCase()] = parseValue(process.env[key])
        return destination
      }, {})
    // build config object
    const config: configType = rc('mps')
    Environment.Config = validateConfig(config)
    const db = await initializeDB()
    await setupSignalHandling(db)
    const secrets = await initializeSecrets()
    const certs = await loadCertificates(secrets)
    await initializeMqtt()

    const mpsServer = new MPSServer(certs, db, secrets)
    const webServer = new WebServer(secrets, certs)

    mpsServer.listen()
    webServer.listen()
  } catch (error) {
    logger.error('Error starting MPS microservice. Check server logs.')
    logger.error(error)
  }
}

export function validateConfig (config: configType): configType {
  if (config.web_auth_enabled) {
    if (!config.web_admin_password || !config.web_admin_user) {
      logger.error('If auth enabled is set to true, Web admin username and password are mandatory. Make sure to set values for these variables.')
      process.exit(1)
    }
  }
  if (!config.jwt_secret) {
    logger.error('jwt secret is mandatory.')
    process.exit(1)
  }
  config.instance_name = config.instance_name === '{{.Task.Name}}' ? 'mps' : config.instance_name
  logger.silly(`Updated config... ${JSON.stringify(config, null, 2)}`)
  return config
}

export async function initializeDB (): Promise<IDB> {
  const factory = new DbCreatorFactory()
  const db = await factory.getDb()
  if (typeof (db as any).waitForStartup === 'function') {
    await (db as any).waitForStartup().catch(err => {
      logger.error('failed initializing database: ', err)
      process.exit(1)
    })
  }
  return db
}

export async function initializeSecrets (): Promise<ISecretManagerService> {
  const factory = new SecretManagerCreatorFactory()
  const secrets = await factory.getSecretManager(logger)
  // wait for vault to be up and ready before dealing with certificates
  if (typeof (secrets as any).waitForStartup === 'function') {
    await (secrets as any).waitForStartup().catch(err => {
      logger.error('failed initializing secrets: ', err)
      process.exit(1)
    })
  }
  return secrets
}

// Creates a static connection to be accessed across MPS
export async function initializeMqtt (): Promise<MqttProvider> {
  const mqtt: MqttProvider = new MqttProvider()
  mqtt.connectBroker()
  return mqtt
}

async function setupSignalHandling (db: IDB): Promise<void> {
  // Cleans the DB before exit when it listens to the signals
  const signals = ['SIGINT', 'exit', 'uncaughtException', 'SIGTERM', 'SIGHUP']
  signals.forEach((signal) => {
    process.on(signal, async () => {
      logger.debug('signal received :', signal)
      await db.devices.clearInstanceStatus(Environment.Config.instance_name)
      MqttProvider.endBroker()
      if (signal !== 'exit') {
        setTimeout(() => process.exit(), 1000)
      }
    })
  })
}

export async function loadCertificates (secrets: ISecretManagerService): Promise<certificatesType> {
  // path where Self-signed certificates are generated
  let certs: certificatesType
  // Certificate Configuration and Operations
  const certificates = new Certificates(Environment.Config, secrets)
  if (!Environment.Config.generate_certificates) {
    if (Environment.Config.cert_format === 'raw') { // if you want to read the cert raw from variable.
      logger.debug('using cert format raw')

      if (Environment.Config.mps_tls_config) {
        Environment.Config.mps_tls_config.key = Environment.Config.tls_cert_key
        Environment.Config.mps_tls_config.cert = Environment.Config.tls_cert
      } else {
        Environment.Config.mps_tls_config = { cert: Environment.Config.tls_cert, key: Environment.Config.tls_cert_key, minVersion: Environment.Config.mps_tls_config.minVersion, requestCert: true, rejectUnauthorized: false }
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
      logger.debug('using cert from file')
      certs = { mps_tls_config: tlsConfig.mps(), web_tls_config: tlsConfig.web() }
    }
    logger.debug('Loaded existing certificates')
  } else {
    certs = await certificates.getCertificates()
  }
  logger.debug('certs loaded..')
  return certs
}

if (process.env.NODE_ENV !== 'test') {
  main().then().catch(err => {
    logger.error(err)
  })
}
