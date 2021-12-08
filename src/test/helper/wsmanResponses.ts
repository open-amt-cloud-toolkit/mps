export const enumerateResponse = {
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
}
export const serviceAvailableToElement = {
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
}

export const generalSettings = {
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

export const startOptInResponse = {
  Envelope: {
    Header: {
      To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
      RelatesTo: '0',
      Action: 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/StartOptInResponse',
      MessageID: 'uuid:00000000-8086-8086-8086-00000000008D',
      ResourceURI: 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService'
    },
    Body: {
      StartOptIn_OUTPUT: {
        ReturnValue: '0'
      }
    }
  }
}

export const cancelOptInResponse = {
  Envelope: {
    Header: {
      To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
      RelatesTo: '1',
      Action: 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/CancelOptInResponse',
      MessageID: 'uuid:00000000-8086-8086-8086-00000000008F',
      ResourceURI: 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService'
    },
    Body: {
      CancelOptIn_OUTPUT: {
        ReturnValue: '0'
      }
    }
  }
}

export const sendOptInCodeResponse = {
  Envelope: {
    Header: {
      To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
      RelatesTo: '3',
      Action: 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/SendOptInCodeResponse',
      MessageID: 'uuid:00000000-8086-8086-8086-000000000093',
      ResourceURI: 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService'
    },
    Body: {
      SendOptInCode_OUTPUT: {
        ReturnValue: '0'
      }
    }
  }
}
