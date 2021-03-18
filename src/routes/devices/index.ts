/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Router } from 'express'
import { metadataQueryValidator } from './deviceValidator'

import { getAll } from './getAll'

const deviceRouter: Router = Router()

deviceRouter.get('/', metadataQueryValidator(), getAll)
// deviceRouter.get('/:id', get)

export default deviceRouter
