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
import { CIM_KVM_REDIRECTION_SAP_REQUESTED_STATE as cimRequestedState, CIM_KVM_REDIRECTION_SAP_ENABLED_STATE as cimEnabledState, AMT_REDIRECTION_SERVICE_ENABLE_STATE as amtEnabledState } from '../../amt/models/common'
import { AMT_RedirectionService } from '../../amt/models/amt_models'
import { IPS_OptInService } from '../../amt/models/ips_models'
import { CIM_KVMRedirectionSAP } from '../../amt/models/cim_models'

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

export function processAmtRedirectionResponse (amtRedirection: AMT_RedirectionService): {redir: boolean, sol: boolean, ider: boolean} {
  const redir = (amtRedirection.ListenerEnabled as any) === 'true' // not sure the best way to handle this at the moment...ok. Ready for a debug?yes, ok.. need to fix all the problems in tests
  const sol = amtRedirection.EnabledState === amtEnabledState.Enabled
  const ider = amtRedirection.EnabledState === amtEnabledState.Other
  return { redir, sol, ider }
}

export function processKvmRedirectionResponse (kvmRedirection: CIM_KVMRedirectionSAP): boolean {
  const kvm = ((kvmRedirection.EnabledState === cimEnabledState.EnabledButOffline &&
                kvmRedirection.RequestedState === cimRequestedState.Enabled) ||
                kvmRedirection.EnabledState === cimEnabledState.Enabled ||
                kvmRedirection.EnabledState === cimEnabledState.EnabledButOffline)
  return kvm
}

export function processOptServiceResponse (optService: IPS_OptInService): {value: number, optInState: number} {
  const value = optService.OptInRequired
  const optInState = optService.OptInState
  return { value, optInState }
}
