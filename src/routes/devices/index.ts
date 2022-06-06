/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Router } from 'express'
import { metadataQueryValidator, odataValidator, validator } from './deviceValidator'
import { disconnect } from './disconnect'
import { getAllDevices } from './getAll'
import { stats } from './stats'
import { getDevice } from './get'
import { getDistinctTags } from './tags'
import { insertDevice } from './create'
import { updateDevice } from './update'
import { deleteDevice } from './delete'
import { param } from 'express-validator'
import validateMiddleware from '../../middleware/validate'
import ciraMiddleware from '../../middleware/cira'

const deviceRouter: Router = Router()

deviceRouter.get('/', odataValidator(), metadataQueryValidator(), validateMiddleware, getAllDevices)
deviceRouter.get('/stats', stats)
deviceRouter.get('/tags', getDistinctTags)
deviceRouter.get('/:guid', param('guid').isUUID(), validateMiddleware, getDevice)
deviceRouter.post('/', validator(), validateMiddleware, insertDevice)
deviceRouter.patch('/', validator(), validateMiddleware, updateDevice)
deviceRouter.delete('/:guid', param('guid').isUUID(), validateMiddleware, deleteDevice)
deviceRouter.delete('/disconnect/:guid', param('guid').isUUID(), validateMiddleware, ciraMiddleware, disconnect)
export default deviceRouter
