/*********************************************************************
 * Copyright (c) Intel Corporation 2020
 * SPDX-License-Identifier: Apache-2.0
 * Description: Handler to get AMT Features
 * Author: Madhavi Losetty
 **********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { UserConsentOptions } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'
import { MPSValidationError } from '../../utils/MPSValidationError'
import { MqttProvider } from '../../utils/MqttProvider'
import { devices } from '../../server/mpsserver'
import { AMT, CIM, IPS } from '@open-amt-cloud-toolkit/wsman-messages/dist'
import { AMT_REDIRECTION_SERVICE_ENABLE_STATE, CIM_KVM_REDIRECTION_SAP_ENABLED_STATE, CIM_KVM_REDIRECTION_SAP_REQUESTED_STATE } from '@open-amt-cloud-toolkit/wsman-messages/dist/models/common'

export async function getAMTFeatures (req: Request, res: Response): Promise<void> {
  try {
    const guid: string = req.params.guid
    const amtRedirectionResponse = await devices[guid].getRedirectionService()
    const optServiceResponse = await devices[guid].getIpsOptInService()
    const kvmRedirectionResponse = await devices[guid].getKvmRedirectionSap()
    MqttProvider.publishEvent('request', ['AMT_GetFeatures'], 'Get AMT Features Requested', guid)

    const { redir, sol, ider } = processAmtRedirectionResponse(amtRedirectionResponse.AMT_RedirectionService)
    const kvm = processKvmRedirectionResponse(kvmRedirectionResponse.CIM_KVMRedirectionSAP)
    const { value, optInState } = processOptServiceResponse(optServiceResponse.IPS_OptInService)
    const userConsent = Object.keys(UserConsentOptions).find(key => UserConsentOptions[key] === value)

    MqttProvider.publishEvent('success', ['AMT_GetFeatures'], 'Get AMT Features', guid)
    res.status(200).json({ userConsent: userConsent, redirection: redir, KVM: kvm, SOL: sol, IDER: ider, optInState: optInState }).end()
  } catch (error) {
    log.error(`Exception in get AMT Features: ${error}`)
    if (error instanceof MPSValidationError) {
      res.status(error.status || 400).json(ErrorResponse(error.status || 400, error.message))
    } else {
      MqttProvider.publishEvent('fail', ['AMT_GetFeatures'], 'Internal Server Error')
      res.status(500).json(ErrorResponse(500, 'Request failed during get AMT Features.'))
    }
  }
}

export function processAmtRedirectionResponse (amtRedirection: AMT.Models.RedirectionService): {redir: boolean, sol: boolean, ider: boolean} {
  const redir = (amtRedirection.ListenerEnabled as any) === 'true' // not sure the best way to handle this at the moment...ok. Ready for a debug?yes, ok.. need to fix all the problems in tests
  const sol = amtRedirection.EnabledState === AMT_REDIRECTION_SERVICE_ENABLE_STATE.Enabled
  const ider = amtRedirection.EnabledState === AMT_REDIRECTION_SERVICE_ENABLE_STATE.Other
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
