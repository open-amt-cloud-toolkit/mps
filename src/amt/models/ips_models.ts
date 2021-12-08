/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { CIM_SecurityService, CIM_Service } from './cim_models'

export interface IPS_HostBasedSetupService extends CIM_SecurityService<IPS_HostBasedSetupService> {
  CurrentControlMode?: number
  AllowedControlModes?: number[]
  ConfigurationNonce?: number[]
  CertChainStatus?: number
}
export interface IPS_OptInService extends CIM_Service<IPS_OptInService> {
  OptInCodeTimeout?: number
  OptInRequired?: number
  OptInState?: number
  CanModifyOptInPolicy?: number
  OptInDisplayTimeout?: number
  StartOptIn?: () => number
  CancelOptIn?: () => number
  SendOptInCode?: (optInCode: number) => number
}
