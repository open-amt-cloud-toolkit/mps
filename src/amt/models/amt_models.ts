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
export interface AMT_BootCapabilities extends CIM_ManagedElement<AMT_BootCapabilities>{
  AMT_BootCapabilities: {
  // The user friendly name for this instance of Capabilities . . .
    ElementName: string
    // Within the scope of the instantiating Namespace, InstanceID opaquely and uniquely identifies an instance of this class . . .
    InstanceID: string
    // Indicates whether Intel(R) AMT device supports 'IDE Redirection'
    IDER: boolean
    // Indicates whether Intel(R) AMT device supports 'Serial Over Lan'
    SOL: boolean
    // Indicates whether Intel(R) AMT device supports 'BIOS Reflash'
    BIOSReflash: boolean
    // Indicates whether Intel(R) AMT device supports 'BIOS Setup'
    BIOSSetup: boolean
    // Indicates whether Intel(R) AMT device supports 'BIOS Pause'
    BIOSPause: boolean
    // Indicates whether Intel(R) AMT device supports 'Force PXE Boot'
    ForcePXEBoot: boolean
    // Indicates whether Intel(R) AMT device supports 'Force Hard Drive Boot'
    ForceHardDriveBoot: boolean
    // Indicates whether Intel(R) AMT device supports 'Force Hard Drive Safe Mode Boot'
    ForceHardDriveSafeModeBoot: boolean
    // Indicates whether Intel(R) AMT device supports 'Force Diagnostic Boot'
    ForceDiagnosticBoot: boolean
    // Indicates whether Intel(R) AMT device supports 'Force CD or DVD Boot'
    ForceCDorDVDBoot: boolean
    // Indicates whether Intel(R) AMT device supports 'Verbosity Screen Blank'
    VerbosityScreenBlank: boolean
    // Indicates whether Intel(R) AMT device supports 'Power Button Lock'
    PowerButtonLock: boolean
    // Indicates whether Intel(R) AMT device supports 'Reset Button Lock'
    ResetButtonLock: boolean
    // Indicates whether Intel(R) AMT device supports 'Keyboard Lock'
    KeyboardLock: boolean
    // Indicates whether Intel(R) AMT device supports 'Sleep Button Lock'
    SleepButtonLock: boolean
    // Indicates whether Intel(R) AMT device supports 'User Password Bypass'
    UserPasswordBypass: boolean
    // Indicates whether Intel(R) AMT device supports 'Forced Progress Events'
    ForcedProgressEvents: boolean
    // Indicates whether Intel(R) AMT device supports 'Verbosity/Verbose'
    VerbosityVerbose: boolean
    // Indicates whether Intel(R) AMT device supports 'Verbosity/Quiet'
    VerbosityQuiet: boolean
    // Indicates whether Intel(R) AMT device supports 'Configuration Data Reset'
    ConfigurationDataReset: boolean
    // Indicates whether Intel(R) AMT device supports 'BIOS Secure Boot'
    BIOSSecureBoot: boolean
    // Indicates whether Intel(R) AMT device supports 'Secure Erase'
    SecureErase: boolean
    // Supports Intel AMT invoking boot to WinRE
    ForceWinREBoot: boolean
    // Supports booting to an ISV’s PBA
    ForceUEFILocalPBABoot: boolean
    // Supports Intel AMT invoking HTTPS boot
    ForceUEFIHTTPSBoot: boolean
    // Determines whether Intel AMT is privileged by BIOS to disable secure boot for an AMT triggered boot option. If true, the BIOS allows Intel AMT to control the secure boot (i.e., to disable secure boot in recovery from HTTPS under certain conditions).
    AMTSecureBootControl: boolean
    // Read-only field, determines whether UEFI BIOS and Intel AMT WiFi profile share is supported.
    UEFIWiFiCoExistenceAndProfileShare: boolean
    // Indicates whether the Intel AMT device supports Remote Secure Platform Erase (i.e., whether the OEM's BIOS includes support for the feature), and shows the devices that can be erased.
    PlatformErase: number
  }
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
