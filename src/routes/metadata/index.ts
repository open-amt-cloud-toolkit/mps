/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Router } from 'express'
import { insertDevice } from './create'
import { deleteDevice } from './delete'
import { get } from './get'
import { tags } from './tags'
import { getAll } from './getAll'
import { updateDevice } from './update'
import { metadataInsertValidator, metadataUpdateValidator } from './metadataValidator'

const metadataRouter: Router = Router()

metadataRouter.get('/', getAll)
metadataRouter.get('/tags', tags)
metadataRouter.get('/:id', get)
metadataRouter.post('/', metadataInsertValidator(), insertDevice)
metadataRouter.patch('/', metadataUpdateValidator(), updateDevice)
metadataRouter.delete('/:id', deleteDevice)

export default metadataRouter
