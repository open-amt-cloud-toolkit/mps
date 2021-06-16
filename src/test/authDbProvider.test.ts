import { IDeviceDb } from "../interfaces/IDeviceDb"
import { ISecretManagerService } from "../models/ISecretManagerService"
import { AuthDbProvider } from "../utils/AuthDbProvider"
import { Device } from '../models/models'
import { configType } from "../models/Config"

import { logger } from '../utils/logger'

// Parsing configuration
const config: configType = {
    common_name: 'localhost',
    port: 4433,
    country: 'US',
    company: 'NoCorp',
    secrets_path: 'secret/data/',
    debug: true,
    listen_any: true,
    https: true,
    tls_offload: false,
    web_port: 3000,
    generate_certificates: true,
    debug_level: 5,
    logger_off: false,
    cert_format: 'file',
    cert_path: "",
    data_path: "",
    web_admin_user: 'standalone',
    web_admin_password: 'G@ppm0ym',
    jwt_secret: "secret",
    jwt_issuer: "issuer",
    jwt_expiration: 24,
    connection_string: '',
    cors_origin: '*',
    cors_headers: '*',
    cors_methods: '*',
    instance_name: 'localhost',
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
    },
    tls_cert: "",
    tls_cert_key: "",
    tls_cert_ca: "",
    web_tls_cert: "",
    web_tls_cert_key: "",
    web_tls_cert_ca: "",
}

const secretManagerServiceStub: ISecretManagerService = {
    getSecretFromKey: async (path, key) => { return "G@ppm0ym" },
    readJsonFromKey: async (path, key) => { return null },
    getSecretAtPath: async (path: string) => { 
        return { data: { AMT_PASSWORD: "G@ppm0ym" } }
    },
    writeSecretWithKey: async (path: string, key: string, keyvalue: any) => { return null },
    listSecretsAtPath: async (path: string) => { return null }
}


test('test if device guid is authorized', async () => {

    const device = {
        connectionStatus: true,
        mpsInstance: "instance",
        hostname: "host",
        guid: "c8429e33-d032-49d3-80e7-d45ddf046fff",
        mpsusername: "user",
        tags: null
    }

    const deviceDbStub: IDeviceDb = {
        get: async () => { return null },
        getDistinctTags: async () => { return null },
        getById: async (guid: string) => { return device },
        getByTags: async (tags: string[], method: string) => { return null },
        delete: async (guid: string) => { return null },
        insert: async (data: Device) => { return null },
        update: async (data: Device) => { return null }
    }

    const authDbProvider = new AuthDbProvider(secretManagerServiceStub, deviceDbStub, logger, config)
    const actual = await authDbProvider.IsGUIDApproved(device.guid);
    expect(actual).toBeTruthy()
})


test('test if device guid is not authorized', async () => {
    const deviceDbStub: IDeviceDb = {
        get: async () => { return null },
        getDistinctTags: async () => { return null },
        getById: async (guid: string) => { return null },
        getByTags: async (tags: string[], method: string) => { return null },
        delete: async (guid: string) => { return null },
        insert: async (data: Device) => { return null },
        update: async (data: Device) => { return null }
    }

    const authDbProvider = new AuthDbProvider(secretManagerServiceStub, deviceDbStub, logger, config)
    const actual = await authDbProvider.IsGUIDApproved("c8429e33-d032-49d3-80e7-d45ddf046fff");
    expect(actual).toBeFalsy()
})

test('test if device is authorized', async () => {

    const device = {
        connectionStatus: true,
        mpsInstance: "instance",
        hostname: "host",
        guid: "c8429e33-d032-49d3-80e7-d45ddf046fff",
        mpsusername: "user",
        tags: null
    }

    const deviceDbStub: IDeviceDb = {
        get: async () => { return null },
        getDistinctTags: async () => { return null },
        getById: async (guid: string) => { return device },
        getByTags: async (tags: string[], method: string) => { return null },
        delete: async (guid: string) => { return null },
        insert: async (data: Device) => { return null },
        update: async (data: Device) => { return null }
    }

    const authDbProvider = new AuthDbProvider(secretManagerServiceStub, deviceDbStub, logger, config)
    const actual = await authDbProvider.CIRAAuth(device.guid, device.mpsusername, "G@ppm0ym");
    expect(actual).toBeTruthy()
})

test('test if device is authorized with invalid username', async () => {

    const device = {
        connectionStatus: true,
        mpsInstance: "instance",
        hostname: "host",
        guid: "c8429e33-d032-49d3-80e7-d45ddf046fff",
        mpsusername: "user",
        tags: null
    }

    const deviceDbStub: IDeviceDb = {
        get: async () => { return null },
        getDistinctTags: async () => { return null },
        getById: async (guid: string) => { return device },
        getByTags: async (tags: string[], method: string) => { return null },
        delete: async (guid: string) => { return null },
        insert: async (data: Device) => { return null },
        update: async (data: Device) => { return null }
    }

    const authDbProvider = new AuthDbProvider(secretManagerServiceStub, deviceDbStub, logger, config)
    const actual = await authDbProvider.CIRAAuth(device.guid, "admin", "G@ppm0ym");
    expect(actual).toBeFalsy()
})

test('test if device is authorized with invalid password', async () => {

    const device = {
        connectionStatus: true,
        mpsInstance: "instance",
        hostname: "host",
        guid: "c8429e33-d032-49d3-80e7-d45ddf046fff",
        mpsusername: "user",
        tags: null
    }

    const deviceDbStub: IDeviceDb = {
        get: async () => { return null },
        getDistinctTags: async () => { return null },
        getById: async (guid: string) => { return device },
        getByTags: async (tags: string[], method: string) => { return null },
        delete: async (guid: string) => { return null },
        insert: async (data: Device) => { return null },
        update: async (data: Device) => { return null }
    }

    const authDbProvider = new AuthDbProvider(secretManagerServiceStub, deviceDbStub, logger, config)
    const actual = await authDbProvider.CIRAAuth(device.guid, "admin", "P@ssw0rd");
    expect(actual).toBeFalsy()
})


test('test if device password is returned', async () => {

    const device = {
        connectionStatus: true,
        mpsInstance: "instance",
        hostname: "host",
        guid: "c8429e33-d032-49d3-80e7-d45ddf046fff",
        mpsusername: "user",
        tags: null
    }

    const deviceDbStub: IDeviceDb = {
        get: async () => { return null },
        getDistinctTags: async () => { return null },
        getById: async (guid: string) => { return device },
        getByTags: async (tags: string[], method: string) => { return null },
        delete: async (guid: string) => { return null },
        insert: async (data: Device) => { return null },
        update: async (data: Device) => { return null }
    }

    const authDbProvider = new AuthDbProvider(secretManagerServiceStub, deviceDbStub, logger, config)
    const actual = await authDbProvider.getAmtPassword(device.guid);
    expect(actual).not.toBeNull()
    expect(actual).toBeDefined();
    expect(actual).toHaveLength(2)
    expect(actual[1]).toEqual(`G@ppm0ym`)
})

test('test if device password is not returned', async () => {

    const device = {
        connectionStatus: true,
        mpsInstance: "instance",
        hostname: "host",
        guid: "c8429e33-d032-49d3-80e7-d45ddf046fff",
        mpsusername: "user",
        tags: null
    }

    const secretManagerService: ISecretManagerService = {
        getSecretFromKey: async (path, key) => { return "G@ppm0ym" },
        readJsonFromKey: async (path, key) => { return null },
        getSecretAtPath: async (path: string) => { 
            return null
        },
        writeSecretWithKey: async (path: string, key: string, keyvalue: any) => { return null },
        listSecretsAtPath: async (path: string) => { return null }
    }
    

    const deviceDbStub: IDeviceDb = {
        get: async () => { return null },
        getDistinctTags: async () => { return null },
        getById: async (guid: string) => { return device },
        getByTags: async (tags: string[], method: string) => { return null },
        delete: async (guid: string) => { return null },
        insert: async (data: Device) => { return null },
        update: async (data: Device) => { return null }
    }

    const authDbProvider = new AuthDbProvider(secretManagerService, deviceDbStub, logger, config)
    const actual = await authDbProvider.getAmtPassword(device.guid);
    expect(actual).toBeNull()
})
