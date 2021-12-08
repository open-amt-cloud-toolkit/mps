import { ConnectedDevice } from '../../amt/ConnectedDevice'
import { devices } from '../../server/mpsserver'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'
import { powerCapabilities } from './powerCapabilities'

describe('Power Capabilities', () => {
  let req: Express.Request
  let res: Express.Response
  let statusSpy: jest.SpyInstance
  let jsonSpy: jest.SpyInstance
  let endSpy: jest.SpyInstance
  let mqttSpy: jest.SpyInstance
  let powerCaps
  let version
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

    powerCaps = { Envelope: { Body: { AMT_BootCapabilities: {} } } }
    version = {
      AMT_SetupAndConfigurationService: {
        CreationClassName: 'AMT_SetupAndConfigurationService',
        ElementName: 'Intel(r) AMT Setup and Configuration Service',
        EnabledState: '5',
        Name: 'Intel(r) AMT Setup and Configuration Service',
        PasswordModel: '1'
      },
      CIM_SoftwareIdentity: [
        { InstanceID: 'Flash', IsEntity: 'true', VersionString: '12.0.67' },
        { InstanceID: 'Netstack', IsEntity: 'true', VersionString: '12.0.67' },
        { InstanceID: 'AMTApps', IsEntity: 'true', VersionString: '12.0.67' },
        { InstanceID: 'AMT', IsEntity: 'true', VersionString: '12.0.67' },
        { InstanceID: 'Sku', IsEntity: 'true', VersionString: '16392' },
        { InstanceID: 'VendorID', IsEntity: 'true', VersionString: '8086' },
        { InstanceID: 'Build Number', IsEntity: 'true', VersionString: '1579' },
        { InstanceID: 'Recovery Version', IsEntity: 'true', VersionString: '12.0.67' },
        { InstanceID: 'Recovery Build Num', IsEntity: 'true', VersionString: '1579' },
        { InstanceID: 'Legacy Mode', IsEntity: 'true', VersionString: 'False' },
        { InstanceID: 'AMT FW Core Version', IsEntity: 'true', VersionString: '12.0.67' }
      ]
    }
    devices['123456'] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
  })
  it('Should get power capabilities', async () => {
    const expectedResponse = {
      Hibernate: 7,
      'Power cycle': 5,
      'Power down': 8,
      'Power on to IDE-R CDROM': 203,
      'Power on to IDE-R Floppy': 201,
      'Power on to PXE': 401,
      'Power up': 2,
      Reset: 10,
      'Reset to IDE-R CDROM': 202,
      'Reset to IDE-R Floppy': 200,
      'Reset to PXE': 400,
      Sleep: 4,
      'Soft-off': 12,
      'Soft-reset': 14
    }
    jest.spyOn(devices['123456'], 'getPowerCapabilities').mockResolvedValue(powerCaps)
    jest.spyOn(devices['123456'], 'getVersion').mockResolvedValue(version)
    await powerCapabilities(req as any, res as any)
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(jsonSpy).toHaveBeenCalledWith(expectedResponse)
    expect(endSpy).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })
  it('Should get power capabilities when amt <= 9', async () => {
    const expectedResponse = {
      'Power cycle': 5,
      'Power down': 8,
      'Power on to IDE-R CDROM': 203,
      'Power on to IDE-R Floppy': 201,
      'Power on to PXE': 401,
      'Power up': 2,
      Reset: 10,
      'Reset to IDE-R CDROM': 202,
      'Reset to IDE-R Floppy': 200,
      'Reset to PXE': 400
    }
    version.CIM_SoftwareIdentity = [
      { InstanceID: 'AMT', IsEntity: 'true', VersionString: '9.0.0' }
    ]
    jest.spyOn(devices['123456'], 'getPowerCapabilities').mockResolvedValue(powerCaps)
    jest.spyOn(devices['123456'], 'getVersion').mockResolvedValue(version)
    await powerCapabilities(req as any, res as any)
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(jsonSpy).toHaveBeenCalledWith(expectedResponse)
    expect(endSpy).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })
  it('Should get power capabilities when all enabled', async () => {
    const expectedResponse = {
      Hibernate: 7,
      'Power cycle': 5,
      'Power down': 8,
      'Power on to IDE-R CDROM': 203,
      'Power on to IDE-R Floppy': 201,
      'Power on to PXE': 401,
      'Power on to diagnostic': 300,
      'Power up': 2,
      'Power up to BIOS': 100,
      Reset: 10,
      'Reset to BIOS': 101,
      'Reset to IDE-R CDROM': 202,
      'Reset to IDE-R Floppy': 200,
      'Reset to PXE': 400,
      'Reset to Secure Erase': 104,
      'Reset to diagnostic': 301,
      Sleep: 4,
      'Soft-off': 12,
      'Soft-reset': 14
    }
    powerCaps.Envelope.Body.AMT_BootCapabilities.BIOSSetup = true
    powerCaps.Envelope.Body.AMT_BootCapabilities.SecureErase = true
    powerCaps.Envelope.Body.AMT_BootCapabilities.ForceDiagnosticBoot = true
    jest.spyOn(devices['123456'], 'getPowerCapabilities').mockResolvedValue(powerCaps)
    jest.spyOn(devices['123456'], 'getVersion').mockResolvedValue(version)
    await powerCapabilities(req as any, res as any)
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(jsonSpy).toHaveBeenCalledWith(expectedResponse)
    expect(endSpy).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })
  it('Should handle error', async () => {
    jest.spyOn(devices['123456'], 'getPowerCapabilities').mockResolvedValue(null)
    jest.spyOn(devices['123456'], 'getVersion').mockResolvedValue(version)
    await powerCapabilities(req as any, res as any)
    expect(statusSpy).toHaveBeenCalledWith(500)
    expect(jsonSpy).toHaveBeenCalledWith(ErrorResponse(500, 'Request failed during AMT PowerCapabilities.'))
    expect(endSpy).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })
})
