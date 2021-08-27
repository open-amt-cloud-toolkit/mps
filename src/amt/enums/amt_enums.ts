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
  AMT_SETUP_AND_CONFIGURATION_SERVICE = 'AMT_SetupAndConfigurationService'
}
