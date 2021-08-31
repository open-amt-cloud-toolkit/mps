/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { CIM_SecurityService, CIM_Service } from './cim_models'

export interface IPS_HostBasedSetupService extends CIM_SecurityService<IPS_HostBasedSetupService> {
  currentControlMode: Number
  allowedControlModes: Uint8Array
  configurationNonce: Uint8Array
  certChainStatus: Number
}
export interface IPS_OptInService extends CIM_Service<IPS_OptInService> {
  optInCodeTimeout: Number
  optInRequired: Number
  optInState: Number
  canModifyOptInPolicy: Number
  optInDisplayTimeout: Number
  startOptIn: () => Number
  cancelOptIn: () => Number
  sendOptInCode: (optInCode: Number) => Number
}
