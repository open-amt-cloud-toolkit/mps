/*********************************************************************
 * Copyright (c) Intel Corporation 2020
 * SPDX-License-Identifier: Apache-2.0
 * Description: Handler to set AMT Features
 * Author: Madhavi Losetty
 **********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'

import { amtPort, MPSMode, UserConsentOptions } from '../../utils/constants'
import { ErrorResponse } from '../../utils/amtHelper'
import { AMTFeatures } from '../../utils/AMTFeatures'

import { MPSValidationError } from '../../utils/MPSValidationError'
import { apiResponseType } from '../../models/Config'


  export async function setAMTFeatures (req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body.payload
      if (payload.guid) {
        // Checks request input values
        this.validatePayload(payload)
        const ciraconn = await req.mpsService.ciraConnectionFactory.getConnection(payload.guid)
        if (ciraconn && ciraconn.readyState === 'open') {
          const cred = await req.mpsService.db.getAmtPassword(payload.guid)
          const amtstack = req.amtFactory.getAmtStack(payload.guid, amtPort, cred[0], cred[1], 0)
          await AMTFeatures.setAMTFeatures(amtstack, payload)
          if (req.mpsService.config.startup_mode === MPSMode.Standalone) {
            amtstack.wsman.comm.socket.sendchannelclose()
          }
          const response: apiResponseType = { statuscode: 200, payload: { status: 'Updated AMT Features' } }
          res.status(200).send(JSON.stringify(response))
        } else {
          res.set({ 'Content-Type': 'application/json' })
          res.status(404).send(ErrorResponse(404, `guid : ${payload.guid}`, 'device'))
        }
      } else {
        res.set({ 'Content-Type': 'application/json' })
        res.status(404).send(ErrorResponse(404, null, 'guid'))
      }
    } catch (error) {
      log.error(`Exception in set AMT Features: ${error}`)
      if (error instanceof MPSValidationError) {
        res.status(error.status || 400).send(ErrorResponse(error.status || 400, error.message))
      } else {
        res.status(500).send(ErrorResponse(500, 'Request failed during set AMT Features.'))
      }
    }
  }

  validatePayload (payload: any): void {
    if (payload.userConsent === undefined && payload.enableSOL === undefined &&
            payload.enableIDER === undefined && payload.enableKVM === undefined) {
      throw new MPSValidationError(`Device : ${payload.guid} to set AMT features,at least on flag is mandatory.\n userConsent:"kvm/all/none" \n enableRedir: true/false \n enableSOL: true/false \n enableIDER: true/false \n enableKVM: true/false`)
    }

    // Check if valid option is received. 0:None,1:For KVM only, 0xFFFFFFFF: All
    if (payload.userConsent !== undefined) {
      if (typeof payload.userConsent === 'string') {
        const key = payload.userConsent.toLowerCase()
        if (!UserConsentOptions.hasOwnProperty(key)) {
          throw new MPSValidationError(`Device : ${payload.guid} User Consent should be "kvm/all/none"`)
        }
      } else {
        throw new MPSValidationError(`Device : ${payload.guid} User Consent should be "kvm/all/none"`)
      }
    }

    if (payload.enableSOL !== undefined && typeof payload.enableSOL !== 'boolean') {
      throw new MPSValidationError(`Device : ${payload.guid} enableSOL should be boolean`)
    }
    if (payload.enableIDER !== undefined && typeof payload.enableIDER !== 'boolean') {
      throw new MPSValidationError(`Device : ${payload.guid} enableIDER should be boolean`)
    }
    if (payload.enableKVM !== undefined && typeof payload.enableKVM !== 'boolean') {
      throw new MPSValidationError(`Device : ${payload.guid} enableKVM should be boolean`)
    }
  }
//}
