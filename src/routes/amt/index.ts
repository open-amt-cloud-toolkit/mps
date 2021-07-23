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

const amtRouter: Router = Router()

amtRouter.get('/log/audit/:guid', auditLogValidator(), auditLog)
amtRouter.get('/log/event/:guid', eventLog)
amtRouter.get('/generalSettings/:guid', generalSettings)
amtRouter.get('/hardwareInfo/:guid', hardwareInfo)
amtRouter.post('/power/action/:guid', powerActionValidator(), powerAction)
amtRouter.post('/power/bootOptions/:guid', bootOptionsValidator(), bootOptions)
amtRouter.get('/power/capabilities/:guid', powerCapabilities)
amtRouter.get('/power/state/:guid', powerState)
amtRouter.get('/features/:guid', getAMTFeatures)
amtRouter.post('/features/:guid', amtFeaturesValidator(), setAMTFeatures)
amtRouter.get('/version/:guid', version)

export default amtRouter
