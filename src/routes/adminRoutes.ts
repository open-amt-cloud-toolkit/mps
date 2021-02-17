/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
* Description: Routes all the admin endpoint post calls
**********************************************************************/
import { AdminController } from '../controllers/adminController'
import { mpsMicroservice } from '../mpsMicroservice'
import * as express from 'express'

export class adminRoutes {
  mpsService: mpsMicroservice
  adminController: AdminController
  router: any

  constructor (mpsService: mpsMicroservice) {
    this.mpsService = mpsService
    AdminController.init(this.mpsService)
    this.router = express.Router()
    this.buildRoutes()
  }

  buildRoutes (): any {
    this.router.post('/', AdminController.HandlePostRoute)
  }
}
