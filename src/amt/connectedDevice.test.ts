import { CIRASocket } from '../models/models'
import {
  amtMessageLog,
  auditLog,
  cancelOptInResponse,
  enumerateResponse,
  generalSettings,
  positionToFirstRecord,
  sendOptInCodeResponse,
  serviceAvailableToElement,
  startOptInResponse
} from '../test/helper/wsmanResponses'
import { ConnectedDevice } from './ConnectedDevice'

const socket: CIRASocket = null
const device = new ConnectedDevice(socket, 'admin', 'P@ssw0rd')
describe('Connected Device', () => {
  let enumerateSpy: jest.SpyInstance
  let pullSpy: jest.SpyInstance
  let getSpy: jest.SpyInstance
  let sendSpy: jest.SpyInstance

  beforeEach(() => {
    enumerateSpy = jest.spyOn(device.ciraHandler, 'Enumerate')
    pullSpy = jest.spyOn(device.ciraHandler, 'Pull')
    getSpy = jest.spyOn(device.ciraHandler, 'Get')
    sendSpy = jest.spyOn(device.ciraHandler, 'Send')
  })
  describe('power', () => {
    it('should return null when enumerate call to power state is null', async () => {
      enumerateSpy.mockResolvedValueOnce(null)
      const result = await device.getPowerState()
      expect(result).toBe(null)
    })
    it('should return null when pull call to power state is null', async () => {
      enumerateSpy.mockResolvedValueOnce(enumerateResponse)
      pullSpy.mockResolvedValue(null)
      const result = await device.getPowerState()
      expect(result).toBe(null)
    })
    it('should return power state', async () => {
      enumerateSpy.mockResolvedValueOnce(enumerateResponse)
      pullSpy.mockResolvedValue(serviceAvailableToElement)
      const result = await device.getPowerState()
      expect(result.Envelope.Body.PullResponse.Items.CIM_AssociatedPowerManagementService.PowerState).toBe('4')
    })
    it('should send power action', async () => {
      getSpy.mockResolvedValueOnce({ Envelope: { Body: { RequestPowerStateChange_OUTPUT: { ReturnValue: 0 } } } })
      const result = await device.sendPowerAction(10)
      expect(result).toEqual({ RequestPowerStateChange_OUTPUT: { ReturnValue: 0 } })
    })
  })

  describe('boot', () => {
    it('should forceBootMode', async () => {
      sendSpy.mockResolvedValue(null)
      const result = await device.forceBootMode('')
      expect(sendSpy).toHaveBeenCalled()
      expect(result).toBe(null)
    })
    it('should changeBootOrder', async () => {
      sendSpy.mockResolvedValue({})
      const result = await device.changeBootOrder('')
      expect(sendSpy).toHaveBeenCalled()
      expect(result).toEqual({})
    })
    it('should setBootConfiguration', async () => {
      sendSpy.mockResolvedValue({ Envelope: { Body: {} } })
      const result = await device.setBootConfiguration({})
      expect(sendSpy).toHaveBeenCalled()
      expect(result).toEqual({})
    })
    it('should getBootOptions', async () => {
      getSpy.mockResolvedValue({ Envelope: { Body: {} } })
      const result = await device.getBootOptions()
      expect(sendSpy).toHaveBeenCalled()
      expect(result).toEqual({})
    })
  })
  describe('version', () => {
    it('should return null when enumerate call to software identity is null', async () => {
      enumerateSpy.mockResolvedValueOnce(null)
      const result = await device.getVersion()
      expect(result).toBe(null)
    })
    it('should return null when pull call to software identity is null', async () => {
      enumerateSpy.mockResolvedValueOnce({ Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '0', Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/EnumerateResponse', MessageID: 'uuid:00000000-8086-8086-8086-000000000001', ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SoftwareIdentity' }, Body: { EnumerateResponse: { EnumerationContext: '01000000-0000-0000-0000-000000000000' } } } })
      pullSpy.mockResolvedValue(null)
      const result = await device.getVersion()
      expect(result).toBe(null)
    })
    it('should return null when get call to AMT SetupAndConfigurationService is null ', async () => {
      enumerateSpy.mockResolvedValueOnce({ Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '0', Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/EnumerateResponse', MessageID: 'uuid:00000000-8086-8086-8086-000000000001', ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SoftwareIdentity' }, Body: { EnumerateResponse: { EnumerationContext: '01000000-0000-0000-0000-000000000000' } } } })
      pullSpy.mockResolvedValueOnce({ Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '1', Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse', MessageID: 'uuid:00000000-8086-8086-8086-000000000002', ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SoftwareIdentity' }, Body: { PullResponse: { Items: { CIM_SoftwareIdentity: [{ InstanceID: 'Flash', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'Netstack', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'AMTApps', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'AMT', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'Sku', IsEntity: 'true', VersionString: '16392' }, { InstanceID: 'VendorID', IsEntity: 'true', VersionString: '8086' }, { InstanceID: 'Build Number', IsEntity: 'true', VersionString: '1706' }, { InstanceID: 'Recovery Version', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'Recovery Build Num', IsEntity: 'true', VersionString: '1706' }, { InstanceID: 'Legacy Mode', IsEntity: 'true', VersionString: 'False' }, { InstanceID: 'AMT FW Core Version', IsEntity: 'true', VersionString: '15.0.23' }] }, EndOfSequence: '' } } } })
      getSpy.mockResolvedValue(null)
      const result = await device.getVersion()
      expect(result).toBe(null)
    })
    it('should get version ', async () => {
      enumerateSpy.mockResolvedValueOnce({ Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '0', Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/EnumerateResponse', MessageID: 'uuid:00000000-8086-8086-8086-000000000001', ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SoftwareIdentity' }, Body: { EnumerateResponse: { EnumerationContext: '01000000-0000-0000-0000-000000000000' } } } })
      pullSpy.mockResolvedValueOnce({ Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '1', Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse', MessageID: 'uuid:00000000-8086-8086-8086-000000000002', ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SoftwareIdentity' }, Body: { PullResponse: { Items: { CIM_SoftwareIdentity: [{ InstanceID: 'Flash', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'Netstack', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'AMTApps', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'AMT', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'Sku', IsEntity: 'true', VersionString: '16392' }, { InstanceID: 'VendorID', IsEntity: 'true', VersionString: '8086' }, { InstanceID: 'Build Number', IsEntity: 'true', VersionString: '1706' }, { InstanceID: 'Recovery Version', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'Recovery Build Num', IsEntity: 'true', VersionString: '1706' }, { InstanceID: 'Legacy Mode', IsEntity: 'true', VersionString: 'False' }, { InstanceID: 'AMT FW Core Version', IsEntity: 'true', VersionString: '15.0.23' }] }, EndOfSequence: '' } } } })
      const getSpy = jest.spyOn(device.ciraHandler, 'Get')
      getSpy.mockResolvedValue({ Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '2', Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse', MessageID: 'uuid:00000000-8086-8086-8086-000000000003', ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService' }, Body: { AMT_SetupAndConfigurationService: { CreationClassName: 'AMT_SetupAndConfigurationService', ElementName: 'Intel(r) AMT Setup and Configuration Service', EnabledState: '5', Name: 'Intel(r) AMT Setup and Configuration Service', PasswordModel: '1', ProvisioningMode: '1', ProvisioningServerOTP: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=', ProvisioningState: '2', RequestedState: '12', SystemCreationClassName: 'CIM_ComputerSystem', SystemName: 'Intel(r) AMT', ZeroTouchConfigurationEnabled: 'true' } } } })
      const result = await device.getVersion()
      expect(result.CIM_SoftwareIdentity.status).toBe(200)
    })
  })

  describe('general settings', () => {
    it('should get general settings ', async () => {
      getSpy.mockResolvedValueOnce(generalSettings)
      const result = await device.getGeneralSettings()
      expect(result).toBe(generalSettings)
    })
    it('should return null if fails to get general settings ', async () => {
      getSpy.mockResolvedValueOnce(null)
      const result = await device.getGeneralSettings()
      expect(result).toBe(null)
    })
  })

  describe('user consent code', () => {
    it('should request for user consent code ', async () => {
      getSpy.mockResolvedValueOnce(startOptInResponse)
      const result = await device.requestUserConsentCode()
      expect(result).toBe(startOptInResponse)
    })
    it('should return null if fails to request user consent code ', async () => {
      getSpy.mockResolvedValueOnce(null)
      const result = await device.requestUserConsentCode()
      expect(result).toBe(null)
    })

    it('should cancel for user consent code ', async () => {
      getSpy.mockResolvedValueOnce(cancelOptInResponse)
      const result = await device.cancelUserConsentCode()
      expect(result).toBe(cancelOptInResponse)
    })
    it('should return null if fails to cancel user consent code ', async () => {
      getSpy.mockResolvedValueOnce(null)
      const result = await device.cancelUserConsentCode()
      expect(result).toBe(null)
    })
    it('should send for user consent code ', async () => {
      getSpy.mockResolvedValueOnce(sendOptInCodeResponse)
      const result = await device.sendUserConsentCode(985167)
      expect(result).toBe(sendOptInCodeResponse)
    })
    it('should return null if fails to send user consent code ', async () => {
      getSpy.mockResolvedValueOnce(null)
      const result = await device.sendUserConsentCode(985167)
      expect(result).toBe(null)
    })
  })

  describe('event log', () => {
    it('should get event log ', async () => {
      getSpy.mockResolvedValueOnce(positionToFirstRecord)
      getSpy.mockResolvedValueOnce(amtMessageLog)
      const result = await device.getEventLog()
      expect(result).toBe(amtMessageLog)
    })
    it('should return null if fails to get event log', async () => {
      getSpy.mockResolvedValueOnce(null)
      const result = await device.getEventLog()
      expect(result).toBe(null)
    })
  })

  describe('auditLog', () => {
    it('should get audit log', async () => {
      getSpy.mockResolvedValueOnce(auditLog)
      const result = await device.getAuditLog(1)
      expect(result).toBe(auditLog.Envelope.Body)
    })
    it('should return null if fails to get audit log', async () => {
      getSpy.mockResolvedValueOnce(null)
      await expect(device.getAuditLog(1)).rejects.toThrow('unable to retrieve audit log')
    })
  })

  describe('amt features', () => {
    it('should get IPS Opt In Service', async () => {
      getSpy.mockResolvedValueOnce({ Envelope: { Body: {} } })
      const result = await device.getIpsOptInService()
      expect(result).toEqual({})
    })
    it('should get kvm', async () => {
      getSpy.mockResolvedValueOnce({ Envelope: { Body: {} } })
      const result = await device.getKvmRedirectionSap()
      expect(result).toEqual({})
    })
    it('should get redirection service', async () => {
      getSpy.mockResolvedValueOnce({ Envelope: { Body: {} } })
      const result = await device.getRedirectionService()
      expect(result).toEqual({})
    })
    it('should get KVM redirection SAP', async () => {
      getSpy.mockResolvedValueOnce({ Envelope: { Body: {} } })
      const result = await device.getKvmRedirectionSap()
      expect(result).toEqual({})
    })
  })
})
