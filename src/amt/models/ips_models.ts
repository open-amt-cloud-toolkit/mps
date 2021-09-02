/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { CIM_SecurityService, CIM_Service } from './cim_models'

export interface IPS_HostBasedSetupService extends CIM_SecurityService<IPS_HostBasedSetupService> {
  currentControlMode?: number
  allowedControlModes?: number[]
  configurationNonce?: number[]
  certChainStatus?: number
}
export interface IPS_OptInService extends CIM_Service<IPS_OptInService> {
  optInCodeTimeout?: number
  optInRequired?: number
  optInState?: number
  canModifyOptInPolicy?: number
  optInDisplayTimeout?: number
  startOptIn?: () => number
  cancelOptIn?: () => number
  sendOptInCode?: (optInCode: number) => number
}
