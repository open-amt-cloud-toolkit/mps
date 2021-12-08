/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

export interface CIM_ManagedElement<T> {
  Caption?: string
  Description?: string
  ElementName?: string
  Create?: (
    Instance: T
  ) => T
  Put?: (Instance: T) => T
  Get?: () => T
  Delete?: () => T
  Pull?: (
    EnumerationContext: string,
    MaxElements: string
  ) => T[]
  Enumerate?: () => T
  Release?: (
    EnumerationContext: string
  ) => T
  Subscribe?: () => T
  Unsubscribe?: () => T
}

export interface CIM_ManagedSystemElement<T> extends CIM_ManagedElement<T> {
  InstallDate?: Date
  Name?: string
  OperationalStatus?: number[]
  StatusDescriptions?: string[]
  Status?: string
  HealthState?: number
}

export interface CIM_PhysicalElement<T> extends CIM_ManagedSystemElement<T> {
  Tag?: string
  CreationClassName?: string
  Manufacturer?: string
  Model?: string
  Sku?: string
  SerialNumber?: string
  Version?: string
  PartNumber?: string
  OtherIdentifyingInfo?: string
  PoweredOn?: boolean
  ManufactureDate?: Date
  VendorEquipmentType?: string
  UserTracking?: string
  CanBeFRUed?: boolean
}

export interface CIM_PhysicalComponent<T> extends CIM_PhysicalElement<T> {
  RemovalConditions?: number
  Removable?: boolean
  Replaceable?: boolean
  HotSwappable?: boolean
}

export interface CIM_Chip<T> extends CIM_PhysicalComponent<T> {
  OperationalStatus?: number[]
  Tag?: string
  CreationClassName?: string
  ElementName?: string
  Manufacturer?: string
  Version?: string
  CanBeFRUed?: boolean
}

export interface CIM_PhysicalMemory extends CIM_Chip<CIM_PhysicalMemory> {
  FormFactor?: number
  MemoryType?: number
  Speed?: number
  Capacity?: number
  BankLabel?: string
  ConfiguredMemoryClockSpeed?: number
  IsSpeedInMhz?: boolean
  MaxMemorySpeed?: number
}

export interface CIM_PhysicalPackage<T> extends CIM_PhysicalElement<T> {
  PackageType?: number
}

export interface CIM_Card extends CIM_PhysicalPackage<CIM_Card> {}

export interface CIM_PhysicalFrame<T> extends CIM_PhysicalPackage<T> {
  VendorCompatibilityStrings?: string[]
  OtherPackageType?: string
  Weight?: number
  Width?: number
  Depth?: number
  Height?: number
  RemovalConditions?: number
  Removable?: boolean
  Replaceable?: boolean
  HotSwappable?: boolean
  CableManagementStrategy?: string
  ServicePhilosophy?: number[]
  ServiceDescriptions?: string[]
  LockPresent?: boolean
  AudibleAlarm?: boolean
  VisibleAlarm?: boolean
  SecurityBreach?: number
  BreachDescription?: string
  IsLocked?: boolean
}

export interface CIM_Chassis extends CIM_PhysicalFrame<CIM_Chassis> {
  ChassisPackageType?: number
}

export interface CIM_LogicalElement<T> extends CIM_ManagedSystemElement<T> {}

export interface CIM_SoftwareElement<T> extends CIM_LogicalElement<T> {
  Version?: string
  SoftwareElementState?: number
  SoftwareElementId?: string
  TargetOperatingSystem?: number
  OtherTargetOs?: string
  Manufacturer?: string
  BuildNumber?: string
  SerialNumber?: string
  CodeSet?: string
  IdentificationCode?: string
  LanguageEdition?: string
}

export interface CIM_BIOSElement extends CIM_SoftwareElement<CIM_BIOSElement> {
  PrimaryBIOS?: boolean
  ReleaseDate?: Date
}

export interface CIM_EnabledLogicalElement<T> extends CIM_LogicalElement<T> {
  EnabledState?: number
  OtherEnabledState?: string
  RequestedState?: number
  EnabledDefault?: number
  TimeOfLastStateChange?: Date
  RequestStateChange?: (
    RequestedState: number,
    TimeoutPeriod?: Date
  ) => CIM_ConcreteJob
}

export interface CIM_Job<T> extends CIM_LogicalElement<T> {
  InstanceId?: string
  CommunicationStatus?: number
  DetailedStatus?: number
  OperatingStatus?: number
  PrimaryStatus?: number
  JobStatus?: string
  TimeSubmitted?: Date
  ScheduledStartTime?: Date
  StartTime?: Date
  ElapsedTime?: Date
  JobRunTimes?: number
  RunMonth?: number
  RunDay?: number
  RunDayOfWeek?: number
  RunStartInterval?: Date
  LocalOrUtcTime?: number
  Notify?: string
  Owner?: string
  Priority?: number
  PercentComplete?: number
  DeleteOnCompletion?: boolean
  ErrorCode?: number
  ErrorDescription?: string
  RecoveryAction?: number
  OtherRecoveryAction?: string
}

export interface CIM_ConcreteJob extends CIM_Job<CIM_ConcreteJob> {
  UntilTime?: Date
  JobState?: number
  TimeOfLastStateChange?: Date
  TimeBeforeRemoval?: Date
}

export interface CIM_LogicalDevice<T> extends CIM_EnabledLogicalElement<T> {
  SystemCreationClassName?: string
  SystemName?: string
  CreationClassName?: string
  DeviceId?: string
  PowerManagementSupported?: boolean
  PowerManagementCapabilities?: number[]
  Availability?: number
  StatusInfo?: number
  LastErrorCode?: number
  ErrorDescription?: string
  ErrorCleared?: boolean
  OtherIdentifyingInfo?: string[]
  PowerOnHours?: number
  TotalPowerOnHours?: number
  IdentifyingDescriptions?: string[]
  AdditionalAvailability?: number[]
  MaxQuiesceTime?: number
  Reset?: () => number
  SaveProperties?: () => number
  RestoreProperties?: () => number
}

export interface CIM_Processor extends CIM_LogicalDevice<CIM_Processor> {
  Role?: string
  Family?: number
  OtherFamilyDescription?: string
  UpgradeMethod?: number
  MaxClockSpeed?: number
  CurrentClockSpeed?: number
  Stepping?: string
  CPUStatus?: number
  ExternalBusClockSpeed?: number
}

export interface CIM_MediaAccessDevice extends CIM_LogicalDevice<CIM_MediaAccessDevice> {
  Capabilities?: number[]
  MaxMediaSize?: number
  Security?: number
}

export interface CIM_Service<T> extends CIM_EnabledLogicalElement<T> {
  SystemCreationClassName?: string
  SystemName?: string
  CreationClassName?: string
  PrimaryOwnerName?: string
  PrimaryOwnerContact?: string
  StartMode?: string
  Started?: boolean
  StartService?: () => number
  StopService?: () => number
}

export interface CIM_SecurityService<T> extends CIM_Service<T> {}

export interface CIM_SettingData<T> extends CIM_ManagedElement<T> {
  InstanceId?: string
}

export interface CIM_Dependency<T> {
  Create?: (
    Instance: T
  ) => T
  Put?: (
    Instance: T
  ) => T
  Get?: () => T
  Delete?: () => T
  Pull?: (
    EnumerationContext: string,
    MaxElements: string
  ) => T[]
  Enumerate?: () => T
  Release?: (
    EnumerationContext: string
  ) => T
  Subscribe?: () => T
  Unsubscribe?: () => T
}

export interface CIM_SystemPackaging<T> extends CIM_Dependency<T> {}

export interface CIM_ComputerSystemPackage extends CIM_SystemPackaging<CIM_ComputerSystemPackage> {
  PlatformGuid?: string
}

export interface CIM_LogicalPort<T> extends CIM_LogicalDevice<T> {
  Speed?: number
  MaxSpeed?: number
  RequestedSpeed?: number
  UsageRestriction?: number
  PortType?: number
  OtherPortType?: string
}

export interface CIM_NetworkPort<T> extends CIM_LogicalPort<T> {
  PortNumber?: number
  LinkTechnology?: number
  OtherLinkTechnology?: string
  PermanentAddress?: string
  NetworkAddresses?: string[]
  FullDuplex?: boolean
  AutoSense?: boolean
  SupportedMaximumTransmissionUnit?: number
  ActiveMaximumTransmissionUnit?: number
}

export interface CIM_EthernetPort extends CIM_NetworkPort<CIM_EthernetPort> {}

export interface CIM_BootSettingData<T> extends CIM_SettingData<T> {
  OwningEntity?: string
}

export interface CIM_Collection<T> extends CIM_ManagedElement<T> {}

export interface CIM_Role extends CIM_Collection<CIM_Role> {
  CreationClassName?: string
  Name?: string
  CommonName?: string
  RoleCharacteristics?: number[]
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

export interface CIM_AssociatedPowerManagementService extends CIM_ServiceAvailableToElement {
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
