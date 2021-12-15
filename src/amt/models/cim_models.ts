/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

export interface CIM_ManagedElement {
  Caption?: string
  Description?: string
  ElementName?: string
}

export interface CIM_ManagedSystemElement extends CIM_ManagedElement {
  InstallDate?: Date
  Name?: string
  OperationalStatus?: number[]
  StatusDescriptions?: string[]
  Status?: string
  HealthState?: number
}

export interface CIM_PhysicalElement extends CIM_ManagedSystemElement {
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

export interface CIM_PhysicalComponent extends CIM_PhysicalElement {
  RemovalConditions?: number
  Removable?: boolean
  Replaceable?: boolean
  HotSwappable?: boolean
}

export interface CIM_Chip extends CIM_PhysicalComponent {
  OperationalStatus?: number[]
  Tag?: string
  CreationClassName?: string
  ElementName?: string
  Manufacturer?: string
  Version?: string
  CanBeFRUed?: boolean
}

export interface CIM_PhysicalMemory extends CIM_Chip {
  FormFactor?: number
  MemoryType?: number
  Speed?: number
  Capacity?: number
  BankLabel?: string
  ConfiguredMemoryClockSpeed?: number
  IsSpeedInMhz?: boolean
  MaxMemorySpeed?: number
}

export interface CIM_PhysicalPackage extends CIM_PhysicalElement {
  PackageType?: number
}

export interface CIM_Card extends CIM_PhysicalPackage {}

export interface CIM_PhysicalFrame extends CIM_PhysicalPackage {
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

export interface CIM_Chassis extends CIM_PhysicalFrame {
  ChassisPackageType?: number
}

export interface CIM_LogicalElement extends CIM_ManagedSystemElement {}

export interface CIM_SoftwareElement extends CIM_LogicalElement {
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

export interface CIM_BIOSElement extends CIM_SoftwareElement {
  PrimaryBIOS?: boolean
  ReleaseDate?: Date
}

export interface CIM_EnabledLogicalElement extends CIM_LogicalElement {
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

export interface CIM_Job extends CIM_LogicalElement {
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

export interface CIM_ConcreteJob extends CIM_Job {
  UntilTime?: Date
  JobState?: number
  TimeOfLastStateChange?: Date
  TimeBeforeRemoval?: Date
}

export interface CIM_LogicalDevice extends CIM_EnabledLogicalElement {
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

export interface CIM_Processor extends CIM_LogicalDevice {
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

export interface CIM_MediaAccessDevice extends CIM_LogicalDevice {
  Capabilities?: number[]
  MaxMediaSize?: number
  Security?: number
}

export interface CIM_Service extends CIM_EnabledLogicalElement {
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

export interface CIM_SecurityService extends CIM_Service {}

export interface CIM_SettingData extends CIM_ManagedElement {
  InstanceId?: string
}

// To do: Fix the typing on Dependent and Antecedent
export interface CIM_Dependency {
  Antecedent: any
  Dependent: any
}

export interface CIM_SystemPackaging extends CIM_Dependency {}

export interface CIM_ComputerSystemPackage extends CIM_SystemPackaging {
  PlatformGuid?: string
}

export interface CIM_LogicalPort extends CIM_LogicalDevice {
  Speed?: number
  MaxSpeed?: number
  RequestedSpeed?: number
  UsageRestriction?: number
  PortType?: number
  OtherPortType?: string
}

export interface CIM_NetworkPort extends CIM_LogicalPort {
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

export interface CIM_EthernetPort extends CIM_NetworkPort {}

export interface CIM_BootSettingData extends CIM_SettingData {
  OwningEntity?: string
}

export interface CIM_Collection extends CIM_ManagedElement {}

export interface CIM_Role extends CIM_Collection {
  CreationClassName?: string
  Name?: string
  CommonName?: string
  RoleCharacteristics?: number[]
}

export interface CIM_AuthenticationService extends CIM_SecurityService {
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
  extends CIM_LogicalElement {
  CIM_SoftwareIdentity: Array<
  {
    InstanceID: string
    VersionString: string
    IsEntity: boolean
  } & CIM_LogicalElement
  >
}
export interface CIM_Log extends CIM_EnabledLogicalElement {
  MaxNumberOfRecords: number
  CurrentNumberOfRecords: number
  OverwritePolicy: number
  LogState: number
}

export interface CIM_MessageLog extends CIM_Log {
  CreationClassName: string
  Capabilities: number[]
  CapabilitiesDescriptions: string[]
  MaxLogSize: number
  SizeOfHeader: number
  HeaderFormat: string
  MaxRecordSize: number
  SizeOfRecordHeader: number
  RecordHeaderFormat: string
  OtherPolicyDescription: string
  TimeWhenOutdated: Date
  PercentageNearFull: number
  LastChange: number
  TimeOfLastChange: Date
  RecordLastChanged: number
  IsFrozen: boolean
  CharacterSet: number
}
