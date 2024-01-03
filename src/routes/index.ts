/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Router } from 'express'
import deviceRouter from './devices/index.js'
import { mpsrootcert } from './certs/index.js'
import authRouter from './auth/index.js'
import amtRouter from './amt/index.js'
import healthRouter from './health/index.js'
import version from './version/index.js'

const router: Router = Router()

router.use('/authorize', authRouter)
router.use('/devices', deviceRouter)
router.get('/ciracert', mpsrootcert)
router.use('/amt', amtRouter)
router.use('/health', healthRouter)
router.use('/version', version)

export default router
