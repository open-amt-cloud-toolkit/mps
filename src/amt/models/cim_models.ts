/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

export interface CIM_ManagedElement<T> {
  caption?: string
  description?: string
  elementName?: string
  create?: (instance: T) => T
  put?: (instance: T) => T
  get?: () => T
  delete?: () => T
  pull?: (enumerationContext: string, maxElements: string) => T[]
  enumerate?: () => T
  release?: (enumerationContext: string) => T
  subscribe?: () => T
  unsubscribe?: () => T
}
export interface CIM_ManagedSystemElement<T> extends CIM_ManagedElement<T> {
  installDate?: Date
  name?: string
  operationalStatus?: number[]
  statusDescriptions?: string[]
  status?: string
  healthState?: number
}
export interface CIM_PhysicalElement<T> extends CIM_ManagedSystemElement<T> {
  tag?: string
  creationClassName?: string
  manufacturer?: string
  model?: string
  sku?: string
  serialNumber?: string
  version?: string
  partNumber?: string
  otherIdentifyingInfo?: string
  poweredOn?: boolean
  manufactureDate?: Date
  vendorEquipmentType?: string
  userTracking?: string
  canBeFRUed?: boolean
}
export interface CIM_PhysicalComponent<T> extends CIM_PhysicalElement<T> {
  removalConditions?: number
  removable?: boolean
  replaceable?: boolean
  hotSwappable?: boolean
}
export interface CIM_Chip<T> extends CIM_PhysicalComponent<T> {
  operationalStatus?: number[]
  tag?: string
  creationClassName?: string
  elementName?: string
  manufacturer?: string
  version?: string
  canBeFRUed?: boolean
}
export interface CIM_PhysicalMemory extends CIM_Chip<CIM_PhysicalMemory> {
  formFactor?: number
  memoryType?: number
  speed?: number
  capacity?: number
  bankLabel?: string
  configuredMemoryClockSpeed?: number
  isSpeedInMhz?: boolean
  maxMemorySpeed?: number
}
export interface CIM_PhysicalPackage<T> extends CIM_PhysicalElement<T> {
  packageType?: number
}
export interface CIM_Card extends CIM_PhysicalPackage<CIM_Card> {}
export interface CIM_PhysicalFrame<T> extends CIM_PhysicalPackage<T> {
  vendorCompatibilityStrings?: string[]
  otherPackageType?: string
  weight?: number
  Width?: number
  Depth?: number
  Height?: number
  removalConditions?: number
  removable?: boolean
  replaceable?: boolean
  hotSwappable?: boolean
  cableManagementStrategy?: string
  servicePhilosophy?: number[]
  serviceDescriptions?: string[]
  lockPresent?: boolean
  audibleAlarm?: boolean
  visibleAlarm?: boolean
  securityBreach?: number
  breachDescription?: string
  isLocked?: boolean
}
export interface CIM_Chassis extends CIM_PhysicalFrame<CIM_Chassis> {
  chassisPackageType?: number
}
export interface CIM_LogicalElement<T> extends CIM_ManagedSystemElement<T> {}
export interface CIM_SoftwareElement<T> extends CIM_LogicalElement<T> {
  version?: string
  softwareElementState?: number
  softwareElementId?: string
  targetOperatingSystem?: number
  otherTargetOs?: string
  manufacturer?: string
  buildNumber?: string
  serialNumber?: string
  codeSet?: string
  identificationCode?: string
  languageEdition?: string
}
export interface CIM_BIOSElement extends CIM_SoftwareElement<CIM_BIOSElement> {
  primaryBIOS?: boolean
  releaseDate?: Date
}
export interface CIM_EnabledLogicalElement<T> extends CIM_LogicalElement<T> {
  enabledState?: number
  otherEnabledState?: string
  requestedState?: number
  enabledDefault?: number
  timeOfLastStateChange?: Date
  requestStateChange?: (
    requestedState: number,
    timeoutPeriod?: Date
  ) => CIM_ConcreteJob
}
export interface CIM_Job<T> extends CIM_LogicalElement<T> {
  instanceId?: string
  communicationStatus?: number
  detailedStatus?: number
  operatingStatus?: number
  primaryStatus?: number
  jobStatus?: string
  timeSubmitted?: Date
  scheduledStartTime?: Date
  startTime?: Date
  elapsedTime?: Date
  jobRunTimes?: number
  runMonth?: number
  runDay?: number
  runDayOfWeek?: number
  runStartInterval?: Date
  localOrUtcTime?: number
  notify?: string
  owner?: string
  priority?: number
  percentComplete?: number
  deleteOnCompletion?: boolean
  errorCode?: number
  errorDescription?: string
  recoveryAction?: number
  otherRecoveryAction?: string
}
export interface CIM_ConcreteJob extends CIM_Job<CIM_ConcreteJob> {
  untilTime?: Date
  jobState?: number
  timeOfLastStateChange?: Date
  timeBeforeRemoval?: Date
}
export interface CIM_LogicalDevice<T> extends CIM_EnabledLogicalElement<T> {
  systemCreationClassName?: string
  systemName?: string
  creationClassName?: string
  deviceId?: string
  powerManagementSupported?: boolean
  powerManagementCapabilities?: number[]
  availability?: number
  statusInfo?: number
  lastErrorCode?: number
  errorDescription?: string
  errorCleared?: boolean
  otherIdentifyingInfo?: string[]
  powerOnHours?: number
  totalPowerOnHours?: number
  identifyingDescriptions?: string[]
  additionalAvailability?: number[]
  maxQuiesceTime?: number
  reset?: () => number
  saveProperties?: () => number
  restoreProperties?: () => number
}
export interface CIM_Processor extends CIM_LogicalDevice<CIM_Processor> {
  role?: string
  family?: number
  otherFamilyDescription?: string
  upgradeMethod?: number
  maxClockSpeed?: number
  currentClockSpeed?: number
  stepping?: string
  cpuStatus?: number
  externalBusClockSpeed?: number
}
export interface CIM_MediaAccessDevice
  extends CIM_LogicalDevice<CIM_MediaAccessDevice> {
  capabilities?: number[]
  maxMediaSize?: number
  security?: number
}
export interface CIM_Service<T> extends CIM_EnabledLogicalElement<T> {
  systemCreationClassName?: string
  systemName?: string
  creationClassName?: string
  primaryOwnerName?: string
  primaryOwnerContact?: string
  startMode?: string
  started?: boolean
  startService?: () => number
  stopService?: () => number
}
export interface CIM_SecurityService<T> extends CIM_Service<T> {}
export interface CIM_SettingData<T> extends CIM_ManagedElement<T> {
  instanceId?: string
}
export interface CIM_Dependency<T> {
  create?: (instance: T) => T
  put?: (instance: T) => T
  get?: () => T
  delete?: () => T
  pull?: (enumerationContext: string, maxElements: string) => T[]
  enumerate?: () => T
  release?: (enumerationContext: string) => T
  subscribe?: () => T
  unsubscribe?: () => T
}
export interface CIM_SystemPackaging<T> extends CIM_Dependency<T> {}
export interface CIM_ComputerSystemPackage
  extends CIM_SystemPackaging<CIM_ComputerSystemPackage> {
  platformGuid?: string
}

export interface CIM_LogicalPort<T> extends CIM_LogicalDevice<T> {
  speed?: number
  maxSpeed?: number
  requestedSpeed?: number
  usageRestriction?: number
  portType?: number
  otherPortType?: string
}

export interface CIM_NetworkPort<T> extends CIM_LogicalPort<T> {
  portNumber?: number
  linkTechnology?: number
  otherLinkTechnology?: string
  permanentAddress?: string
  networkAddresses?: string[]
  fullDuplex?: boolean
  autoSense?: boolean
  supportedMaximumTransmissionUnit?: number
  activeMaximumTransmissionUnit?: number
}

export interface CIM_EthernetPort extends CIM_NetworkPort<CIM_EthernetPort> {}

export interface CIM_BootSettingData<T> extends CIM_SettingData<T> {
  owningEntity?: string
}

export interface CIM_Collection<T> extends CIM_ManagedElement<T> {}

export interface CIM_Role extends CIM_Collection<CIM_Role> {
  creationClassName?: string
  name?: string
  commonName?: string
  roleCharacteristics?: number[]
}

export interface CIM_AuthenticationService extends CIM_SecurityService<CIM_AuthenticationService> {
}
export interface CIM_CredentialManagementService extends CIM_AuthenticationService {
  // InstanceID is an optional property that may be used to opaquely and uniquely identify an instance of this class within the scope of the instantiating Namespace . . .
  InstanceID: string
}

export interface CIM_ServiceAvailableToElement {
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

export interface CIM_AssociatedPowerManagementService
  extends CIM_ServiceAvailableToElement {
  CIM_AssociatedPowerManagementService: {
    AvailableRequestedPowerStates: string[]
    PowerState: string
  } & CIM_ServiceAvailableToElement
}

export interface CIM_SoftwareIdentity
  extends CIM_LogicalElement<CIM_SoftwareIdentity> {
  CIM_SoftwareIdentity: Array<
  {
    InstanceID: string
    VersionString: string
    IsEntity: boolean
  } & CIM_LogicalElement<CIM_SoftwareIdentity>
  >
}
