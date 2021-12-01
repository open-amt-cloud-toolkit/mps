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
  SET_BOOT_CONFIG_ROLE = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService/SetBootConfigRole',
  CHANGE_BOOT_ORDER = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting/ChangeBootOrder',
  REQUEST_POWER_STATE_CHANGE = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService/RequestPowerStateChange'
}
