/*********************************************************************
 * Copyright (c) Intel Corporation 2020
 * SPDX-License-Identifier: Apache-2.0
 * Description: Handler to set AMT Features
 * Author: Madhavi Losetty
 **********************************************************************/
import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { ErrorResponse } from '../../utils/amtHelper'
import { devices } from '../../server/mpsserver'
import { MqttProvider } from '../../utils/MqttProvider'
import { UserConsentOptions } from '../../utils/constants'
import { AMT_REDIRECTION_SERVICE_ENABLE_STATE } from '@open-amt-cloud-toolkit/wsman-messages/dist/models/common'
import { AMT, IPS } from '@open-amt-cloud-toolkit/wsman-messages/dist'

export async function setAMTFeatures (req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body
    const guid: string = req.params.guid
    payload.guid = guid

    MqttProvider.publishEvent('request', ['AMT_SetFeatures'], 'Set AMT Features Requested', guid)

    const amtRedirectionResponse = await devices[guid].getRedirectionService()
    const optServiceResponse = await devices[guid].getIpsOptInService()
    const kvmRedirectionResponse = await devices[guid].getKvmRedirectionSap()

    let isRedirectionChanged = false
    let redir = amtRedirectionResponse.AMT_RedirectionService.ListenerEnabled
    let sol = (amtRedirectionResponse.AMT_RedirectionService.EnabledState & AMT_REDIRECTION_SERVICE_ENABLE_STATE.Enabled) !== 0
    let ider = (amtRedirectionResponse.AMT_RedirectionService.EnabledState & AMT_REDIRECTION_SERVICE_ENABLE_STATE.Other) !== 0
    let kvm = ((kvmRedirectionResponse.CIM_KVMRedirectionSAP.EnabledState === AMT_REDIRECTION_SERVICE_ENABLE_STATE.EnabledButOffline &&
      kvmRedirectionResponse.CIM_KVMRedirectionSAP.RequestedState === AMT_REDIRECTION_SERVICE_ENABLE_STATE.Enabled) ||
      kvmRedirectionResponse.CIM_KVMRedirectionSAP.EnabledState === AMT_REDIRECTION_SERVICE_ENABLE_STATE.Enabled ||
      kvmRedirectionResponse.CIM_KVMRedirectionSAP.EnabledState === AMT_REDIRECTION_SERVICE_ENABLE_STATE.EnabledButOffline)

    if (payload.enableSOL !== sol) {
      sol = payload.enableSOL
      isRedirectionChanged = true
    }

    if (payload.enableIDER !== ider) {
      ider = payload.enableIDER
      isRedirectionChanged = true
    }

    if ((sol || ider) && !redir) {
      isRedirectionChanged = true
    }

    if (payload.enableKVM !== kvm) {
      kvm = payload.enableKVM
      isRedirectionChanged = true
    }

    if (isRedirectionChanged && (sol || ider || kvm)) {
      redir = true
    } else if (isRedirectionChanged && !sol && !ider && !kvm) {
      redir = false
    }

    if (isRedirectionChanged) {
      amtRedirectionResponse.AMT_RedirectionService.EnabledState = 32768 + ((ider ? 1 : 0) + (sol ? 2 : 0))
      amtRedirectionResponse.AMT_RedirectionService.ListenerEnabled = redir
      await setRedirectionService(amtRedirectionResponse, kvm, payload.guid)
    }

    const optResponse = optServiceResponse.IPS_OptInService
    const key = payload.userConsent.toLowerCase()
    const optInRequiredValue = UserConsentOptions[key]
    if (optResponse.OptInRequired !== optInRequiredValue) {
      optResponse.OptInRequired = optInRequiredValue
      await setUserConsent(optServiceResponse, payload.guid)
    }

    MqttProvider.publishEvent('success', ['AMT_SetFeatures'], 'Set AMT Features', guid)
    res.status(200).json({ status: 'Updated AMT Features' }).end()
  } catch (error) {
    log.error(`Exception in set AMT Features: ${error}`)
    MqttProvider.publishEvent('fail', ['AMT_SetFeatures'], 'Internal Server Error')
    res.status(500).json(ErrorResponse(500, 'Request failed during set AMT Features.')).end()
  }
}
export async function setRedirectionService (amtRedirResponse: AMT.Models.RedirectionResponse, kvm: boolean, guid: string): Promise<void> {
  // TODO: check statuses
  // for SOL and IDER
  await devices[guid].setRedirectionService(amtRedirResponse.AMT_RedirectionService.EnabledState)
  // for kvm
  await devices[guid].setKvmRedirectionSap(kvm ? AMT_REDIRECTION_SERVICE_ENABLE_STATE.Enabled : AMT_REDIRECTION_SERVICE_ENABLE_STATE.Disabled)

  await devices[guid].putRedirectionService(amtRedirResponse)
}

export async function setUserConsent (optServiceRes: IPS.Models.OptInServiceResponse, guid: string): Promise<void> {
  const result = await devices[guid].putIpsOptInService(optServiceRes)
  console.log(result)
}
