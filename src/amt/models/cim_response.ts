import { Header } from './common'

export interface Enumerate {
  Envelope: {
    Header: Header
    Body: {
      EnumerateResponse: {
        EnumerationContext: string
      }
    }
  }
}

export interface CIM_ServiceAvailableToElement_Pull {
  Envelope: {
    Header: Header
    Body: {
      PullResponse: {
        Items: {
          CIM_AssociatedPowerManagementService: {
            AvailableRequestedPowerStates: string[]
            PowerState: string
            ServiceProvided: {
              Address: string
              ReferenceParameters: {
                ResourceURI: string
                SelectorSet: {
                  Selector: string[]
                }
              }
            }
            UserOfService: {
              Address: string
              ReferenceParameters: {
                ResourceURI: string
                SelectorSet: {
                  Selector: string[]
                }
              }
            }
          }
        }
        EndOfSequence: string
      }
    }
  }
}

export interface CIM_SoftwareIdentity {
  Envelope: {
    Header: Header
    Body: {
      PullResponse: {
        Items: {
          CIM_SoftwareIdentity: any
        }
        EndOfSequence: string
      }
    }
  }
}

export interface AMT_SetupAndConfigurationService {
  Envelope: {
    Header: Header
    Body: {
      AMT_SetupAndConfigurationService: {
        CreationClassName: string
        ElementName: string
        EnabledState: string
        Name: string
        PasswordModel: string
        ProvisioningMode: string
        ProvisioningServerOTP: string
        ProvisioningState: string
        RequestedState: string
        SystemCreationClassName: string
        SystemName: string
        ZeroTouchConfigurationEnabled: string
      }
    }
  }
}
