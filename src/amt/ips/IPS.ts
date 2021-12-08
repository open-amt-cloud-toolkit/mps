/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { WSManErrors, WSManMessageCreator } from '../WSMan'
import { Actions } from './actions'
import { Methods } from './methods'
import { Classes } from './classes'

type AllActions = Actions | Actions

export class IPS {
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator()
  readonly resourceUriBase: string = 'http://intel.com/wbem/wscim/1/ips-schema/1/'
  private readonly get = (action: AllActions, ipsClass: Classes, messageId: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${ipsClass}`, messageId)
    const body: string = this.wsmanMessageCreator.createBody(Methods.GET)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  OptInService = (method: Methods.GET| Methods.START_OPT_IN | Methods.CANCEL_OPT_IN |Methods.SEND_OPT_IN_CODE, messageId: string, code?: Number): string => {
    let header: string, body: string
    switch (method) {
      case Methods.GET:
        return this.get(Actions.GET, Classes.IPS_OPT_IN_SERVICE, messageId)
      case Methods.START_OPT_IN: {
        header = this.wsmanMessageCreator.createHeader(Actions.START_OPT_IN, `${this.resourceUriBase}${Classes.IPS_OPT_IN_SERVICE}`, messageId)
        body = `<Body><r:StartOptIn_INPUT xmlns:r="${this.resourceUriBase}${Classes.IPS_OPT_IN_SERVICE}" /></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.SEND_OPT_IN_CODE: {
        header = this.wsmanMessageCreator.createHeader(Actions.SEND_OPT_IN_CODE, `${this.resourceUriBase}${Classes.IPS_OPT_IN_SERVICE}`, messageId)
        body = `<Body><r:SendOptInCode_INPUT xmlns:r="${this.resourceUriBase}${Classes.IPS_OPT_IN_SERVICE}"><r:OptInCode>${code}</r:OptInCode></r:SendOptInCode_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.CANCEL_OPT_IN: {
        header = this.wsmanMessageCreator.createHeader(Actions.CANCEL_OPT_IN, `${this.resourceUriBase}${Classes.IPS_OPT_IN_SERVICE}`, messageId)
        body = `<Body><r:CancelOptIn_INPUT xmlns:r="${this.resourceUriBase}${Classes.IPS_OPT_IN_SERVICE}" /></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  HostBasedSetupService = (method: Methods.SETUP, messageId: string, adminPassEncryptionType?: Number, adminPassword?: string): string => {
    switch (method) {
      case Methods.SETUP: {
        if (adminPassEncryptionType == null) { throw new Error(WSManErrors.ADMIN_PASS_ENCRYPTION_TYPE) }
        if (adminPassword == null) { throw new Error(WSManErrors.ADMIN_PASSWORD) }
        const header: string = this.wsmanMessageCreator.createHeader(Actions.SETUP, `${this.resourceUriBase}${Classes.IPS_HOST_BASED_SETUP_SERVICE}`, messageId)
        const body: string = `<Body><r:Setup_INPUT xmlns:r="${this.resourceUriBase}${Classes.IPS_HOST_BASED_SETUP_SERVICE}"><r:NetAdminPassEncryptionType>${adminPassEncryptionType.toString()}</r:NetAdminPassEncryptionType><r:NetworkAdminPassword>${adminPassword}</r:NetworkAdminPassword></r:Setup_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }
}
