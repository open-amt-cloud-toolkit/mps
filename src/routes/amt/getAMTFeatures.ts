/*********************************************************************
 * Copyright (c) Intel Corporation 2020
 * SPDX-License-Identifier: Apache-2.0
 * Description: Handler to get AMT Features
 * Author: Madhavi Losetty
 **********************************************************************/

import { Response, Request } from 'express'
import { logger, messages } from '../../logging'
import { UserConsentOptions } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'
import { MPSValidationError } from '../../utils/MPSValidationError'
import { MqttProvider } from '../../utils/MqttProvider'
import { AMT, CIM, IPS } from '@open-amt-cloud-toolkit/wsman-messages'
import { AMT_REDIRECTION_SERVICE_ENABLE_STATE, CIM_KVM_REDIRECTION_SAP_ENABLED_STATE, CIM_KVM_REDIRECTION_SAP_REQUESTED_STATE } from '@open-amt-cloud-toolkit/wsman-messages/models/common'

export async function getAMTFeatures (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid
    const amtRedirectionResponse = await req.deviceAction.getRedirectionService()
    const optServiceResponse = await req.deviceAction.getIpsOptInService()
    const kvmRedirectionResponse = await req.deviceAction.getKvmRedirectionSap()

    MqttProvider.publishEvent('request', ['AMT_GetFeatures'], messages.AMT_FEATURES_GET_REQUESTED, guid)

    const { redir, sol, ider } = processAmtRedirectionResponse(amtRedirectionResponse.AMT_RedirectionService)
    const kvm = processKvmRedirectionResponse(kvmRedirectionResponse.CIM_KVMRedirectionSAP)
    const { value, optInState } = processOptServiceResponse(optServiceResponse.IPS_OptInService)
    const userConsent = Object.keys(UserConsentOptions).find(key => UserConsentOptions[key] === value)

    MqttProvider.publishEvent('success', ['AMT_GetFeatures'], messages.AMT_FEATURES_GET_SUCCESS, guid)
    res.status(200).json({ userConsent: userConsent, redirection: redir, KVM: kvm, SOL: sol, IDER: ider, optInState: optInState }).end()
  } catch (error) {
    logger.error(`${messages.AMT_FEATURES_EXCEPTION}: ${error}`)
    if (error instanceof MPSValidationError) {
      res.status(error.status || 400).json(ErrorResponse(error.status || 400, error.message))
    } else {
      MqttProvider.publishEvent('fail', ['AMT_GetFeatures'], messages.INTERNAL_SERVICE_ERROR)
      res.status(500).json(ErrorResponse(500, messages.AMT_FEATURES_EXCEPTION))
    }
  }
}

export function processAmtRedirectionResponse (amtRedirection: AMT.Models.RedirectionService): {redir: boolean, sol: boolean, ider: boolean} {
  const redir = amtRedirection.ListenerEnabled
  const sol = (amtRedirection.EnabledState & AMT_REDIRECTION_SERVICE_ENABLE_STATE.Enabled) !== 0
  const ider = (amtRedirection.EnabledState & AMT_REDIRECTION_SERVICE_ENABLE_STATE.Other) !== 0
  return { redir, sol, ider }
}

export function processKvmRedirectionResponse (kvmRedirection: CIM.Models.KVMRedirectionSAP): boolean {
  const kvm = ((kvmRedirection.EnabledState === CIM_KVM_REDIRECTION_SAP_ENABLED_STATE.EnabledButOffline &&
                kvmRedirection.RequestedState === CIM_KVM_REDIRECTION_SAP_REQUESTED_STATE.Enabled) ||
                kvmRedirection.EnabledState === CIM_KVM_REDIRECTION_SAP_ENABLED_STATE.Enabled ||
                kvmRedirection.EnabledState === CIM_KVM_REDIRECTION_SAP_ENABLED_STATE.EnabledButOffline)
  return kvm
}

export function processOptServiceResponse (optService: IPS.Models.OptInService): {value: number, optInState: number} {
  const value = optService.OptInRequired
  const optInState = optService.OptInState
  return { value, optInState }
}
