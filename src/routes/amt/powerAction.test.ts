import { CIM } from '@open-amt-cloud-toolkit/wsman-messages/dist'
import { CIRAHandler } from '../../amt/CIRAHandler'
import { DeviceAction } from '../../amt/DeviceAction'
import { HttpHandler } from '../../amt/HttpHandler'
import { messages } from '../../logging'
import { createSpyObj } from '../../test/helper/jest'
import { ErrorResponse } from '../../utils/amtHelper'
import { MqttProvider } from '../../utils/MqttProvider'
import { powerAction } from './powerAction'

describe('Power Capabilities', () => {
  let req: Express.Request
  let resSpy
  let mqttSpy: jest.SpyInstance
  let powerActionFromDevice: CIM.Models.PowerActionResponse
  let getBootOptionsSpy: jest.SpyInstance
  let setBootConfigurationSpy: jest.SpyInstance
  let device: DeviceAction
  beforeEach(() => {
    const handler = new CIRAHandler(new HttpHandler(), 'admin', 'P@ssw0rd')
    device = new DeviceAction(handler, null)
    req = {
      params: {
        guid: '123456'
      },
      body: {
        action: 8
      },
      deviceAction: device
    }
    resSpy = createSpyObj('Response', ['status', 'json', 'end', 'send'])
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()
    mqttSpy = jest.spyOn(MqttProvider, 'publishEvent')
    powerActionFromDevice = { RequestPowerStateChange_OUTPUT: { ReturnValue: 0 } }
    getBootOptionsSpy = jest.spyOn(device, 'getBootOptions').mockResolvedValue({ AMT_BootSettingData: {} } as any)
    setBootConfigurationSpy = jest.spyOn(device, 'setBootConfiguration').mockResolvedValue({} as any)
  })
  it('Should send power action', async () => {
    const expectedResponse = {
      ReturnValue: 0,
      ReturnValueStr: 'SUCCESS'
    }
    jest.spyOn(device, 'sendPowerAction').mockResolvedValue(powerActionFromDevice)
    await powerAction(req as any, resSpy)
    expect(getBootOptionsSpy).toHaveBeenCalled()
    expect(setBootConfigurationSpy).toHaveBeenCalled()
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.json).toHaveBeenCalledWith(expectedResponse)
    expect(resSpy.end).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })

  it('Should send power action with unknown error', async () => {
    const expectedResponse = {
      ReturnValue: -1,
      ReturnValueStr: 'UNKNOWN_ERROR'
    }
    const powerActionErrorFromDevice: CIM.Models.PowerActionResponse = { RequestPowerStateChange_OUTPUT: { ReturnValue: -1 } }
    jest.spyOn(device, 'sendPowerAction').mockResolvedValue(powerActionErrorFromDevice)

    await powerAction(req as any, resSpy)
    expect(getBootOptionsSpy).toHaveBeenCalled()
    expect(setBootConfigurationSpy).toHaveBeenCalled()
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.json).toHaveBeenCalledWith(expectedResponse)
    expect(resSpy.end).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })

  it('Should handle error', async () => {
    jest.spyOn(device, 'sendPowerAction').mockResolvedValue(null)
    await powerAction(req as any, resSpy)
    expect(getBootOptionsSpy).toHaveBeenCalled()
    expect(setBootConfigurationSpy).toHaveBeenCalled()
    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalledWith(ErrorResponse(500, messages.POWER_ACTION_EXCEPTION))
    expect(resSpy.end).toHaveBeenCalled()
    expect(mqttSpy).toHaveBeenCalled()
  })
})
