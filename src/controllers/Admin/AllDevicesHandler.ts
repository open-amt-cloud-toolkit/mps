/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Response, Request } from 'express'
import { logger as log } from '../../utils/logger'
import { IAdminHandler } from '../../models/IAdminHandler'
import { ErrorResponse } from '../../utils/amtHelper'
import { mpsMicroservice } from '../../mpsMicroservice'

const common = require('../../utils/common.js')

export class AllDevicesHandler implements IAdminHandler {
  mpsService: mpsMicroservice
  name: string

  constructor (mpsService: mpsMicroservice) {
    this.name = 'AllDevices'
    this.mpsService = mpsService
  }

  // Get existing device list from credentials file.
  // For the server version of Mesh Commander, we send the computer list without credential and insertion credentials in the stream.
  async adminAction (req: Request, res: Response) {
    try {
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0'
      })
      let amtcreds = {}
      try {
        amtcreds = await this.mpsService.db.getAllAmtCredentials()
      } catch (e) {
        log.error(e)
      }
      const list = []
      for (var i in this.mpsService.mpsComputerList) {
        var entry = common.Clone(this.mpsService.mpsComputerList[i])
        // add MPS and AMT username properies to json
        entry.mpsuser = amtcreds[i].mpsuser
        entry.amtuser = amtcreds[i].amtuser ? amtcreds[i].amtuser : this.mpsService.mpsComputerList[i].amtuser
        // add icon and conn properties to json
        entry.icon = 1
        entry.conn = 1
        // add a name property to json
        if (!entry.name) { entry.name = amtcreds[i].name }
        list.push(entry)
        // remove device objects from credential json whose status is online
        if (amtcreds[i]) {
          delete amtcreds[i]
        }
      }
      for (var i in amtcreds) {
        var entry = common.Clone(amtcreds[i])
        // delete MPS and AMT password before sending it
        delete entry.mpspass
        delete entry.amtpass
        // add host to the entry
        entry.host = i
        // add icon and conn
        entry.icon = 1
        entry.conn = 0
        list.push(entry)
      }
      res.set({ 'Content-Type': 'application/json' })
      return res.send(JSON.stringify(list))
    } catch (error) {
      log.error(`Exception in All devices : ${error}`)
      return res.status(500).send(ErrorResponse(500, 'Request failed while it gets all devices.'))
    }
  }
}
