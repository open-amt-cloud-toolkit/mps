/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import '../models/ips_models'
import { WSManMessageCreator } from './wsman'

export enum IPS_Methods {
  GET = 'Get',
  PULL = 'Pull',
  ENUMERATE = 'Enumerate',
  RELEASE = 'Release'
}

export enum IPS_Actions {
  ENUMERATE = 'enumeration/Enumerate',
  PULL = 'enumeration/Pull',
  GET = 'transfer/Get'
}

export class IPS {
  wsmanMessageCreator: WSManMessageCreator
  resourceUriBase: string
  constructor () {
    this.wsmanMessageCreator = new WSManMessageCreator()
    this.resourceUriBase = 'http://intel.com/wbem/wscim/1/ips-schema/1/'
  }

  ips_OptInService = (method: IPS_Methods, messageId: String): String => {
    let header: String, body: String, response: String
    switch (method) {
      case 'Get':
        header = this.wsmanMessageCreator.createHeader(IPS_Actions.GET, this.resourceUriBase + 'IPS_OptInService', messageId)
        body = this.wsmanMessageCreator.createBody(IPS_Methods.GET)
        response = this.wsmanMessageCreator.createXml(header, body)
        break
      default:
        response = null
    }
    return response
  }
}
