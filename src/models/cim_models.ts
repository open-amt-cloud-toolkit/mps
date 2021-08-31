/*********************************************************************
* Copyright (c) Intel Corporation 20121
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export interface CIM_ManagedElement<T> {
  caption: String
  description: String
  elementName: String
  create: (instance: T) => T
  put: (instance: T) => void
  get: () => T
  delete: () => void
  pull: (enumerationContext: String, maxElements: String) => T[]
  enumerate: () => void
  release: (enumerationContext: String) => void
  subscribe: () => void
  unsubscribe: () => void
}
export interface CIM_ManagedSystemElement<T> extends CIM_ManagedElement<T> {
  installDate: Date
  name: String
  operationalStatus: Uint16Array
  statusDescriptions: String[]
  status: String
  healthState: Number
}
export interface CIM_PhysicalElement<T> extends CIM_ManagedSystemElement<T> {
  tag: String
  creationClassName: String
  manufacturer: String
  model: String
  sku: String
  serialNumber: String
  version: String
  partNumber: String
  otherIdentifyingInfo: String
  poweredOn: Boolean
  manufactureDate: Date
  vendorEquipmentType: String
  userTracking: String
  canBeFRUed: Boolean
}
export interface CIM_PhysicalComponent<T> extends CIM_PhysicalElement<T> {
  removalConditions: Number
  removable: Boolean
  replaceable: Boolean
  hotSwappable: Boolean
}
export interface CIM_Chip<T> extends CIM_PhysicalComponent<T> {
  operationalStatus: Uint16Array
  tag: String
  creationClassName: String
  elementName: String
  manufacturer: String
  version: String
  canBeFRUed: Boolean
}
export interface CIM_PhysicalMemory extends CIM_Chip<CIM_PhysicalMemory> {
  formFactor: Number
  memoryType: Number
  speed: Number
  capacity: Number
  bankLabel: String
  configuredMemoryClockSpeed: Number
  isSpeedInMhz: Boolean
  maxMemorySpeed: Number
}
export interface CIM_PhysicalPackage<T> extends CIM_PhysicalElement<T> {
  packageType: Number
}
export interface CIM_Card extends CIM_PhysicalPackage<CIM_Card> {
}
export interface CIM_PhysicalFrame<T> extends CIM_PhysicalPackage<T> {
  vendorCompatibilityStrings: String[]
  otherPackageType: String
  weight: Number
  Width: Number
  Depth: Number
  Height: Number
  removalConditions: Number
  removable: Boolean
  replaceable: Boolean
  hotSwappable: Boolean
  cableManagementStrategy: String
  servicePhilosophy: Uint16Array
  serviceDescriptions: String[]
  lockPresent: Boolean
  audibleAlarm: Boolean
  visibleAlarm: Boolean
  securityBreach: Number
  breachDescription: String
  isLocked: Boolean
}
export interface CIM_Chassis extends CIM_PhysicalFrame<CIM_Chassis> {
  chassisPackageType: Number
}
export interface CIM_LogicalElement<T> extends CIM_ManagedSystemElement<T> {
}
export interface CIM_SoftwareElement<T> extends CIM_LogicalElement<T> {
  version: String
  softwareElementState: Number
  softwareElementId: String
  targetOperatingSystem: Number
  otherTargetOs: String
  manufacturer: String
  buildNumber: String
  serialNumber: String
  codeSet: String
  identificationCode: String
  languageEdition: String
}
export interface CIM_BIOSElement extends CIM_SoftwareElement<CIM_BIOSElement> {
  primaryBIOS: Boolean
  releaseDate: Date
}
export interface CIM_EnabledLogicalElement<T> extends CIM_LogicalElement<T> {
  enabledState: Number
  otherEnabledState: String
  requestedState: Number
  enabledDefault: Number
  timeOfLastStateChange: Date
  requestStateChange: (requestedState: Number, timeoutPeriod?: Date) => CIM_ConcreteJob
}
export interface CIM_Job<T> extends CIM_LogicalElement<T> {
  instanceId: String
  communicationStatus: Number
  detailedStatus: Number
  operatingStatus: Number
  primaryStatus: Number
  jobStatus: String
  timeSubmitted: Date
  scheduledStartTime: Date
  startTime: Date
  elapsedTime: Date
  jobRunTimes: Number
  runMonth: Number
  runDay: Number
  runDayOfWeek: Number
  runStartInterval: Date
  localOrUtcTime: Number
  notify: String
  owner: String
  priority: Number
  percentComplete: Number
  deleteOnCompletion: Boolean
  errorCode: Number
  errorDescription: String
  recoveryAction: Number
  otherRecoveryAction: String
}
export interface CIM_ConcreteJob extends CIM_Job<CIM_ConcreteJob> {
  untilTime: Date
  jobState: Number
  timeOfLastStateChange: Date
  timeBeforeRemoval: Date
}
export interface CIM_LogicalDevice<T> extends CIM_EnabledLogicalElement<T> {
  systemCreationClassName: String
  systemName: String
  creationClassName: String
  deviceId: String
  powerManagementSupported: Boolean
  powerManagementCapabilities: Uint16Array
  availability: Number
  statusInfo: Number
  lastErrorCode: Number
  errorDescription: String
  errorCleared: Boolean
  otherIdentifyingInfo: String[]
  powerOnHours: Number
  totalPowerOnHours: Number
  identifyingDescriptions: String[]
  additionalAvailability: Uint16Array
  maxQuiesceTime: Number
  setPowerState: (powerState: Number, time: Date) => void
  reset: () => Number
  saveProperties: () => Number
  restoreProperties: () => Number
}
export interface CIM_Processor extends CIM_LogicalDevice<CIM_Processor> {
  role: String
  family: Number
  otherFamilyDescription: String
  upgradeMethod: Number
  maxClockSpeed: Number
  currentClockSpeed: Number
  stepping: String
  cpuStatus: Number
  externalBusClockSpeed: Number
}
export interface CIM_MediaAccessDevice extends CIM_LogicalDevice<CIM_MediaAccessDevice> {
  capabilities: Uint16Array
  maxMediaSize: Number
  security: Number
}
export interface CIM_Service<T> extends CIM_EnabledLogicalElement<T> {
  systemCreationClassName: String
  systemName: String
  creationClassName: String
  primaryOwnerName: String
  primaryOwnerContact: String
  startMode: String
  started: Boolean
  startService: () => Number
  stopService: () => Number
}
export interface CIM_SecurityService<T> extends CIM_Service<T> {
}
export interface CIM_SettingData<T> extends CIM_ManagedElement<T> {
  instanceId: String
}
export interface CIM_Dependency<T> {
  create: (instance: T) => T
  put: (instance: T) => void
  get: () => T
  delete: () => void
  pull: (enumerationContext: String, maxElements: String) => T[]
  enumerate: () => void
  release: (enumerationContext: String) => void
  subscribe: () => void
  unsubscribe: () => void
}
export interface CIM_SystemPackaging<T> extends CIM_Dependency<T> {
}
export interface CIM_ComputerSystemPackage extends CIM_SystemPackaging<CIM_ComputerSystemPackage> {
  platformGuid: string
}
