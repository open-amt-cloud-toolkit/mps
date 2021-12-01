/*********************************************************************
 * Copyright (c) Intel Corporation 2020
 * SPDX-License-Identifier: Apache-2.0
 * Description: Handler to get AMT Features
 * Author: Madhavi Losetty
 **********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { AMTFeaturesConst, UserConsentOptions } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'
import AMTFeatures from '../../utils/AMTFeatures'
import { MPSValidationError } from '../../utils/MPSValidationError'
import { MqttProvider } from '../../utils/MqttProvider'

export async function getAMTFeatures (req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body
    const guid: string = req.params.guid

    MqttProvider.publishEvent('request', ['AMT_GetFeatures'], 'Get AMT Features Requested', guid)

    const wsmanResponse = await AMTFeatures.getAMTFeatures(req.amtStack, payload)
    req.amtStack.wsman.comm.socket.sendchannelclose()
    if (wsmanResponse[AMTFeaturesConst.AMT_REDIR_SERVICE] &&
                      wsmanResponse[AMTFeaturesConst.AMT_KVM_REDIR] &&
                      wsmanResponse[AMTFeaturesConst.AMT_OPTIN_SERVICE]) {
      const amtRedirResponse = wsmanResponse[AMTFeaturesConst.AMT_REDIR_SERVICE].response
      const kvmRedirResponse = wsmanResponse[AMTFeaturesConst.AMT_KVM_REDIR].response
      const optServiceRes = wsmanResponse[AMTFeaturesConst.AMT_OPTIN_SERVICE].response

      const redir = (amtRedirResponse[AMTFeaturesConst.AMT_REDIR_LISTENER] === true)
      const sol = ((amtRedirResponse[AMTFeaturesConst.AMT_REDIR_STATE] & 2) !== 0)
      const ider = ((amtRedirResponse[AMTFeaturesConst.AMT_REDIR_STATE] & 1) !== 0)
      const kvm = ((kvmRedirResponse.EnabledState === 6 && kvmRedirResponse.RequestedState === 2) ||
                          kvmRedirResponse.EnabledState === 2 || kvmRedirResponse.EnabledState === 6)

      const value = optServiceRes[AMTFeaturesConst.AMT_USER_CONSENT]
      const optInState = optServiceRes[AMTFeaturesConst.AMT_OPT_IN_STATE]
      const userConsent = Object.keys(UserConsentOptions).find(key => UserConsentOptions[key] === value)

      MqttProvider.publishEvent('success', ['AMT_GetFeatures'], 'Get AMT Features', guid)
      res.status(200).json({ userConsent: userConsent, redirection: redir, KVM: kvm, SOL: sol, IDER: ider, optInState: optInState }).end()
    }
  } catch (error) {
    log.error(`Exception in get AMT Features: ${error}`)
    if (error instanceof MPSValidationError) {
      return res.status(error.status || 400).json(ErrorResponse(error.status || 400, error.message)).end()
    } else {
      MqttProvider.publishEvent('fail', ['AMT_GetFeatures'], 'Internal Server Error')
      return res.status(500).json(ErrorResponse(500, 'Request failed during get AMT Features.')).end()
    }
  }
}
