import { AMT } from '@open-amt-cloud-toolkit/wsman-messages/dist'
import { ConnectedDevice } from '../../amt/ConnectedDevice'
import { devices } from '../../server/mpsserver'
import { createSpyObj } from '../../test/helper/jest'
import { bootOptions, determinePowerAction, setBootData, setBootSource } from './bootOptions'

describe('Boot Options', () => {
  let resSpy: any
  let req: any
  let getBootOptionsSpy: jest.SpyInstance
  let setBootConfigurationSpy: jest.SpyInstance
  let forceBootModeSpy: jest.SpyInstance
  let changeBootOrderSpy: jest.SpyInstance
  let sendPowerActionSpy: jest.SpyInstance
  let bootSettingData: AMT.Models.BootSettingData|any
  beforeEach(() => {
    resSpy = createSpyObj('Response', ['status', 'json', 'send'])
    req = { params: { guid: '4c4c4544-004b-4210-8033-b6c04f504633' }, body: { action: 400, useSOL: false } }
    resSpy.status.mockReturnThis()
    resSpy.json.mockReturnThis()
    resSpy.send.mockReturnThis()
    bootSettingData = {
      BIOSPause: 'false',
      BIOSSetup: 'false',
      BootMediaIndex: '0',
      ConfigurationDataReset: 'false',
      FirmwareVerbosity: '0',
      ForcedProgressEvents: 'false',
      IDERBootDevice: '0', // 0 : Boot on Floppy, 1 : Boot on IDER
      LockKeyboard: 'false',
      LockPowerButton: 'false',
      LockResetButton: 'false',
      LockSleepButton: 'false',
      ReflashBIOS: 'false',
      UseIDER: 'false',
      UseSOL: 'false',
      UseSafeMode: 'false',
      UserPasswordBypass: 'false',
      SecureErase: 'false'
    }
    devices['4c4c4544-004b-4210-8033-b6c04f504633'] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
    getBootOptionsSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'getBootOptions')
    getBootOptionsSpy.mockResolvedValue({ AMT_BootSettingData: bootSettingData })
    setBootConfigurationSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'setBootConfiguration')
    setBootConfigurationSpy.mockResolvedValue({})
    forceBootModeSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'forceBootMode')
    forceBootModeSpy.mockResolvedValue({})
    changeBootOrderSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'changeBootOrder')
    changeBootOrderSpy.mockResolvedValue({})
    sendPowerActionSpy = jest.spyOn(devices['4c4c4544-004b-4210-8033-b6c04f504633'], 'sendPowerAction')
    sendPowerActionSpy.mockResolvedValue({ RequestPowerStateChange_OUTPUT: { ReturnValue: 0 } })
  })
  it('should handle error', async () => {
    setBootConfigurationSpy.mockRejectedValue({})

    await bootOptions(req, resSpy)

    expect(resSpy.status).toHaveBeenCalledWith(500)
    expect(resSpy.json).toHaveBeenCalled()
  })
  it('should do advanced power action when force PXE Boot w/ Reset', async () => {
    await bootOptions(req, resSpy)
    expect(getBootOptionsSpy).toHaveBeenCalled()
    expect(setBootConfigurationSpy).toHaveBeenCalled()
    expect(forceBootModeSpy).toHaveBeenCalledWith('Force PXE Boot')
    expect(changeBootOrderSpy).toHaveBeenCalled()
    expect(sendPowerActionSpy).toHaveBeenCalledWith(10)
    expect(resSpy.status).toHaveBeenCalledWith(200)
    expect(resSpy.json).toHaveBeenCalledWith({ ReturnValue: 0, ReturnValueStr: 'SUCCESS' })
  })
  it('should do advanced power action when NOT force PXE Boot', async () => {
    req.body.action = 201
    await bootOptions(req, resSpy)
    expect(getBootOptionsSpy).toHaveBeenCalled()
    expect(setBootConfigurationSpy).toHaveBeenCalled()
    expect(forceBootModeSpy).not.toHaveBeenCalledWith('')
    expect(changeBootOrderSpy).not.toHaveBeenCalled()
    expect(sendPowerActionSpy).toHaveBeenCalledWith(2)
  })
  it('Should set boot data when Power up to BIOS', () => {
    const bootSettingsToSend = setBootData(100, false, bootSettingData)
    expect(bootSettingsToSend.BIOSPause).toBe(false)
    expect(bootSettingsToSend.BIOSSetup).toBe(true)
    expect(bootSettingsToSend.BootMediaIndex).toBe(0)
    expect(bootSettingsToSend.ConfigurationDataReset).toBe(false)
    expect(bootSettingsToSend.FirmwareVerbosity).toBe(0)
    expect(bootSettingsToSend.ForcedProgressEvents).toBe(false)
    expect(bootSettingsToSend.IDERBootDevice).toBe(0)
    expect(bootSettingsToSend.LockKeyboard).toBe(false)
    expect(bootSettingsToSend.LockPowerButton).toBe(false)
    expect(bootSettingsToSend.LockResetButton).toBe(false)
    expect(bootSettingsToSend.LockSleepButton).toBe(false)
    expect(bootSettingsToSend.ReflashBIOS).toBe(false)
    expect(bootSettingsToSend.UseIDER).toBe(false)
    expect(bootSettingsToSend.UseSOL).toBe(false)
    expect(bootSettingsToSend.UseSafeMode).toBe(false)
    expect(bootSettingsToSend.UserPasswordBypass).toBe(false)
    expect(bootSettingsToSend.SecureErase).toBe(false)
  })
  it('Should set boot data when reset to BIOS', () => {
    const bootSettingsToSend = setBootData(101, false, bootSettingData)
    expect(bootSettingsToSend.BIOSSetup).toBe(true)
  })
  it('Should set boot data when reset up to BIOS using SOL', () => {
    const bootSettingsToSend = setBootData(101, true, bootSettingData)
    expect(bootSettingsToSend.BIOSSetup).toBe(true)
    expect(bootSettingsToSend.UseSOL).toBe(true)
  })
  it('Should set boot data IDERBootDevice when reset to IDER-CD-ROM', () => {
    const bootSettingsToSend = setBootData(202, false, bootSettingData)
    expect(bootSettingsToSend.UseIDER).toBe(true)
    expect(bootSettingsToSend.IDERBootDevice).toBe(1)
  })
  it('Should set boot data IDERBootDevice when power up to IDER-CD-ROM', () => {
    const bootSettingsToSend = setBootData(203, false, bootSettingData)
    expect(bootSettingsToSend.UseIDER).toBe(true)
    expect(bootSettingsToSend.IDERBootDevice).toBe(1)
  })
  it('Should set boot data IDERBootDevice when reset to IDER-Floppy', () => {
    const bootSettingsToSend = setBootData(200, false, bootSettingData)
    expect(bootSettingsToSend.UseIDER).toBe(true)
    expect(bootSettingsToSend.IDERBootDevice).toBe(0)
  })
  it('Should set boot data IDERBootDevice when power up to IDER-Floppy', () => {
    const bootSettingsToSend = setBootData(201, false, bootSettingData)
    expect(bootSettingsToSend.UseIDER).toBe(true)
    expect(bootSettingsToSend.IDERBootDevice).toBe(0)
  })
  it('Should NOT set bootSource when 299', () => {
    const result = setBootSource(299)
    expect(result).toBeUndefined()
  })
  it('Should NOT set bootSource when 402', () => {
    const result = setBootSource(402)
    expect(result).toBeUndefined()
  })
  it('Should set bootSource when 300', () => {
    const result = setBootSource(300)
    expect(result).toBe('Force Diagnostic Boot')
  })
  it('Should set bootSource when 301', () => {
    const result = setBootSource(301)
    expect(result).toBe('Force Diagnostic Boot')
  })
  it('Should set bootSource when 400', () => {
    const result = setBootSource(400)
    expect(result).toBe('Force PXE Boot')
  })
  it('Should set bootSource when 401', () => {
    const result = setBootSource(401)
    expect(result).toBe('Force PXE Boot')
  })
  it('Should determine power action when 100', () => {
    const result = determinePowerAction(100)
    expect(result).toBe(2)
  })
  it('Should determine power action when 201', () => {
    const result = determinePowerAction(201)
    expect(result).toBe(2)
  })
  it('Should determine power action when 203', () => {
    const result = determinePowerAction(203)
    expect(result).toBe(2)
  })
  it('Should determine power action when 401', () => {
    const result = determinePowerAction(401)
    expect(result).toBe(2)
  })
  it('Should determine power action when 101', () => {
    const result = determinePowerAction(101)
    expect(result).toBe(10)
  })
  //   it('Should determine power action when 104', () => {
  //     const result = determinePowerAction(104)
  //     expect(result).toBe(10)
  //   })
  it('Should determine power action when 200', () => {
    const result = determinePowerAction(200)
    expect(result).toBe(10)
  })
  it('Should determine power action when 202', () => {
    const result = determinePowerAction(202)
    expect(result).toBe(10)
  })
  it('Should determine power action when 400', () => {
    const result = determinePowerAction(400)
    expect(result).toBe(10)
  })
})
