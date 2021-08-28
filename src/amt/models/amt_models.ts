/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { CIM_SettingData } from './cim_models'

export interface amtAuthenticateObject {
  nonce?: Uint8Array
  uuid?: String[]
  fqdn?: String
  fwVersion?: String
  amtSvn?: Number
  signatureMechanism?: Number
  signature?: Uint8Array
  lengthOfCertificates?: Number[]
  certificates?: Uint8Array
}

export interface AMT_GeneralSettings extends CIM_SettingData<AMT_GeneralSettings> {
  networkInterfaceEnabled?: Boolean
  digestRealm?: String
  idleWakeTimeout?: Number
  hostName?: String
  domainName?: String
  pingResponseEnabled?: Boolean
  wsmanOnlyMode?: Boolean
  preferredAddressFamily?: Number
  dhcpv6ConfigurationTimeout?: Number
  ddnsUpdateByDHCPServerEnabled?: Boolean
  sharedFQDN?: Boolean
  hostOSFQDN?: String
  ddnsttl?: Number
  amtNetworkEnabled?: Number
  rmcpPingResponseEnabled?: Boolean
  ddnsPeriodicUpdateInterval?: Number
  presenceNotificationInterval?: Number
  privacyLevel?: Number
  powerSource?: Number
  thunderboltDockEnabled?: Number
  amtAuthenticate?: (mcNonce: Number) => amtAuthenticateObject
}

export interface AMT_EthernetPortSettings extends CIM_SettingData<AMT_EthernetPortSettings> {
  vlanTag?: Number
  sharedMAC?: Boolean
  macAddress?: String
  linkIsUp?: Boolean
  linkPolicy?: Number[]
  linkPreference?: Number
  linkControl?: Number
  sharedStaticIp?: Boolean
  sharedDynamicIp?: Boolean
  ipSyncEnabled?: Boolean
  dhcpEnabled?: Boolean
  ipAddress?: String
  subnetMask?: String
  defaultGateway?: String
  primaryDNS?: String
  secondaryDNS?: String
  consoleTcpMaxRetransmissions?: Number
  wlanLinkProtectionLevel?: Number
  physicalConnectionType?: Number
  physicalNicMedium?: Number
  setLinkPreferences?: (linkPreference: Number, timeout: Number) => Number
  cancelLinkProtection?: () => Number
  restoreLinkProtection?: () => Number
}
