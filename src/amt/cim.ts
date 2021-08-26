/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import '../models/cim_models'
import { WSManMessageCreator } from './wsman'

export enum CIM_Methods {
  GET = 'Get',
  PULL = 'Pull',
  ENUMERATE = 'Enumerate',
  RELEASE = 'Release'
}

export enum CIM_Actions {
  ENUMERATE = 'enumeration/Enumerate',
  PULL = 'enumeration/Pull',
  GET = 'transfer/Get'
}

export class CIM {
  wsmanMessageCreator: WSManMessageCreator
  resourceUriBase: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/'
  commonCimRUri: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/'
  constructor () {
    this.wsmanMessageCreator = new WSManMessageCreator()
  }

  cim_ServiceAvailableToElement = (method: CIM_Methods, messageId: String, enumerationContext?: String): String => {
    let response: String, header: String, body: String
    switch (method) {
      case 'Get':
        header = this.wsmanMessageCreator.createHeader(CIM_Actions.GET, this.resourceUriBase + 'CIM_ServiceAvailableToElement', messageId)
        body = '' // TODO: implement Get method
        response = this.wsmanMessageCreator.createXml(header, body)
        break
      case 'Pull':
        header = this.wsmanMessageCreator.createHeader(CIM_Actions.PULL, this.resourceUriBase + 'CIM_ServiceAvailableToElement', messageId)
        if (enumerationContext != null) { body = this.wsmanMessageCreator.createBody(CIM_Methods.PULL, enumerationContext) } else { body = null }
        response = this.wsmanMessageCreator.createXml(header, body)
        break
      case 'Enumerate':
        header = this.wsmanMessageCreator.createHeader(CIM_Actions.ENUMERATE, this.resourceUriBase + 'CIM_ServiceAvailableToElement', messageId)
        body = this.wsmanMessageCreator.createBody(CIM_Methods.ENUMERATE)
        response = this.wsmanMessageCreator.createXml(header, body)
        break
      case 'Release':
        header = null // TODO: implement header
        body = null // TODO: implement body
        response = null // TODO: implement response
        break
      default:
        response = null // TODO: Error Handling
    }
    return response
  }
}
