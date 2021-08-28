/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum IPS_Methods {
  SETUP = 'Setup'
}

export enum IPS_Actions {
  SETUP = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/Setup'
}

export enum IPS_Classes {
  IPS_OPT_IN_SERVICE = 'IPS_OptInService',
  IPS_HOST_BASED_SETUP_SERVICE = 'IPS_HostBasedSetupService'
}
