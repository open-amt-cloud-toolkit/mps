/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum AMT_Methods {
  READ_RECORDS = 'ReadRecords'
}

export enum AMT_Actions {
  READ_RECORDS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords'
}

export enum AMT_Classes {
  AMT_AUDIT_LOG = 'AMT_AuditLog',
  AMT_REDIRECTION_SERVICE = 'AMT_RedirectionService',
  AMT_SETUP_AND_CONFIGURATION_SERVICE = 'AMT_SetupAndConfigurationService',
  AMT_GENERAL_SETTINGS = 'AMT_GeneralSettings',
  AMT_ETHERNET_PORT_SETTINGS = 'AMT_EthernetPortSettings',
  AMT_REMOTE_ACCESS_POLICY_RULE = 'AMT_RemoteAccessPolicyRule',
  AMT_MANAGEMENT_PRESENCE_REMOTE_SAP = 'AMT_ManagementPresenceRemoteSAP',
  AMT_PUBLIC_KEY_CERTIFICATE = 'AMT_PublicKeyCertificate'
}
