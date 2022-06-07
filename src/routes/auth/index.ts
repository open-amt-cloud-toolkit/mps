/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Router } from 'express'
import { param } from 'express-validator'
import validateMiddleware from '../../middleware/validate'
import { login } from './login'
import { authValidator } from './authValidator'
import { authorizeDevice } from './authorizeDevice'

const authRouter: Router = Router()

authRouter.post('/', authValidator(), login)
authRouter.get('/redirection/:guid', param('guid').isUUID(), validateMiddleware, authorizeDevice)

export default authRouter
