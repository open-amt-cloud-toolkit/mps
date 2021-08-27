/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { WSManMessageCreator } from './wsman'
import { AMT_Methods, AMT_Actions, AMT_Classes } from './enums/amt_enums'
import { CIM_Actions, CIM_Methods } from './enums/cim_enums'

type Methods = AMT_Methods | CIM_Methods // Allows for Method reuse between CIM and AMT
type Actions = AMT_Actions | CIM_Actions // Allows for Action reuse between CIM and AMT

export class AMT {
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator()
  readonly resourceUriBase: string = 'http://intel.com/wbem/wscim/1/amt-schema/1/'

  private get (action: Actions, amtClass: AMT_Classes, messageId: String): String {
    const header: String = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId)
    const body: String = this.wsmanMessageCreator.createBody(CIM_Methods.GET)
    const response: String = this.wsmanMessageCreator.createXml(header, body)
    return response
  }

  amt_AuditLog = (method: Methods, messageId: String, startIndex: number): String => {
    let header: String, body: String
    switch (method) {
      case 'ReadRecords':
        header = this.wsmanMessageCreator.createHeader(AMT_Actions.READ_RECORDS, `${this.resourceUriBase}${AMT_Classes.AMT_AUDIT_LOG}`, messageId)
        body = `<Body><r:ReadRecords_INPUT xmlns:r="${this.resourceUriBase}${AMT_Classes.AMT_AUDIT_LOG}"><r:StartIndex>${startIndex}</r:StartIndex></r:ReadRecords_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      default:
        return null
    }
  }

  amt_RedirectionService = (method: Methods, messageId: String, startIndex: number): String => {
    switch (method) {
      case 'Get':
        return this.get(CIM_Actions.GET, AMT_Classes.AMT_REDIRECTION_SERVICE, messageId)
      default:
        return null
    }
  }

  amt_SetupAndConfigurationService = (method: Methods, messageId: String): String => {
    switch (method) {
      case 'Get':
        return this.get(CIM_Actions.GET, AMT_Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE, messageId)
      default:
        return null
    }
  }
}
