/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { WSManErrors, WSManMessageCreator } from './WSMan'
import { IPS_Actions, IPS_Classes, IPS_Methods } from './enums/ips_enums'
import { Actions } from './cim/actions'
import { Methods } from './cim/methods'

type AllActions = Actions | IPS_Actions

export class IPS {
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator()
  readonly resourceUriBase: string = 'http://intel.com/wbem/wscim/1/ips-schema/1/'
  private readonly get = (action: AllActions, ipsClass: IPS_Classes, messageId: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${ipsClass}`, messageId)
    const body: string = this.wsmanMessageCreator.createBody(Methods.GET)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  ips_OptInService = (method: Methods.GET, messageId: string): string => {
    switch (method) {
      case Methods.GET:
        return this.get(Actions.GET, IPS_Classes.IPS_OPT_IN_SERVICE, messageId)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  ips_HostBasedSetupService = (method: IPS_Methods.SETUP, messageId: string, adminPassEncryptionType?: Number, adminPassword?: string): string => {
    switch (method) {
      case IPS_Methods.SETUP: {
        if (adminPassEncryptionType == null) { throw new Error(WSManErrors.ADMIN_PASS_ENCRYPTION_TYPE) }
        if (adminPassword == null) { throw new Error(WSManErrors.ADMIN_PASSWORD) }
        const header: string = this.wsmanMessageCreator.createHeader(IPS_Actions.SETUP, `${this.resourceUriBase}${IPS_Classes.IPS_HOST_BASED_SETUP_SERVICE}`, messageId)
        const body: string = `<Body><r:Setup_INPUT xmlns:r="${this.resourceUriBase}${IPS_Classes.IPS_HOST_BASED_SETUP_SERVICE}"><r:NetAdminPassEncryptionType>${adminPassEncryptionType.toString()}</r:NetAdminPassEncryptionType><r:NetworkAdminPassword>${adminPassword}</r:NetworkAdminPassword></r:Setup_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }
}
