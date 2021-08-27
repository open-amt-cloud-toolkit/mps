/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { WSManMessageCreator } from './wsman'
import { CIM_Actions, CIM_Methods } from './enums/cim_enums'
import { IPS_Classes } from './enums/ips_enums'

type Actions = CIM_Actions
type Methods = CIM_Methods

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
}
