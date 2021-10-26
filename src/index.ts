/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { logger as log } from './utils/logger'
import { MPSMicroservice } from './mpsMicroservice'
import { configType, certificatesType } from './models/Config'

import { Certificates } from './utils/certificates'
import tlsConfig from './utils/tlsConfiguration'
import { SecretManagerService } from './utils/SecretManagerService'
import { parseValue } from './utils/parseEnvValue'

import rc from 'rc'
import { Environment } from './utils/Environment'
import { MqttProvider } from './utils/mqttProvider'
import { ISecretManagerService } from './interfaces/ISecretManagerService'
import { DbCreatorFactory } from './factories/DbCreatorFactory'

async function main (): Promise<void> {
  try {
  // To merge ENV variables. consider after lowercasing ENV since our config keys are lowercase
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

    // path where Self-signed certificates are generated
    let certs: certificatesType
    config.instance_name = config.instance_name === '{{.Task.Name}}' ? 'mps' : config.instance_name
    log.silly(`Updated config... ${JSON.stringify(config, null, 2)}`)
    Environment.Config = config
    // MQTT Connection - Creates a static connection to be access across MPS
    const mqtt: MqttProvider = new MqttProvider(config)
    mqtt.connectBroker()

    // Secret store initialization
    const secrets: ISecretManagerService = new SecretManagerService(config, log)
    // DB initialization
    const newDB = new DbCreatorFactory(config)
    const db = await newDB.getDb()
    // Cleans the DB before exit when it listens to the signals
    const signals = ['SIGINT', 'exit', 'uncaughtException', 'SIGTERM', 'SIGHUP']
    signals.forEach((signal) => {
      process.on(signal, () => {
        log.debug('signal received :', signal)
        db.devices.clearInstanceStatus(Environment.Config.instance_name)
        MqttProvider.endBroker()
        if (signal !== 'exit') {
          setTimeout(() => process.exit(), 1000)
        }
      })
    })

    // Certificate Configuration and Operations
    const certificates = new Certificates(config, secrets)
    if (config.https || !config.tls_offload) {
      if (!config.generate_certificates) {
        if (config.cert_format === 'raw') { // if you want to read the cert raw from variable.
          log.debug('using cert format raw')

          if (config.mps_tls_config) {
            config.mps_tls_config.key = config.tls_cert_key
            config.mps_tls_config.cert = config.tls_cert
          } else {
            config.mps_tls_config = { cert: config.tls_cert, key: config.tls_cert_key, minVersion: 'TLSv1', requestCert: true, rejectUnauthorized: false }
          }

          if (config.web_tls_config) {
            config.web_tls_config.key = config.web_tls_cert_key
            config.web_tls_config.cert = config.web_tls_cert
            config.web_tls_config.ca = config.web_tls_cert_ca
          } else {
            config.web_tls_config = { ca: config.web_tls_cert_ca, cert: config.web_tls_cert, key: config.web_tls_cert_key }
          }

          certs = { mps_tls_config: config.mps_tls_config, web_tls_config: config.web_tls_config }
        } else { // else read the certs from files
          log.debug('using cert from file')
          certs = { mps_tls_config: tlsConfig.mps(), web_tls_config: tlsConfig.web() }
        }
        log.debug('Loaded existing certificates')
      } else {
        certs = await certificates.getCertificates()
      }
      log.debug('certs loaded..')
    }
    const mps = new MPSMicroservice(config, db, secrets, certs)
    mps.start()
  } catch (error) {
    log.error('Error starting MPS microservice. Check server logs.')
    log.error(error)
    process.exit(1)
  }
}

main().then().catch(err => {
  log.error(err)
})
