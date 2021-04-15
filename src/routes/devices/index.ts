/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Router } from 'express'
import { metadataQueryValidator } from './deviceValidator'
import { disconnect } from './disconnect'
import { getAll } from './getAll'
import { stats } from './stats'

const deviceRouter: Router = Router()

deviceRouter.get('/', metadataQueryValidator(), getAll)
deviceRouter.get('/stats', stats)
// deviceRouter.get('/:id', get) TODO: Add single device route
deviceRouter.delete('/disconnect/:guid', disconnect)

export default deviceRouter
