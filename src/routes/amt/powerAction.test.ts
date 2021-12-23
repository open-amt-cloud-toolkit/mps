import { CIM } from '@open-amt-cloud-toolkit/wsman-messages/dist'
import { ConnectedDevice } from '../../amt/ConnectedDevice'

import { devices } from '../../server/mpsserver'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'
import { powerAction } from './powerAction'

describe('Power Capabilities', () => {
  let req: Express.Request
  let res: Express.Response
  let statusSpy: jest.SpyInstance
  let jsonSpy: jest.SpyInstance
  let endSpy: jest.SpyInstance
  let mqttSpy: jest.SpyInstance
  let powerActionFromDevice: CIM.Models.PowerActionResponse
  let getBootOptionsSpy: jest.SpyInstance
  let setBootConfigurationSpy: jest.SpyInstance
  beforeEach(() => {
    req = {
      params: {
        guid: '123456'
      },
      body: {
        action: 8
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
    powerActionFromDevice = { RequestPowerStateChange_OUTPUT: { ReturnValue: 0 } }
    devices['123456'] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
    getBootOptionsSpy = jest.spyOn(devices['123456'], 'getBootOptions').mockResolvedValue({ AMT_BootSettingData: {} } as any)
    setBootConfigurationSpy = jest.spyOn(devices['123456'], 'setBootConfiguration').mockResolvedValue({} as any)
  })
  it('Should send power action', async () => {
    const expectedResponse = {
      ReturnValue: 0,
      ReturnValueStr: 'SUCCESS'
    }
    jest.spyOn(devices['123456'], 'sendPowerAction').mockResolvedValue(powerActionFromDevice)
    await powerAction(req as any, res as any)
    expect(getBootOptionsSpy).toHaveBeenCalled()
    expect(setBootConfigurationSpy).toHaveBeenCalled()
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(jsonSpy).toHaveBeenCalledWith(expectedResponse)
    expect(endSpy).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })

  it('Should send power action with unknown error', async () => {
    const expectedResponse = {
      ReturnValue: -1,
      ReturnValueStr: 'UNKNOWN_ERROR'
    }
    const powerActionErrorFromDevice: CIM.Models.PowerActionResponse = { RequestPowerStateChange_OUTPUT: { ReturnValue: -1 } }
    jest.spyOn(devices['123456'], 'sendPowerAction').mockResolvedValue(powerActionErrorFromDevice)

    await powerAction(req as any, res as any)
    expect(getBootOptionsSpy).toHaveBeenCalled()
    expect(setBootConfigurationSpy).toHaveBeenCalled()
    expect(statusSpy).toHaveBeenCalledWith(200)
    expect(jsonSpy).toHaveBeenCalledWith(expectedResponse)
    expect(endSpy).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })

  it('Should handle error', async () => {
    jest.spyOn(devices['123456'], 'sendPowerAction').mockResolvedValue(null)
    await powerAction(req as any, res as any)
    expect(getBootOptionsSpy).toHaveBeenCalled()
    expect(setBootConfigurationSpy).toHaveBeenCalled()
    expect(statusSpy).toHaveBeenCalledWith(500)
    expect(jsonSpy).toHaveBeenCalledWith(ErrorResponse(500, 'Request failed during AMT Power action execution.'))
    expect(endSpy).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })
})
