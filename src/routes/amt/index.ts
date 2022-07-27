/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Router } from 'express'
import { auditLog } from './auditLog'
import { eventLog } from './eventLog'
import { generalSettings } from './getGeneralSettings'
import { hardwareInfo } from './getHardwareInfo'
import { powerAction } from './powerAction'
import { bootOptions } from './bootOptions'
import { powerCapabilities } from './powerCapabilities'
import { powerState } from './getPowerState'
import { version } from './getVersion'
import { deleteAlarmOccurrence } from './deleteAlarmOccurrence'
import { getAlarmOccurrences } from './getAlarmOccurrences'
import { getAMTFeatures } from './getAMTFeatures'
import { setAMTFeatures } from './setAMTFeatures'
import { setAlarmOccurrence } from './setAlarmOccurrence'
import { amtFeaturesValidator } from './amtFeatureValidator'
import { powerActionValidator } from './powerActionValidator'
import { auditLogValidator } from './auditLogValidator'
import { bootOptionsValidator } from './bootOptionsValidator'
import ciraMiddleware from '../../middleware/cira'
import validateMiddleware from '../../middleware/validate'

import { cancel } from './userConsent/cancel'
import { request } from './userConsent/request'
import { send } from './userConsent/send'
import { validator as userConsentValidator } from './userConsent/validator'

const amtRouter: Router = Router()

amtRouter.get('/log/audit/:guid', auditLogValidator(), validateMiddleware, ciraMiddleware, auditLog as any)
amtRouter.get('/log/event/:guid', ciraMiddleware, eventLog)
amtRouter.get('/generalSettings/:guid', ciraMiddleware, generalSettings)
amtRouter.get('/hardwareInfo/:guid', ciraMiddleware, hardwareInfo)
amtRouter.post('/power/action/:guid', powerActionValidator(), validateMiddleware, ciraMiddleware, powerAction)
amtRouter.post('/power/bootOptions/:guid', bootOptionsValidator(), validateMiddleware, ciraMiddleware, bootOptions)
amtRouter.get('/power/capabilities/:guid', ciraMiddleware, powerCapabilities)
amtRouter.get('/power/state/:guid', ciraMiddleware, powerState)
amtRouter.get('/features/:guid', ciraMiddleware, getAMTFeatures)
amtRouter.post('/features/:guid', amtFeaturesValidator(), validateMiddleware, ciraMiddleware, setAMTFeatures)
amtRouter.get('/version/:guid', ciraMiddleware, version)

amtRouter.get('/userConsentCode/cancel/:guid', ciraMiddleware, cancel)
amtRouter.get('/userConsentCode/:guid', ciraMiddleware, request)
amtRouter.post('/userConsentCode/:guid', userConsentValidator(), validateMiddleware, ciraMiddleware, send)
amtRouter.get('/alarmOccurrences/:guid', ciraMiddleware, getAlarmOccurrences)
amtRouter.post('/alarmOccurrences/:guid', validateMiddleware, ciraMiddleware, setAlarmOccurrence)
amtRouter.delete('/alarmOccurrences/:guid', validateMiddleware, ciraMiddleware, deleteAlarmOccurrence)

export default amtRouter
