/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum Actions {
  ENUMERATE = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate',
  PULL = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull',
  GET = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Get',
  PUT = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Put',
  DELETE = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete',
  READ_RECORDS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords',
  ADD_TRUSTED_ROOT_CERTIFICATE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddTrustedRootCertificate',
  ADD_MPS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddMpServer',
  ADD_REMOTE_ACCESS_POLICY_RULE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddRemoteAccessPolicyRule',
  REQUEST_STATE_CHANGE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService/RequestStateChange',
  SET_BOOT_CONFIG_ROLE = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService/SetBootConfigRole',
  GET_RECORDS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/GetRecords',
  POSITION_TO_FIRSTRECORD = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/PositionToFirstRecord'
}
