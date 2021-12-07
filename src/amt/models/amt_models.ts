/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { CIM_ManagedElement, CIM_SettingData, CIM_EthernetPort, CIM_BootSettingData, CIM_CredentialManagementService } from './cim_models'

export interface amtAuthenticateObject {
  nonce?: number[]
  uuid?: string[]
  fqdn?: string
  fwVersion?: string
  amtSvn?: number
  signatureMechanism?: number
  signature?: number[]
  lengthOfCertificates?: number[]
  certificates?: number[]
}

export interface AMT_GeneralSettings extends CIM_SettingData<AMT_GeneralSettings> {
  networkInterfaceEnabled?: boolean
  digestRealm?: string
  idleWakeTimeout?: number
  hostName?: string
  domainName?: string
  pingResponseEnabled?: boolean
  wsmanOnlyMode?: boolean
  preferredAddressFamily?: number
  dhcpv6ConfigurationTimeout?: number
  ddnsUpdateByDHCPServerEnabled?: boolean
  sharedFQDN?: boolean
  hostOSFQDN?: string
  ddnsttl?: number
  amtNetworkEnabled?: number
  rmcpPingResponseEnabled?: boolean
  ddnsPeriodicUpdateInterval?: number
  presenceNotificationInterval?: number
  privacyLevel?: number
  powerSource?: number
  thunderboltDockEnabled?: number
  amtAuthenticate?: (mcNonce: number) => amtAuthenticateObject
}

export interface AMT_EthernetPortSettings extends CIM_SettingData<AMT_EthernetPortSettings> {
  vlanTag?: number
  sharedMAC?: boolean
  macAddress?: string
  linkIsUp?: boolean
  linkPolicy?: number[]
  linkPreference?: number
  linkControl?: number
  sharedStaticIp?: boolean
  sharedDynamicIp?: boolean
  ipSyncEnabled?: boolean
  dhcpEnabled?: boolean
  ipAddress?: string
  subnetMask?: string
  defaultGateway?: string
  primaryDNS?: string
  secondaryDNS?: string
  consoleTcpMaxRetransmissions?: number
  wlanLinkProtectionLevel?: number
  physicalConnectionType?: number
  physicalNicMedium?: number
  setLinkPreferences?: (linkPreference: number, timeout: number) => number
  cancelLinkProtection?: () => number
  restoreLinkProtection?: () => number
}

export interface MPServer {
  accessInfo?: string
  infoFormat?: number
  port?: number
  authMethod?: number
  username?: string
  password?: string
  commonName?: string
}

export interface RemoteAccessPolicyRule {
  trigger?: number
  tunnelLifeTime?: number
  extendedData?: string
}

export interface AMT_EnvironmentDetectionSettingData extends CIM_SettingData<AMT_EnvironmentDetectionSettingData> {
  detectionAlgorithm?: number
  detectionStrings?: string[]
  detectionIPv6LocalPrefixes?: string[]
  setSystemDefensePolicy?: (policy: AMT_SystemDefencePolicy) => number
  enableVpnRouting?: (enable: boolean) => number
}

export interface AMT_SystemDefencePolicy extends CIM_ManagedElement<AMT_SystemDefencePolicy> {
  policyName?: string
  policyPrecedence?: number
  antiSpoofingSupport?: number
  filterCreationHandles?: number[]
  txDefaultDrop?: boolean
  txDefaultMatchEvent?: boolean
  txDefaultCount?: boolean
  rxDefaultDrop?: boolean
  rxDefaultMatchEvent?: boolean
  rxDefaultCount?: boolean
  getTimeout?: () => number
  setTimeout?: (number) => number
  updateStatistics?: (networkInterface: CIM_EthernetPort, resetOnRead: boolean) => number
}

export interface AMT_BootSettingData extends CIM_BootSettingData<AMT_BootSettingData> {
  useSOL?: boolean
  useSafeMode?: boolean
  reflashBIOS?: boolean
  biosSetup?: boolean
  biosPause?: boolean
  lockPowerButton?: boolean
  lockResetButton?: boolean
  lockKeyboard?: boolean
  lockSleepButton?: boolean
  userPasswordBypass?: boolean
  forcedProgressEvents?: boolean
  firmwareVerbosity?: number
  configurationDataReset?: boolean
  iderBootDevice?: number
  useIDER?: boolean
  enforceSecureBoot?: boolean
  bootMediaIndex?: number
  secureErase?: boolean
  rsePassword?: string
  optionsCleared?: boolean
  winREBootEnabled?: boolean
  uefiLocalPBABootEnabled?: boolean
  uefiHTTPSBootEnabled?: boolean
  secureBootControlEnabled?: boolean
  bootguardStatus?: boolean
  biosLastStatus?: number[]
  uefiBootParametersArray?: number[]
  uefiBootNumberOfParams?: number[]
}

export interface AMT_SetupAndConfigurationService extends CIM_CredentialManagementService {
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
