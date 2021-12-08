import { CIRASocket } from '../models/models'
import { ConnectedDevice } from './ConnectedDevice'

const socket: CIRASocket = null
const device = new ConnectedDevice(socket, 'admin', 'P@ssw0rd')

describe('power state', () => {
  it('should return null when enumerate call to power state is null', async () => {
    const enumerateSpy = jest.spyOn(device.ciraHandler, 'Enumerate')
    enumerateSpy.mockResolvedValueOnce(null)
    const result = await device.getPowerState()
    expect(result).toBe(null)
  })
  it('should return null when pull call to power state is null', async () => {
    const enumerateSpy = jest.spyOn(device.ciraHandler, 'Enumerate')
    enumerateSpy.mockResolvedValueOnce({
      Envelope: {
        Header: {
          To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
          RelatesTo: '0',
          Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/EnumerateResponse',
          MessageID: 'uuid:00000000-8086-8086-8086-000000000001',
          ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement'
        },
        Body: {
          EnumerateResponse: {
            EnumerationContext: '01000000-0000-0000-0000-000000000000'
          }
        }
      }
    })
    const pullSpy = jest.spyOn(device.ciraHandler, 'Pull')
    pullSpy.mockResolvedValue(null)
    const result = await device.getPowerState()
    expect(result).toBe(null)
  })
  it('should return power state', async () => {
    const enumerateSpy = jest.spyOn(device.ciraHandler, 'Enumerate')
    enumerateSpy.mockResolvedValueOnce({
      Envelope: {
        Header: {
          To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
          RelatesTo: '0',
          Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/EnumerateResponse',
          MessageID: 'uuid:00000000-8086-8086-8086-000000000001',
          ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement'
        },
        Body: {
          EnumerateResponse: {
            EnumerationContext: '01000000-0000-0000-0000-000000000000'
          }
        }
      }
    })
    const pullSpy = jest.spyOn(device.ciraHandler, 'Pull')
    pullSpy.mockResolvedValue({
      Envelope: {
        Header: {
          To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
          RelatesTo: '1',
          Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse',
          MessageID: 'uuid:00000000-8086-8086-8086-000000000002',
          ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement'
        },
        Body: {
          PullResponse: {
            Items: {
              CIM_AssociatedPowerManagementService: {
                AvailableRequestedPowerStates: ['8', '2', '5'],
                PowerState: '4',
                ServiceProvided: {
                  Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
                  ReferenceParameters: {
                    ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService',
                    SelectorSet: {
                      Selector: [
                        'CIM_PowerManagementService',
                        'Intel(r) AMT Power Management Service',
                        'CIM_ComputerSystem', 'Intel(r) AMT'
                      ]
                    }
                  }
                },
                UserOfService: {
                  Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
                  ReferenceParameters: {
                    ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem',
                    SelectorSet: {
                      Selector: [
                        'CIM_ComputerSystem',
                        'ManagedSystem']
                    }
                  }
                }
              }
            },
            EndOfSequence: ''
          }
        }
      }
    })
    const result = await device.getPowerState()
    expect(result.Envelope.Body.PullResponse.Items.CIM_AssociatedPowerManagementService.PowerState).toBe('4')
  })
})

describe('version', () => {
  it('should return null when enumerate call to software identity is null', async () => {
    const enumerateSpy = jest.spyOn(device.ciraHandler, 'Enumerate')
    enumerateSpy.mockResolvedValueOnce(null)
    const result = await device.getVersion()
    expect(result).toBe(null)
  })
  it('should return null when pull call to software identity is null', async () => {
    const enumerateSpy = jest.spyOn(device.ciraHandler, 'Enumerate')
    enumerateSpy.mockResolvedValueOnce({ Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '0', Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/EnumerateResponse', MessageID: 'uuid:00000000-8086-8086-8086-000000000001', ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SoftwareIdentity' }, Body: { EnumerateResponse: { EnumerationContext: '01000000-0000-0000-0000-000000000000' } } } })
    const pullSpy = jest.spyOn(device.ciraHandler, 'Pull')
    pullSpy.mockResolvedValue(null)
    const result = await device.getVersion()
    expect(result).toBe(null)
  })
  it('should return null when get call to AMT SetupAndConfigurationService is null ', async () => {
    const enumerateSpy = jest.spyOn(device.ciraHandler, 'Enumerate')
    enumerateSpy.mockResolvedValueOnce({ Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '0', Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/EnumerateResponse', MessageID: 'uuid:00000000-8086-8086-8086-000000000001', ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SoftwareIdentity' }, Body: { EnumerateResponse: { EnumerationContext: '01000000-0000-0000-0000-000000000000' } } } })
    const pullSpy = jest.spyOn(device.ciraHandler, 'Pull')
    pullSpy.mockResolvedValueOnce({ Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '1', Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse', MessageID: 'uuid:00000000-8086-8086-8086-000000000002', ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SoftwareIdentity' }, Body: { PullResponse: { Items: { CIM_SoftwareIdentity: [{ InstanceID: 'Flash', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'Netstack', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'AMTApps', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'AMT', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'Sku', IsEntity: 'true', VersionString: '16392' }, { InstanceID: 'VendorID', IsEntity: 'true', VersionString: '8086' }, { InstanceID: 'Build Number', IsEntity: 'true', VersionString: '1706' }, { InstanceID: 'Recovery Version', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'Recovery Build Num', IsEntity: 'true', VersionString: '1706' }, { InstanceID: 'Legacy Mode', IsEntity: 'true', VersionString: 'False' }, { InstanceID: 'AMT FW Core Version', IsEntity: 'true', VersionString: '15.0.23' }] }, EndOfSequence: '' } } } })
    const getSpy = jest.spyOn(device.ciraHandler, 'Get')
    getSpy.mockResolvedValue(null)
    const result = await device.getVersion()
    expect(result).toBe(null)
  })
  it('should get version ', async () => {
    const enumerateSpy = jest.spyOn(device.ciraHandler, 'Enumerate')
    enumerateSpy.mockResolvedValueOnce({ Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '0', Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/EnumerateResponse', MessageID: 'uuid:00000000-8086-8086-8086-000000000001', ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SoftwareIdentity' }, Body: { EnumerateResponse: { EnumerationContext: '01000000-0000-0000-0000-000000000000' } } } })
    const pullSpy = jest.spyOn(device.ciraHandler, 'Pull')
    pullSpy.mockResolvedValueOnce({ Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '1', Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse', MessageID: 'uuid:00000000-8086-8086-8086-000000000002', ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SoftwareIdentity' }, Body: { PullResponse: { Items: { CIM_SoftwareIdentity: [{ InstanceID: 'Flash', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'Netstack', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'AMTApps', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'AMT', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'Sku', IsEntity: 'true', VersionString: '16392' }, { InstanceID: 'VendorID', IsEntity: 'true', VersionString: '8086' }, { InstanceID: 'Build Number', IsEntity: 'true', VersionString: '1706' }, { InstanceID: 'Recovery Version', IsEntity: 'true', VersionString: '15.0.23' }, { InstanceID: 'Recovery Build Num', IsEntity: 'true', VersionString: '1706' }, { InstanceID: 'Legacy Mode', IsEntity: 'true', VersionString: 'False' }, { InstanceID: 'AMT FW Core Version', IsEntity: 'true', VersionString: '15.0.23' }] }, EndOfSequence: '' } } } })
    const getSpy = jest.spyOn(device.ciraHandler, 'Get')
    getSpy.mockResolvedValue({ Envelope: { Header: { To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous', RelatesTo: '2', Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse', MessageID: 'uuid:00000000-8086-8086-8086-000000000003', ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService' }, Body: { AMT_SetupAndConfigurationService: { CreationClassName: 'AMT_SetupAndConfigurationService', ElementName: 'Intel(r) AMT Setup and Configuration Service', EnabledState: '5', Name: 'Intel(r) AMT Setup and Configuration Service', PasswordModel: '1', ProvisioningMode: '1', ProvisioningServerOTP: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=', ProvisioningState: '2', RequestedState: '12', SystemCreationClassName: 'CIM_ComputerSystem', SystemName: 'Intel(r) AMT', ZeroTouchConfigurationEnabled: 'true' } } } })
    const result = await device.getVersion()
    expect(result.CIM_SoftwareIdentity.status).toBe(200)
  })
})
describe('general settings', () => {
  const response = {
    Envelope: {
      Header: {
        To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
        RelatesTo: '0',
        Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse',
        MessageID: 'uuid:00000000-8086-8086-8086-000000000001',
        ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings'
      },
      Body: {
        AMT_GeneralSettings: {
          AMTNetworkEnabled: '1',
          DDNSPeriodicUpdateInterval: '1440',
          DDNSTTL: '900',
          DDNSUpdateByDHCPServerEnabled: 'true',
          DDNSUpdateEnabled: 'false',
          DHCPv6ConfigurationTimeout: '0',
          DigestRealm: 'Digest:A3829B3827DE4D33D4449B366831FD01',
          DomainName: '',
          ElementName: 'Intel(r) AMT: General Settings',
          HostName: '',
          HostOSFQDN: 'DESKTOP-9CC12U7',
          IdleWakeTimeout: '1',
          InstanceID: 'Intel(r) AMT: General Settings',
          NetworkInterfaceEnabled: 'true',
          PingResponseEnabled: 'true',
          PowerSource: '0',
          PreferredAddressFamily: '0',
          PresenceNotificationInterval: '0',
          PrivacyLevel: '0',
          RmcpPingResponseEnabled: 'true',
          SharedFQDN: 'true',
          ThunderboltDockEnabled: '0',
          WsmanOnlyMode: 'false'
        }
      }
    }
  }
  it('should get general settings ', async () => {
    const enumerateSpy = jest.spyOn(device.ciraHandler, 'Get')
    enumerateSpy.mockResolvedValueOnce(response)
    const result = await device.getGeneralSettings()
    expect(result).toBe(response)
  })
  it('should return null if fails to get general settings ', async () => {
    const enumerateSpy = jest.spyOn(device.ciraHandler, 'Get')
    enumerateSpy.mockResolvedValueOnce(null)
    const result = await device.getGeneralSettings()
    expect(result).toBe(null)
  })
})
