/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Router } from 'express'

import { getVersion } from './get'
const versionRouter: Router = Router()

versionRouter.get('/', getVersion)

export default versionRouter
