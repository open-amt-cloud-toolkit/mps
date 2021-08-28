/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { WSManMessageCreator } from './wsman'
import { CIM_Actions, CIM_Methods } from './enums/cim_enums'
import { IPS_Actions, IPS_Classes, IPS_Methods } from './enums/ips_enums'

type Actions = CIM_Actions | IPS_Actions
type Methods = CIM_Methods | IPS_Methods

export class IPS {
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator()
  readonly resourceUriBase: string = 'http://intel.com/wbem/wscim/1/ips-schema/1/'
  private get (action: Actions, ipsClass: IPS_Classes, messageId: String): String {
    const header: String = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${ipsClass}`, messageId)
    const body: String = this.wsmanMessageCreator.createBody(CIM_Methods.GET)
    const response: String = this.wsmanMessageCreator.createXml(header, body)
    return response
  }

  ips_OptInService = (method: Methods, messageId: String): String => {
    switch (method) {
      case 'Get':
        return this.get(CIM_Actions.GET, IPS_Classes.IPS_OPT_IN_SERVICE, messageId)
      default:
        return null
    }
  }

  ips_HostBasedSetupService = (method: Methods, messageId: String, adminPassEncryptionType?: Number, adminPassword?: String): String => {
    switch (method) {
      case 'Setup':
        if (adminPassEncryptionType != null && adminPassword != null) {
          const header: String = this.wsmanMessageCreator.createHeader(IPS_Actions.SETUP, `${this.resourceUriBase}${IPS_Classes.IPS_HOST_BASED_SETUP_SERVICE}`, messageId)
          const body: String = `<Body><r:Setup_INPUT xmlns:r="${this.resourceUriBase}${IPS_Classes.IPS_HOST_BASED_SETUP_SERVICE}"><r:NetAdminPassEncryptionType>${adminPassEncryptionType}</r:NetAdminPassEncryptionType><r:NetworkAdminPassword>${adminPassword}</r:NetworkAdminPassword></r:Setup_INPUT></Body>`
          return this.wsmanMessageCreator.createXml(header, body)
        } else {
          return null
        }
      default:
        return null
    }
  }
}
