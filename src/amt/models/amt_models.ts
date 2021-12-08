/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { CIM_ManagedElement, CIM_SettingData, CIM_EthernetPort, CIM_BootSettingData } from './cim_models'

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
  NetworkInterfaceEnabled?: boolean
  DigestRealm?: string
  IdleWakeTimeout?: number
  HostName?: string
  DomainName?: string
  PingResponseEnabled?: boolean
  WsmanOnlyMode?: boolean
  PreferredAddressFamily?: number
  DHCPv6ConfigurationTimeout?: number
  DDNSUpdateByDHCPServerEnabled?: boolean
  SharedFQDN?: boolean
  HostOSFQDN?: string
  DDNSTTL?: number
  AMTNetworkEnabled?: number
  RmcpPingResponseEnabled?: boolean
  DDNSPeriodicUpdateInterval?: number
  PresenceNotificationInterval?: number
  PrivacyLevel?: number
  PowerSource?: number
  ThunderboltDockEnabled?: number
  AMTAuthenticate?: (mcNonce: number) => amtAuthenticateObject
}

export interface AMT_EthernetPortSettings extends CIM_SettingData<AMT_EthernetPortSettings> {
  VLANTag?: number
  SharedMAC?: boolean
  MACAddress?: string
  LinkIsUp?: boolean
  LinkPolicy?: number[]
  LinkPreference?: number
  LinkControl?: number
  SharedStaticIp?: boolean
  SharedDynamicIp?: boolean
  IpSyncEnabled?: boolean
  DHCPEnabled?: boolean
  IPAddress?: string
  SubnetMask?: string
  DefaultGateway?: string
  PrimaryDNS?: string
  SecondaryDNS?: string
  ConsoleTcpMaxRetransmissions?: number
  WLANLinkProtectionLevel?: number
  PhysicalConnectionType?: number
  PhysicalNicMedium?: number
  SetLinkPreferences?: (linkPreference: number, timeout: number) => number
  CancelLinkProtection?: () => number
  RestoreLinkProtection?: () => number
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
  Trigger?: number
  TunnelLifeTime?: number
  ExtendedData?: string
}

export interface AMT_EnvironmentDetectionSettingData extends CIM_SettingData<AMT_EnvironmentDetectionSettingData> {
  DetectionAlgorithm?: number
  DetectionStrings?: string[]
  DetectionIPv6LocalPrefixes?: string[]
  SetSystemDefensePolicy?: (policy: AMT_SystemDefencePolicy) => number
  EnableVpnRouting?: (enable: boolean) => number
}

export interface AMT_SystemDefencePolicy extends CIM_ManagedElement<AMT_SystemDefencePolicy> {
  PolicyName?: string
  PolicyPrecedence?: number
  AntiSpoofingSupport?: number
  FilterCreationHandles?: number[]
  TxDefaultDrop?: boolean
  TxDefaultMatchEvent?: boolean
  TxDefaultCount?: boolean
  RxDefaultDrop?: boolean
  RxDefaultMatchEvent?: boolean
  RxDefaultCount?: boolean
  GetTimeout?: () => number
  SetTimeout?: (number) => number
  UpdateStatistics?: (networkInterface: CIM_EthernetPort, resetOnRead: boolean) => number
}

export interface AMT_BootSettingData extends CIM_BootSettingData<AMT_BootSettingData> {
  UseSOL?: boolean
  UseSafeMode?: boolean
  ReflashBIOS?: boolean
  BiosSetup?: boolean
  BiosPause?: boolean
  LockPowerButton?: boolean
  LockResetButton?: boolean
  LockKeyboard?: boolean
  LockSleepButton?: boolean
  UserPasswordBypass?: boolean
  ForcedProgressEvents?: boolean
  FirmwareVerbosity?: number
  ConfigurationDataReset?: boolean
  IDERBootDevice?: number
  UseIDER?: boolean
  EnforceSecureBoot?: boolean
  BootMediaIndex?: number
  SecureErase?: boolean
  RSEPassword?: string
  OptionsCleared?: boolean
  WinREBootEnabled?: boolean
  UEFILocalPBABootEnabled?: boolean
  UEFIHTTPSBootEnabled?: boolean
  SecureBootControlEnabled?: boolean
  BootguardStatus?: boolean
  BiosLastStatus?: number[]
  UEFIBootParametersArray?: number[]
  UEFIBootNumberOfParams?: number[]
}
