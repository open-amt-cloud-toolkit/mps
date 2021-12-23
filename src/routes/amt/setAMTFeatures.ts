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
import { MPSValidationError } from '../../utils/MPSValidationError'
import { MqttProvider } from '../../utils/MqttProvider'
import { AMTFeaturesConst, UserConsentOptions } from '../../utils/constants'
import { AMT_REDIRECTION_SERVICE_ENABLE_STATE } from '@open-amt-cloud-toolkit/wsman-messages/dist/models/common'

export async function setAMTFeatures (req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body
    const guid: string = req.params.guid
    payload.guid = guid

    MqttProvider.publishEvent('request', ['AMT_SetFeatures'], 'Set AMT Features Requested', guid)

    // await AMTFeatures.setAMTFeatures(req.amtStack, payload)
    // req.amtStack.wsman.comm.socket.sendchannelclose()
    const amtRedirectionResponse = await devices[guid].getRedirectionService()
    const optServiceResponse = await devices[guid].getIpsOptInService()
    const kvmRedirectionResponse = await devices[guid].getKvmRedirectionSap()
    let isRedirectionChanged = false

    if (amtRedirectionResponse[AMTFeaturesConst.AMT_REDIR_SERVICE] && kvmRedirectionResponse[AMTFeaturesConst.AMT_KVM_REDIR]) {
      let redir, sol, ider, kvm

      redir = (amtRedirectionResponse[AMTFeaturesConst.AMT_REDIR_LISTENER] === 'true')
      sol = ((amtRedirectionResponse[AMTFeaturesConst.AMT_REDIR_STATE] & AMT_REDIRECTION_SERVICE_ENABLE_STATE.Enabled) !== 0)
      ider = ((amtRedirectionResponse[AMTFeaturesConst.AMT_REDIR_STATE] & AMT_REDIRECTION_SERVICE_ENABLE_STATE.Other) !== 0)

      if (payload.enableSOL !== undefined && payload.enableSOL !== sol) {
        sol = payload.enableSOL
        isRedirectionChanged = true
      }

      if (payload.enableIDER !== undefined && payload.enableIDER !== ider) {
        ider = payload.enableIDER
        isRedirectionChanged = true
      }

      if ((sol || ider) && !redir) {
        isRedirectionChanged = true
      }

      kvm = ((kvmRedirectionResponse[AMTFeaturesConst.AMT_KVM_ENABLED_STATE] === 6 &&
              kvmRedirectionResponse[AMTFeaturesConst.AMT_KVM_REQUESTED_STATE] === 2) ||
              kvmRedirectionResponse[AMTFeaturesConst.AMT_KVM_ENABLED_STATE] === 2 ||
              kvmRedirectionResponse[AMTFeaturesConst.AMT_KVM_ENABLED_STATE] === 6)

      if (payload.enableKVM !== undefined && payload.enableKVM !== kvm) {
        kvm = payload.enableKVM
        isRedirectionChanged = true
      }

      if (isRedirectionChanged && (sol || ider || kvm)) {
        redir = true
      } else if (isRedirectionChanged && !sol && !ider && !kvm) {
        redir = false
      }

      if (isRedirectionChanged) {
        amtRedirectionResponse[AMTFeaturesConst.AMT_REDIR_STATE] = 32768 + ((ider ? 1 : 0) + (sol ? 2 : 0))
        amtRedirectionResponse[AMTFeaturesConst.AMT_REDIR_LISTENER] = redir
        // await AMTFeatures.setRedirectionService(amtstack, amtRedirResponse, kvm, payload)
      }
    }

    if (optServiceResponse[AMTFeaturesConst.AMT_OPTIN_SERVICE]) {
      const optResponse = optServiceResponse[AMTFeaturesConst.AMT_OPTIN_SERVICE].response
      if (payload.userConsent) {
        const key = payload.userConsent.toLowerCase()
        const optInRequiredValue = UserConsentOptions[key]
        if (optResponse[AMTFeaturesConst.AMT_USER_CONSENT] !== optInRequiredValue) {
          optResponse[AMTFeaturesConst.AMT_USER_CONSENT] = optInRequiredValue
          // await AMTFeatures.setUserConsent(amtstack, optServiceRes, payload)
        }
      }
    }

    MqttProvider.publishEvent('success', ['AMT_SetFeatures'], 'Set AMT Features', guid)
    res.status(200).json({ status: 'Updated AMT Features' }).end()
  } catch (error) {
    log.error(`Exception in set AMT Features: ${error}`)
    if (error instanceof MPSValidationError) {
      res.status(error.status || 400).json(ErrorResponse(error.status || 400, error.message)).end()
    } else {
      MqttProvider.publishEvent('fail', ['AMT_SetFeatures'], 'Internal Server Error')
      res.status(500).json(ErrorResponse(500, 'Request failed during set AMT Features.')).end()
    }
  }
}
export async function setRedirectionService (amtstack: any, amtRedirResponse: any, kvm: any, payload: any): Promise<boolean> {
  return await new Promise((resolve, reject) => {
    amtstack.AMT_RedirectionService_RequestStateChange(amtRedirResponse.EnabledState, (stack, name, response, status) => {
      if (status !== 200) {
        reject(new MPSValidationError(`Failed Redir Request State Change for guid : ${payload.guid}.`, status))
      } else {
        amtstack.CIM_KVMRedirectionSAP_RequestStateChange(kvm ? 2 : 3, 0, (stack, name, response, status) => {
          if (status !== 200) {
            reject(new MPSValidationError(`Failed to update KVM Redirection Service for guid : ${payload.guid}.`, status))
          }
          amtstack.Put(AMTFeaturesConst.AMT_REDIR_SERVICE, amtRedirResponse, (stack, name, kvmRedirResponse, status) => {
            if (status !== 200) {
              reject(new MPSValidationError(`Failed AMT RedirectionService update for guid : ${payload.guid}.`, status))
            }
            resolve(true)
          })
        })
      }
    })
  })
}
