/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Router } from 'express'
import deviceRouter from './devices/index'
import { mpsrootcert } from './certs'
import { login } from './auth/login'
import amtRouter from './amt/index'
import { authValidator } from './auth/authValidator'

const router: Router = Router()
router.post('/authorize', authValidator(), login)
router.use('/devices', deviceRouter)
router.get('/ciracert', mpsrootcert)
router.use('/amt', amtRouter)

export default router
