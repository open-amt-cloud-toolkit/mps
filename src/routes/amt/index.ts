/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Router } from 'express'
import { auditLog } from './auditLog'
import { eventLog } from './eventLog'
import { generalSettings } from './generalSettings'
import { hardwareInfo } from './hardwareInfo'
import { powerAction } from './powerAction'
import { bootOptions } from './bootOptions'
import { powerCapabilities } from './powerCapabilities'
import { powerState } from './powerState'
import { version } from './version'
import { getAMTFeatures } from './getAMTFeatures'
import { setAMTFeatures } from './setAMTFeatures'
import { amtFeaturesValidator } from './amtFeatureValidator'
import { powerActionValidator } from './powerActionValidator'
import { auditLogValidator } from './auditLogValidator'
import { bootOptionsValidator } from './bootOptionsValidator'
import ciraMiddleware from '../../middleware/cira'
import validateMiddleware from '../../middleware/validate'

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

export default amtRouter
