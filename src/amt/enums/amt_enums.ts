/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum AMT_Methods {
  READ_RECORDS = 'ReadRecords',
  ADD_TRUSTED_ROOT_CERTIFICATE = 'AddTrustedRootCertificate',
  ADD_MPS = 'AddMpServer',
  ADD_REMOTE_ACCESS_POLICY_RULE = 'AddRemoteAccessPolicyRule',
  REQUEST_STATE_CHANGE = 'RequestStateChange'
}

export enum AMT_Actions {
  READ_RECORDS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords',
  ADD_TRUSTED_ROOT_CERTIFICATE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddTrustedRootCertificate',
  ADD_MPS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddMpServer',
  ADD_REMOTE_ACCESS_POLICY_RULE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddRemoteAccessPolicyRule',
  REQUEST_STATE_CHANGE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService/RequestStateChange'
}

export enum AMT_Classes {
  AMT_AUDIT_LOG = 'AMT_AuditLog',
  AMT_REDIRECTION_SERVICE = 'AMT_RedirectionService',
  AMT_SETUP_AND_CONFIGURATION_SERVICE = 'AMT_SetupAndConfigurationService',
  AMT_GENERAL_SETTINGS = 'AMT_GeneralSettings',
  AMT_ETHERNET_PORT_SETTINGS = 'AMT_EthernetPortSettings',
  AMT_REMOTE_ACCESS_POLICY_RULE = 'AMT_RemoteAccessPolicyRule',
  AMT_MANAGEMENT_PRESENCE_REMOTE_SAP = 'AMT_ManagementPresenceRemoteSAP',
  AMT_PUBLIC_KEY_CERTIFICATE = 'AMT_PublicKeyCertificate',
  AMT_ENVIRONMENT_DETECTION_SETTING_DATA = 'AMT_EnvironmentDetectionSettingData',
  AMT_PUBLIC_KEY_MANAGEMENT_SERVICE = 'AMT_PublicKeyManagementService',
  AMT_REMOTE_ACCESS_SERVICE = 'AMT_RemoteAccessService',
  AMT_USER_INITIATED_CONNECTION_SERVICE = 'AMT_UserInitiatedConnectionService',
  AMT_BOOT_SETTING_DATA = 'AMT_BootSettingData',
  AMT_BOOT_CAPABILITIES = 'AMT_BootCapabilities'
}
