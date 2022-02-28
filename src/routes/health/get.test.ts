import { getHealthCheck } from './get'
import { Environment } from '../../utils/Environment'
import { createSpyObj } from '../../test/helper/jest'
import { MqttProvider } from '../../utils/MqttProvider'
import { ErrorResponse } from '../../utils/amtHelper'
import { messages } from '../../logging'

describe('Checks health of dependent services', () => {
  let resSpy
  let req
  let mqttSpy: jest.SpyInstance
  beforeEach(() => {
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    req = {
      mpsService: {
        secrets: createSpyObj('SecretProvider', ['health'])
      },
      db: createSpyObj('DB', ['query'])
    }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()
    mqttSpy = jest.spyOn(MqttProvider, 'publishEvent')
  })
  it('should handle health check failed', async () => {
    await getHealthCheck(null, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith(ErrorResponse(500, messages.HEALTH_CHECK_FAILED))
    expect(mqttSpy).toHaveBeenCalled()
  })
  it('should be healthy when database is ready and vault is unsealed', async () => {
    Environment.Config = { db_provider: 'POSTGRES' } as any

    req.mpsService.secrets.health.mockReturnValue({ initialized: true, sealed: false })
    await getHealthCheck(req, resSpy)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    // expect(resSpy.json).toHaveBeenCalledWith({
    //   db: {
    //     name: 'POSTGRES',
    //     status: 'OK'
    //   },
    //   secretStore: {
    //     name: 'VAULT',
    //     status: {
    //       initialized: true,
    //       sealed: false
    //     }
    //   }
    // })
    // expect(resSpy.status).not.toHaveBeenCalledWith(503)
  })
  it('should not be healthy when db error', async () => {
    req.mpsService.secrets.health.mockReturnValue({ initialized: true, sealed: false })
    req.db.query.mockRejectedValue({ code: '28P01' })
    await getHealthCheck(req, resSpy)
    // expect(resSpy.json).toHaveBeenCalledWith({
    //   db: {
    //     name: 'POSTGRES',
    //     status: 'invalid_password'
    //   },
    //   secretStore: {
    //     name: 'VAULT',
    //     status: {
    //       initialized: true,
    //       sealed: false
    //     }
    //   }
    // })
    expect(resSpy.status).toHaveBeenCalledWith(503)
  })
  it('should not be healthy when vault sealed', async () => {
    req.mpsService.secrets.health.mockReturnValue({ initialized: true, sealed: true })
    await getHealthCheck(req, resSpy)
    // expect(resSpy.json).toHaveBeenCalledWith({
    //   db: {
    //     name: 'POSTGRES',
    //     status: 'OK'
    //   },
    //   secretStore: {
    //     name: 'VAULT',
    //     status: {
    //       initialized: true,
    //       sealed: true
    //     }
    //   }
    // })
    expect(resSpy.status).toHaveBeenCalledWith(503)
  })
  it('should not be healthy when vault is not ready', async () => {
    req.mpsService.secrets.health.mockRejectedValue({ error: { code: 'ECONNREFUSED' } })
    await getHealthCheck(req, resSpy)
    // expect(resSpy.json).toHaveBeenCalledWith({
    //   db: {
    //     name: 'POSTGRES',
    //     status: 'OK'
    //   },
    //   secretStore: {
    //     name: 'VAULT',
    //     status: 'ECONNREFUSED'
    //   }
    // })
    expect(resSpy.status).toHaveBeenCalledWith(503)
  })
})
