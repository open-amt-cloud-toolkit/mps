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
  SETUP = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/Setup',
  START_OPT_IN = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/StartOptIn',
  CANCEL_OPT_IN = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/CancelOptIn',
  SEND_OPT_IN_CODE = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/SendOptInCode'
}
