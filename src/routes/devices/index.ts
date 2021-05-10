/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Router } from 'express'
import { metadataQueryValidator, validator } from './deviceValidator'
import { disconnect } from './disconnect'
import { getAll } from './getAll'
import { stats } from './stats'
import { get } from './get'
import { tags } from './tags'
import { insertDevice } from './create'
import { updateDevice } from './update'
import { deleteDevice } from './delete'
import { param } from 'express-validator'

const deviceRouter: Router = Router()

deviceRouter.get('/', metadataQueryValidator(), getAll)
deviceRouter.get('/stats', stats)
deviceRouter.get('/tags', tags)
deviceRouter.get('/:guid', param('guid').isUUID(), get)
deviceRouter.post('/', validator(), insertDevice)
deviceRouter.patch('/', validator(), updateDevice)
deviceRouter.delete('/:guid', param('guid').isUUID(), deleteDevice)
deviceRouter.delete('/disconnect/:guid', param('guid').isUUID(), disconnect)

export default deviceRouter
