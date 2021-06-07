// constructor 
// publish event
// end client

import { MqttProvider } from '../src/utils/mqttHelper'
import { configType } from '../src/models/Config'
import { logger as log } from '../src/utils/logger'

describe('Basic MQTT Tests', () => {
    const config: configType = {
        use_allowlist : false,
        common_name: "localhost",
        port: 4433,
        username: "standalone",
        pass: "G@ppm0ym",
        use_global_mps_credentials: true,
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
        mqtt_address: "mqtt://mosquitto:8883",
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
            secureOptions: ["SSL_OP_NO_SSLv2", "SSL_OP_NO_SSLv3", "SSL_OP_NO_COMPRESSION" , "SSL_OP_CIPHER_SERVER_PREFERENCE", "SSL_OP_NO_TLSv1", "SSL_OP_NO_TLSv11"]
        }
    }

    const mqtt: MqttProvider = new MqttProvider(config)

    it('Checks Construction', () => {
        expect(mqtt.turnedOn).toBe(true)
        expect(mqtt.client.connected).toBe(true)
    })

    it('Publish and event', () => {
        let sent: Boolean
        let p = mqtt.publishEvent('success', ['testMethod'], 'Test Message')

        p.then(() => {
            sent = true
        }).catch((message) => {
            sent = false
            log.error(message)
        })

        expect(sent).toBe(true)
    })

    it('Closes the client', () => {
        mqtt.end()
        expect(mqtt.client.connected).toBe(false)
    })
})
