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
import { powerCapabilities } from './powerCapabilities'
import { powerState } from './powerState'
import { version } from './version'
import { getAMTFeatures } from './getAMTFeatures'
import { setAMTFeatures } from './setAMTFeatures'

const amtRouter: Router = Router()

amtRouter.get('/auditLog', auditLog)
amtRouter.get('/eventlog', eventLog)
amtRouter.get('/generalSettings', generalSettings)
amtRouter.get('/getAMTFeatures', getAMTFeatures) //todo: combine with set?
amtRouter.get('/hardwareInfo', hardwareInfo)
amtRouter.get('/powerAction', powerAction)
amtRouter.get('/powerCapabilities', powerCapabilities)
amtRouter.get('/powerState', powerState)
amtRouter.post('/setAMTFeatures', setAMTFeatures)
amtRouter.get('/version', version)
