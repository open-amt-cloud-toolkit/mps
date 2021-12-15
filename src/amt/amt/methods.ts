/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum Methods {
  GET = 'Get',
  PULL = 'Pull',
  ENUMERATE = 'Enumerate',
  PUT = 'Put',
  DELETE = 'Delete',
  READ_RECORDS = 'ReadRecords',
  ADD_TRUSTED_ROOT_CERTIFICATE = 'AddTrustedRootCertificate',
  ADD_MPS = 'AddMpServer',
  ADD_REMOTE_ACCESS_POLICY_RULE = 'AddRemoteAccessPolicyRule',
  REQUEST_STATE_CHANGE = 'RequestStateChange',
  SET_BOOT_CONFIG_ROLE = 'SetBootConfigRole',
  GET_RECORDS = 'GetRecords',
  POSITION_TO_FIRSTRECORD = 'PositionToFirstRecord'
}
