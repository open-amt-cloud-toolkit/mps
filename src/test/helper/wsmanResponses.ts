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

export const computerSystemPackage = {
  Envelope: {
    Header: {
      To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
      RelatesTo: '0',
      Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse',
      MessageID: 'uuid:00000000-8086-8086-8086-000000000001',
      ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystemPackage'
    },
    Body: {
      CIM_ComputerSystemPackage: {
        Antecedent: {
          Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
          ReferenceParameters: {
            ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Chassis',
            SelectorSet: {
              Selector: [
                'CIM_Chassis',
                'CIM_Chassis'
              ]
            }
          }
        },
        Dependent: {
          Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
          ReferenceParameters: {
            ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem',
            SelectorSet: {
              Selector: [
                'CIM_ComputerSystem',
                'ManagedSystem'
              ]
            }
          }
        },
        PlatformGUID: '44454C4C4B0010428033B6C04F504633'
      }
    }
  }
}

export const chassis = {
  Envelope: {
    Header: {
      To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
      RelatesTo: '1',
      Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse',
      MessageID: 'uuid:00000000-8086-8086-8086-000000000002',
      ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Chassis'
    },
    Body: {
      CIM_Chassis: {
        ChassisPackageType: '3',
        CreationClassName: 'CIM_Chassis',
        ElementName: 'Managed System Chassis',
        Manufacturer: 'Dell Inc.',
        Model: 'OptiPlex 7090',
        OperationalStatus: '0',
        PackageType: '3',
        SerialNumber: '6KB3PF3',
        Tag: 'CIM_Chassis',
        Version: ''
      }
    }
  }
}
export const card = {
  Envelope: {
    Header: {
      To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
      RelatesTo: '2',
      Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse',
      MessageID: 'uuid:00000000-8086-8086-8086-000000000003',
      ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Card'
    },
    Body: {
      CIM_Card: {
        CanBeFRUed: 'true',
        CreationClassName: 'CIM_Card',
        ElementName: 'Managed System Base Board',
        Manufacturer: 'Dell Inc.',
        Model: '0MVDNX',
        OperationalStatus: '0',
        PackageType: '9',
        SerialNumber: '/6KB3PF3/CNPEC0017500BC/',
        Tag: 'CIM_Card',
        Version: 'A00'
      }
    }
  }
}
export const biosElement = {
  Envelope: {
    Header: {
      To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
      RelatesTo: '3',
      Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse',
      MessageID: 'uuid:00000000-8086-8086-8086-000000000004',
      ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BIOSElement'
    },
    Body: {
      CIM_BIOSElement: {
        ElementName: 'Primary BIOS',
        Manufacturer: 'Dell Inc.',
        Name: 'Primary BIOS',
        OperationalStatus: '0',
        PrimaryBIOS: 'true',
        ReleaseDate: {
          Datetime: '2021-07-23T00:00:00Z'
        },
        SoftwareElementID: '1.1.38',
        SoftwareElementState: '2',
        TargetOperatingSystem: '66',
        Version: '1.1.38'
      }
    }
  }
}
export const processor = {
  Envelope: {
    Header: {
      To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
      RelatesTo: '10',
      Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse',
      MessageID: 'uuid:00000000-8086-8086-8086-00000000000B',
      ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Processor'
    },
    Body: {
      PullResponse: {
        Items: {
          CIM_Processor: {
            CPUStatus: '1',
            CreationClassName: 'CIM_Processor',
            CurrentClockSpeed: '2700',
            DeviceID: 'CPU 0',
            ElementName: 'Managed System CPU',
            EnabledState: '2',
            ExternalBusClockSpeed: '100',
            Family: '205',
            HealthState: '0',
            MaxClockSpeed: '4500',
            OperationalStatus: '0',
            OtherFamilyDescription: '',
            RequestedState: '12',
            Role: 'Central',
            Stepping: '3',
            SystemCreationClassName: 'CIM_ComputerSystem',
            SystemName: 'ManagedSystem',
            UpgradeMethod: '2'
          }
        },
        EndOfSequence: ''
      }
    }
  }
}
export const physicalMemory = {
  Envelope: {
    Header: {
      To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
      RelatesTo: '11',
      Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse',
      MessageID: 'uuid:00000000-8086-8086-8086-00000000000C',
      ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PhysicalMemory'
    },
    Body: {
      PullResponse: {
        Items: {
          CIM_PhysicalMemory: {
            BankLabel: 'CIM_PhysicalMemory Bank Label',
            Capacity: '17179869184',
            ConfiguredMemoryClockSpeed: '3200',
            CreationClassName: 'CIM_PhysicalMemory',
            ElementName: 'Managed System Memory Chip',
            FormFactor: '13',
            IsSpeedInMhz: 'true',
            Manufacturer: '01980000802C',
            MaxMemorySpeed: '3200',
            MemoryType: '26',
            PartNumber: 'K1CXP8-MIE          ',
            SerialNumber: '12605691',
            Speed: '0',
            Tag: '04212600'
          }
        },
        EndOfSequence: ''
      }
    }
  }
}
export const mediaAccessDevice = {
  Envelope: {
    Header: {
      To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
      RelatesTo: '12',
      Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse',
      MessageID: 'uuid:00000000-8086-8086-8086-00000000000D',
      ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_MediaAccessDevice'
    },
    Body: {
      PullResponse: {
        Items: {
          CIM_MediaAccessDevice: {
            Capabilities: [
              '4',
              '10',
              '7'
            ],
            CreationClassName: 'CIM_MediaAccessDevice',
            DeviceID: 'MEDIA DEV 0',
            ElementName: 'Managed System Media Access Device',
            EnabledDefault: '2',
            EnabledState: '0',
            MaxMediaSize: '256060514',
            OperationalStatus: '0',
            RequestedState: '12',
            Security: '2',
            SystemCreationClassName: 'CIM_ComputerSystem',
            SystemName: 'ManagedSystem'
          }
        },
        EndOfSequence: ''
      }
    }
  }
}

export const physicalPackage = {
  Envelope: {
    Header: {
      To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
      RelatesTo: '13',
      Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse',
      MessageID: 'uuid:00000000-8086-8086-8086-00000000000E',
      ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PhysicalPackage'
    },
    Body: {
      PullResponse: {
        EnumerationContext: '04000000-0000-0000-0000-000000000000',
        Items: {
          CIM_Card: {
            CanBeFRUed: 'true',
            CreationClassName: 'CIM_Card',
            ElementName: 'Managed System Base Board',
            Manufacturer: 'Dell Inc.',
            Model: '0MVDNX',
            OperationalStatus: '0',
            PackageType: '9',
            SerialNumber: '/6KB3PF3/CNPEC0017500BC/',
            Tag: 'CIM_Card',
            Version: 'A00'
          }
        }
      }
    }
  }
}

export const systemPackaging = {
  Envelope: {
    Header: {
      To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
      RelatesTo: '14',
      Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse',
      MessageID: 'uuid:00000000-8086-8086-8086-00000000000F',
      ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SystemPackaging'
    },
    Body: {
      PullResponse: {
        Items: {
          CIM_ComputerSystemPackage: {
            Antecedent: {
              Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
              ReferenceParameters: {
                ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Chassis',
                SelectorSet: {
                  Selector: [
                    'CIM_Chassis',
                    'CIM_Chassis'
                  ]
                }
              }
            },
            Dependent: {
              Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
              ReferenceParameters: {
                ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem',
                SelectorSet: {
                  Selector: [
                    'CIM_ComputerSystem',
                    'ManagedSystem'
                  ]
                }
              }
            },
            PlatformGUID: '44454C4C4B0010428033B6C04F504633'
          }
        },
        EndOfSequence: ''
      }
    }
  }
}

export const chip = {
  Envelope: {
    Header: {
      To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
      RelatesTo: '15',
      Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse',
      MessageID: 'uuid:00000000-8086-8086-8086-000000000010',
      ResourceURI: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Chip'
    },
    Body: {
      PullResponse: {
        EnumerationContext: '06000000-0000-0000-0000-000000000000',
        Items: {
          CIM_Chip: {
            CanBeFRUed: 'true',
            CreationClassName: 'CIM_Chip',
            ElementName: 'Managed System Processor Chip',
            Manufacturer: 'Intel(R) Corporation',
            OperationalStatus: '0',
            Tag: 'CPU 0',
            Version: 'Intel(R) Core(TM) i5-10500 CPU @ 3.10GHz'
          }
        }
      }
    }
  }
}
