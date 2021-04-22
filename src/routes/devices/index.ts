/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Router } from 'express'
import { deviceGetValidator, metadataQueryValidator } from './deviceValidator'
import { disconnect } from './disconnect'
import { getAll } from './getAll'
import { stats } from './stats'
import { get } from './get'

const deviceRouter: Router = Router()

deviceRouter.get('/', metadataQueryValidator(), getAll)
deviceRouter.get('/stats', stats)
deviceRouter.delete('/disconnect/:guid', disconnect)
deviceRouter.get('/:guid', deviceGetValidator(), get)

export default deviceRouter
