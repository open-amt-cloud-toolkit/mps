/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Routes all the amt endpoint post calls
**********************************************************************/

import { amtController } from '../controllers/amtController'
import { mpsMicroservice } from '../mpsMicroservice'
import { RootContainer } from '../dependencyHandlers/RootContainer'
import { AMTHandlerRegistrar } from '../dependencyHandlers/AMTHandlerRegistrar'
import * as express from 'express'

export class amtRoutes {
  mpsService: mpsMicroservice
  container: RootContainer
  amtController: amtController
  AMTHandlerRegistrar: AMTHandlerRegistrar
  router: any
  constructor (mpsService: mpsMicroservice) {
    this.mpsService = mpsService
    amtController.init(this.mpsService)
    this.router = express.Router()
    this.buildRoutes()
  }

  buildRoutes (): any {
    this.router.post('/', amtController.HandlePostRoute)
  }
}
