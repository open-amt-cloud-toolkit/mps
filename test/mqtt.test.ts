import { MqttProvider } from '../src/utils/mqttProvider'
import { configType } from '../src/models/Config'

jest.mock('mqtt', () => ({ ...jest.requireActual('mqtt') as object, }));
const mqtt1 = require('mqtt');

describe('MQTT Turned ON Tests', () => {
  let mqttProvider: MqttProvider
  const config: configType = {
    common_name: "localhost",
    port: 4433,
    country: "US",
    company: "NoCorp",
    debug: true,
    listen_any: true,
    https: true,
    tls_offload: false,
    web_port: 3000,
    generate_certificates: true,
    debug_level: 2,
    logger_off: false,
    web_admin_user: "standalone",
    web_admin_password: "G@ppm0ym",
    tls_cert: "",
    tls_cert_key: "",
    tls_cert_ca: "",
    web_tls_cert: "",
    web_tls_cert_key: "",
    web_tls_cert_ca: "",
    vault_address: "http://localhost:8200",
    vault_token: "myroot",
    secrets_path: "secret/data/",
    cert_format: "file",
    data_path: "../private/data.json",
    cert_path: "../private",
    jwt_secret: "supersecret",
    jwt_issuer: "9EmRJTbIiIb4bIeSsmgcWIjrR6HyETqc",
    jwt_expiration: 1440,
    cors_origin: "*",
    cors_headers: "*",
    cors_methods: "*",
    connection_string: "postgresql://postgresadmin:admin123@localhost:5432/mpsdb",
    instance_name: "localhost",
    mps_tls_config: {
      key: "../private/mpsserver-cert-private.key",
      cert: "../private/mpsserver-cert-public.crt",
      requestCert: true,
      rejectUnauthorized: false,
      minVersion: "TLSv1",
      ciphers: null,
      secureOptions: ["SSL_OP_NO_SSLv2", "SSL_OP_NO_SSLv3"]
    },
    web_tls_config: {
      key: "../private/mpsserver-cert-private.key",
      cert: "../private/mpsserver-cert-public.crt",
      ca: ["../private/root-cert-public.crt"],
      secureOptions: ["SSL_OP_NO_SSLv2", "SSL_OP_NO_SSLv3", "SSL_OP_NO_COMPRESSION", "SSL_OP_CIPHER_SERVER_PREFERENCE", "SSL_OP_NO_TLSv1", "SSL_OP_NO_TLSv11"]
    },
    mqtt_address: "mqtt://127.0.0.1:8883",
  }

  beforeEach(() => {
    mqttProvider = new MqttProvider(config)
  })

  it('Creates MQTT Helper', async () => {
    expect(mqttProvider.turnedOn).toBe(true)
    expect(mqttProvider.mqttUrl).toBeDefined()
    expect(mqttProvider.baseUrl).toBe('mqtt://127.0.0.1:8883')
    expect(mqttProvider.port).toBe(8883)
    expect(mqttProvider.options).toBeDefined()
    expect(mqttProvider.options.port).toBe(8883)
    // TODO: update this to check string prefix
    expect(mqttProvider.options.clientId).toBeDefined()
  })

  it('Checks Connection', () => {
    jest.spyOn(mqtt1, 'connect').mockImplementation(() => {
      return {
        connected: true
      } as any
    })

    expect(mqttProvider.client).toBeUndefined()
    mqttProvider.connectBroker()
    expect(mqttProvider.client.connected).toBe(true)
  })

  it('Should send an event message when turned on', async () => {
    mqttProvider.client = {
      publish: (topic, message, callback) => { return {} as any }
    } as any
    const spy = jest.spyOn(mqttProvider.client, 'publish').mockImplementation((topic, message, callback) => {
      callback()
      return {} as any
    })
    mqttProvider.turnedOn = true
    try {
      await mqttProvider.publishEvent('success', ['testMethod'], 'Test Message')
      expect(spy).toHaveBeenCalled()
    } catch (err) {

    }
  })
  
  it('Should throw error when event message publish fails', async () => {
    mqttProvider.client = {
      publish: (topic, message, callback) => { return {} as any }
    } as any
    const spy = jest.spyOn(mqttProvider.client, 'publish').mockImplementation((topic, message, callback) => {
      callback(new Error())
      return {} as any
    })
    mqttProvider.turnedOn = true
    try {
      await mqttProvider.publishEvent('success', ['testMethod'], 'Test Message')

    } catch (err) {
      expect(spy).toHaveBeenCalled()
      expect(err).toBeDefined()
    }
  })

  it('Should close client when promted', async () => {
    mqttProvider.client = {
      connected: true,
      end: () => { return {} as any }
    } as any
    const spy = jest.spyOn(mqttProvider.client, 'end').mockImplementation(() => {
      return {
        connected: false
      } as any
    })
    mqttProvider.turnedOn = true

    mqttProvider.endBroker()
    expect(spy).toHaveBeenCalled()
    expect(mqttProvider.client.connected).toBe(false)
  })
})

describe('MQTT Turned OFF Tests', () => {
  let mqttProvider: MqttProvider
  const config: configType = {
    common_name: "localhost",
    port: 4433,
    country: "US",
    company: "NoCorp",
    debug: true,
    listen_any: true,
    https: true,
    tls_offload: false,
    web_port: 3000,
    generate_certificates: true,
    debug_level: 2,
    logger_off: false,
    web_admin_user: "standalone",
    web_admin_password: "G@ppm0ym",
    tls_cert: "",
    tls_cert_key: "",
    tls_cert_ca: "",
    web_tls_cert: "",
    web_tls_cert_key: "",
    web_tls_cert_ca: "",
    vault_address: "http://localhost:8200",
    vault_token: "myroot",
    secrets_path: "secret/data/",
    cert_format: "file",
    data_path: "../private/data.json",
    cert_path: "../private",
    jwt_secret: "supersecret",
    jwt_issuer: "9EmRJTbIiIb4bIeSsmgcWIjrR6HyETqc",
    jwt_expiration: 1440,
    cors_origin: "*",
    cors_headers: "*",
    cors_methods: "*",
    connection_string: "postgresql://postgresadmin:admin123@localhost:5432/mpsdb",
    instance_name: "localhost",
    mps_tls_config: {
      key: "../private/mpsserver-cert-private.key",
      cert: "../private/mpsserver-cert-public.crt",
      requestCert: true,
      rejectUnauthorized: false,
      minVersion: "TLSv1",
      ciphers: null,
      secureOptions: ["SSL_OP_NO_SSLv2", "SSL_OP_NO_SSLv3"]
    },
    web_tls_config: {
      key: "../private/mpsserver-cert-private.key",
      cert: "../private/mpsserver-cert-public.crt",
      ca: ["../private/root-cert-public.crt"],
      secureOptions: ["SSL_OP_NO_SSLv2", "SSL_OP_NO_SSLv3", "SSL_OP_NO_COMPRESSION", "SSL_OP_CIPHER_SERVER_PREFERENCE", "SSL_OP_NO_TLSv1", "SSL_OP_NO_TLSv11"]
    },
    mqtt_address: "",
  }

  beforeEach(() => {
    mqttProvider = new MqttProvider(config)
  })

  it('Should NOT Send an event message when turned off', async() => {
    mqttProvider.client = {
      publish: (topic, message, callback)=> { return {} as any }
    } as any
    const spy = jest.spyOn(mqttProvider.client,'publish').mockImplementation((topic, message, callback)=>{
      return {} as any
    })
    mqttProvider.turnedOn = false
    await mqttProvider.publishEvent('success', ['testMethod'], 'Test Message')
    expect(spy).not.toHaveBeenCalled()
  })
})