import { configType } from '../../models/Config'

// Parsing configuration
export const config: configType = {
  common_name: 'localhost',
  port: 4433,
  country: 'US',
  company: 'NoCorp',
  listen_any: true,
  web_port: 3000,
  generate_certificates: true,
  web_admin_user: '',
  web_admin_password: '',
  vault_address: 'http://localhost:8200',
  vault_token: 'myroot',
  mqtt_address: '',
  secrets_path: 'secret/data/',
  cert_format: 'file',
  jwt_secret: 'supersecret',
  jwt_issuer: '9EmRJTbIiIb4bIeSsmgcWIjrR6HyETqc',
  jwt_expiration: 1440,
  db_provider: 'postgres',
  connection_string: 'postgresql://<USERNAME>:<PASSWORD>@localhost:5432/mpsdb?sslmode=no-verify',
  instance_name: 'localhost',
  mps_tls_config: {
    key: '../private/mpsserver-cert-private.key',
    cert: '../private/mpsserver-cert-public.crt',
    requestCert: true,
    rejectUnauthorized: false,
    minVersion: 'TLSv1',
    ciphers: null,
    secureOptions: [
      'SSL_OP_NO_SSLv2',
      'SSL_OP_NO_SSLv3'
    ]
  },
  web_tls_config: {
    key: '../private/mpsserver-cert-private.key',
    cert: '../private/mpsserver-cert-public.crt',
    ca: [
      '../private/root-cert-public.crt'
    ],
    secureOptions: [
      'SSL_OP_NO_SSLv2',
      'SSL_OP_NO_SSLv3',
      'SSL_OP_NO_COMPRESSION',
      'SSL_OP_CIPHER_SERVER_PREFERENCE',
      'SSL_OP_NO_TLSv1',
      'SSL_OP_NO_TLSv11'
    ]
  },
  cert_path: '',
  tls_cert: '',
  tls_cert_key: '',
  tls_cert_ca: '',
  web_tls_cert: '',
  web_tls_cert_key: '',
  web_tls_cert_ca: ''
}
