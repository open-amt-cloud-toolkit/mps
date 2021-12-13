/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export const amtPort = 16992

export const DefaultNetworkingAdaptor = 'eth0'

export const UUIDRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

// HTTP error codes
export const httpErrorTable = {
  200: 'OK',
  400: 'Incorrect URI or Bad Request',
  401: 'Authentication Error',
  404: {
    device: 'Device not found/connected. Please connect again using CIRA.',
    method: 'Request does not contain method',
    noMethod: 'Requested method does not exists',
    payload: 'Request does not contain payload',
    guid: 'GUID does not exist in the payload',
    action: 'Power action type does not exist',
    invalidGuid: 'GUID empty/invalid'
  },
  408: 'Timeout Error',
  500: 'Internal Server Error',
  601: 'WSMAN Parsing Error',
  602: 'Unable to parse HTTP response header',
  603: 'Unexpected HTTP enum response',
  604: 'Unexpected HTTP pull response'
}

// Power Actions supported as per Distributed Management Task Force standard.
// ValueMap={2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16}
// Values={Power On, Sleep - Light, Sleep - Deep, Power Cycle (Off Soft), Power Off - Hard, Hibernate, Power Off - Soft, Power Cycle (Off Hard), Master Bus Reset, Diagnostic Interrupt (NMI), Power Off - Soft Graceful, Power Off - Hard Graceful, Master Bus Reset Graceful, Power Cycle (Off - Soft Graceful), Power Cycle (Off - Hard Graceful)}
export const DMTFPowerStates = [2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17]
export const DMTFPowerExtendedStates = [100, 101, 104, 200, 201, 202, 203, 300, 301, 400, 401]

export const UserConsentOptions = {
  none: 0,
  kvm: 1,
  all: 0xFFFFFFFF
}

export const AMTFeaturesConst = {
  AMT_REDIR_SERVICE: 'AMT_RedirectionService',
  AMT_REDIR_LISTENER: 'ListenerEnabled',
  AMT_REDIR_STATE: 'EnabledState',
  AMT_KVM_REDIR: 'CIM_KVMRedirectionSAP',
  AMT_KVM_ENABLED_STATE: 'EnabledState',
  AMT_KVM_REQUESTED_STATE: 'RequestedState',
  AMT_OPTIN_SERVICE: 'IPS_OptInService',
  AMT_USER_CONSENT: 'OptInRequired',
  AMT_OPT_IN_STATE: 'OptInState'
}

// Default top and skip for api pagination

export const DEFAULT_TOP = 25
export const DEFAULT_SKIP = 0

export const AmtAuditStringTable = {
  16: 'Security Admin',
  17: 'RCO',
  18: 'Redirection Manager',
  19: 'Firmware Update Manager',
  20: 'Security Audit Log',
  21: 'Network Time',
  22: 'Network Administration',
  23: 'Storage Administration',
  24: 'Event Manager',
  25: 'Circuit Breaker Manager',
  26: 'Agent Presence Manager',
  27: 'Wireless Configuration',
  28: 'EAC',
  29: 'KVM',
  30: 'User Opt-In Events',
  32: 'Screen Blanking',
  33: 'Watchdog Events',
  1600: 'Provisioning Started',
  1601: 'Provisioning Completed',
  1602: 'ACL Entry Added',
  1603: 'ACL Entry Modified',
  1604: 'ACL Entry Removed',
  1605: 'ACL Access with Invalid Credentials',
  1606: 'ACL Entry State',
  1607: 'TLS State Changed',
  1608: 'TLS Server Certificate Set',
  1609: 'TLS Server Certificate Remove',
  1610: 'TLS Trusted Root Certificate Added',
  1611: 'TLS Trusted Root Certificate Removed',
  1612: 'TLS Preshared Key Set',
  1613: 'Kerberos Settings Modified',
  1614: 'Kerberos Master Key Modified',
  1615: 'Flash Wear out Counters Reset',
  1616: 'Power Package Modified',
  1617: 'Set Realm Authentication Mode',
  1618: 'Upgrade Client to Admin Control Mode',
  1619: 'Unprovisioning Started',
  1700: 'Performed Power Up',
  1701: 'Performed Power Down',
  1702: 'Performed Power Cycle',
  1703: 'Performed Reset',
  1704: 'Set Boot Options',
  1800: 'IDER Session Opened',
  1801: 'IDER Session Closed',
  1802: 'IDER Enabled',
  1803: 'IDER Disabled',
  1804: 'SoL Session Opened',
  1805: 'SoL Session Closed',
  1806: 'SoL Enabled',
  1807: 'SoL Disabled',
  1808: 'KVM Session Started',
  1809: 'KVM Session Ended',
  1810: 'KVM Enabled',
  1811: 'KVM Disabled',
  1812: 'VNC Password Failed 3 Times',
  1900: 'Firmware Updated',
  1901: 'Firmware Update Failed',
  2000: 'Security Audit Log Cleared',
  2001: 'Security Audit Policy Modified',
  2002: 'Security Audit Log Disabled',
  2003: 'Security Audit Log Enabled',
  2004: 'Security Audit Log Exported',
  2005: 'Security Audit Log Recovered',
  2100: 'Intel(R) ME Time Set',
  2200: 'TCPIP Parameters Set',
  2201: 'Host Name Set',
  2202: 'Domain Name Set',
  2203: 'VLAN Parameters Set',
  2204: 'Link Policy Set',
  2205: 'IPv6 Parameters Set',
  2300: 'Global Storage Attributes Set',
  2301: 'Storage EACL Modified',
  2302: 'Storage FPACL Modified',
  2303: 'Storage Write Operation',
  2400: 'Alert Subscribed',
  2401: 'Alert Unsubscribed',
  2402: 'Event Log Cleared',
  2403: 'Event Log Frozen',
  2500: 'CB Filter Added',
  2501: 'CB Filter Removed',
  2502: 'CB Policy Added',
  2503: 'CB Policy Removed',
  2504: 'CB Default Policy Set',
  2505: 'CB Heuristics Option Set',
  2506: 'CB Heuristics State Cleared',
  2600: 'Agent Watchdog Added',
  2601: 'Agent Watchdog Removed',
  2602: 'Agent Watchdog Action Set',
  2700: 'Wireless Profile Added',
  2701: 'Wireless Profile Removed',
  2702: 'Wireless Profile Updated',
  2800: 'EAC Posture Signer SET',
  2801: 'EAC Enabled',
  2802: 'EAC Disabled',
  2803: 'EAC Posture State',
  2804: 'EAC Set Options',
  2900: 'KVM Opt-in Enabled',
  2901: 'KVM Opt-in Disabled',
  2902: 'KVM Password Changed',
  2903: 'KVM Consent Succeeded',
  2904: 'KVM Consent Failed',
  3000: 'Opt-In Policy Change',
  3001: 'Send Consent Code Event',
  3002: 'Start Opt-In Blocked Event'
}

export const RealmNames = '||Redirection|PT Administration|Hardware Asset|Remote Control|Storage|Event Manager|Storage Admin|Agent Presence Local|Agent Presence Remote|Circuit Breaker|Network Time|General Information|Firmware Update|EIT|LocalUN|Endpoint Access Control|Endpoint Access Control Admin|Event Log Reader|Audit Log|ACL Realm|||Local System'.split('|')
