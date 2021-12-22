import { ConnectedDevice } from '../../amt/ConnectedDevice'
import { devices } from '../../server/mpsserver'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'
import { powerCapabilities } from './powerCapabilities'
import { setupAndConfigurationServiceResponse, softwareIdentityResponse, versionResponse } from '../../test/helper/wsmanResponses'

describe('Power Capabilities', () => {
  let req: Express.Request
  let res: Express.Response
  let statusSpy: jest.SpyInstance
  let jsonSpy: jest.SpyInstance
  let endSpy: jest.SpyInstance
  let mqttSpy: jest.SpyInstance
  let powerCaps
  let swIdentitySpy: jest.SpyInstance
  let setupAndConfigSpy: jest.SpyInstance
  beforeEach(() => {
    req = {
      params: {
        guid: '123456'
      }
    }
    res = {
      status: () => {
        return res
      },
      json: () => {
        return res
      },
      end: () => {
        return res
      }
    }
    statusSpy = jest.spyOn(res as any, 'status')
    jsonSpy = jest.spyOn(res as any, 'json')
    endSpy = jest.spyOn(res as any, 'end')
    mqttSpy = jest.spyOn(MqttProvider, 'publishEvent')

    powerCaps = { Body: { AMT_BootCapabilities: {} } }
    devices['123456'] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
    swIdentitySpy = jest.spyOn(devices['123456'], 'getSoftwareIdentity')
    setupAndConfigSpy = jest.spyOn(devices['123456'], 'getSetupAndConfigurationService')
  })
  it('Should get power capabilities', async () => {
    const expectedResponse = {
      'Power up': 2,
      'Power cycle': 5,
      'Power down': 8,
      Reset: 10,
      'Soft-off': 12,
      'Soft-reset': 14,
      Sleep: 4,
      Hibernate: 7,
      'Reset to IDE-R Floppy': 200,
      'Power on to IDE-R Floppy': 201,
      'Reset to IDE-R CDROM': 202,
      'Power on to IDE-R CDROM': 203,
      'Reset to PXE': 400,
      'Power on to PXE': 401
    }
    jest.spyOn(devices['123456'], 'getPowerCapabilities').mockResolvedValue(powerCaps)
    swIdentitySpy.mockResolvedValue(softwareIdentityResponse.Envelope.Body)
    setupAndConfigSpy.mockResolvedValue(setupAndConfigurationServiceResponse.Envelope)
    await powerCapabilities(req as any, res as any)
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(jsonSpy).toHaveBeenCalledWith(expectedResponse)
    expect(endSpy).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })
  it('Should get power capabilities when amt <= 9', async () => {
    const expectedResponse = {
      'Power up': 2,
      'Power cycle': 5,
      'Power down': 8,
      Reset: 10,
      'Soft-off': 12,
      'Soft-reset': 14,
      Sleep: 4,
      Hibernate: 7,
      'Reset to IDE-R Floppy': 200,
      'Power on to IDE-R Floppy': 201,
      'Reset to IDE-R CDROM': 202,
      'Power on to IDE-R CDROM': 203,
      'Reset to PXE': 400,
      'Power on to PXE': 401
    }
    versionResponse.CIM_SoftwareIdentity.responses = [
      { InstanceID: 'AMT', IsEntity: 'true', VersionString: '9.0.0' }
    ]
    jest.spyOn(devices['123456'], 'getPowerCapabilities').mockResolvedValue(powerCaps)
    swIdentitySpy.mockResolvedValue(softwareIdentityResponse.Envelope.Body)
    setupAndConfigSpy.mockResolvedValue(setupAndConfigurationServiceResponse.Envelope)
    await powerCapabilities(req as any, res as any)
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(jsonSpy).toHaveBeenCalledWith(expectedResponse)
    expect(endSpy).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })
  it('Should get power capabilities when all enabled', async () => {
    const expectedResponse = {
      'Power up': 2,
      'Power cycle': 5,
      'Power down': 8,
      Reset: 10,
      'Soft-off': 12,
      'Soft-reset': 14,
      Sleep: 4,
      Hibernate: 7,
      'Power up to BIOS': 100,
      'Reset to BIOS': 101,
      'Reset to Secure Erase': 104,
      'Reset to IDE-R Floppy': 200,
      'Power on to IDE-R Floppy': 201,
      'Reset to IDE-R CDROM': 202,
      'Power on to IDE-R CDROM': 203,
      'Power on to diagnostic': 300,
      'Reset to diagnostic': 301,
      'Reset to PXE': 400,
      'Power on to PXE': 401
    }
    powerCaps.Body.AMT_BootCapabilities.BIOSSetup = true
    powerCaps.Body.AMT_BootCapabilities.SecureErase = true
    powerCaps.Body.AMT_BootCapabilities.ForceDiagnosticBoot = true
    jest.spyOn(devices['123456'], 'getPowerCapabilities').mockResolvedValue(powerCaps)
    swIdentitySpy.mockResolvedValue(softwareIdentityResponse.Envelope.Body)
    setupAndConfigSpy.mockResolvedValue(setupAndConfigurationServiceResponse.Envelope)
    await powerCapabilities(req as any, res as any)
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(jsonSpy).toHaveBeenCalledWith(expectedResponse)
    expect(endSpy).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })
  it('Should handle error', async () => {
    jest.spyOn(devices['123456'], 'getPowerCapabilities').mockResolvedValue(null)
    swIdentitySpy.mockResolvedValue(softwareIdentityResponse.Envelope.Body)
    setupAndConfigSpy.mockResolvedValue(setupAndConfigurationServiceResponse.Envelope)
    await powerCapabilities(req as any, res as any)
    expect(statusSpy).toHaveBeenCalledWith(500)
    expect(jsonSpy).toHaveBeenCalledWith(ErrorResponse(500, 'Request failed during AMT PowerCapabilities.'))
    expect(endSpy).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })
})
