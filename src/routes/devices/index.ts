/*********************************************************************
 * Copyright (c) Intel Corporation 2021
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

const deviceRouter: Router = Router()

deviceRouter.get('/', odataValidator(), metadataQueryValidator(), getAllDevices)
deviceRouter.get('/stats', stats)
deviceRouter.get('/tags', getDistinctTags)
deviceRouter.get('/:guid', param('guid').isUUID(), getDevice)
deviceRouter.post('/', validator(), insertDevice)
deviceRouter.patch('/', validator(), updateDevice)
deviceRouter.delete('/:guid', param('guid').isUUID(), deleteDevice)
deviceRouter.delete('/disconnect/:guid', param('guid').isUUID(), disconnect)

export default deviceRouter
