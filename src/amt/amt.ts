/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Selector, WSManMessageCreator } from './wsman'
import { AMT_Methods, AMT_Actions, AMT_Classes } from './enums/amt_enums'
import { CIM_Actions, CIM_Methods } from './enums/cim_enums'
import { AMT_EthernetPortSettings } from './models/amt_models'

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

  private enumerate (action: Actions, amtClass: AMT_Classes, messageId: String): String {
    const header: String = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId)
    const body: String = this.wsmanMessageCreator.createBody(CIM_Methods.ENUMERATE)
    const response: String = this.wsmanMessageCreator.createXml(header, body)
    return response
  }

  private pull (action: Actions, amtClass: AMT_Classes, messageId: String, enumerationContext: String): String {
    const header: String = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId)
    const body: String = this.wsmanMessageCreator.createBody(CIM_Methods.PULL, enumerationContext)
    const response: String = this.wsmanMessageCreator.createXml(header, body)
    return response
  }

  private delete (action: Actions, amtClass: AMT_Classes, messageId: String, selector: Selector): String {
    const header: String = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId, null, null, selector)
    const body: String = this.wsmanMessageCreator.createBody(CIM_Methods.DELETE)
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

  amt_GeneralSettings = (method: Methods, messageId: String): String => {
    switch (method) {
      case 'Get':
        return this.get(CIM_Actions.GET, AMT_Classes.AMT_GENERAL_SETTINGS, messageId)
      default:
        return null
    }
  }

  amt_EthernetPortSettings = (method: Methods, messageId: String, enumerationContext?: String, ethernetPortObject?: AMT_EthernetPortSettings): String => {
    switch (method) {
      case 'Enumerate':
        return this.enumerate(CIM_Actions.ENUMERATE, AMT_Classes.AMT_ETHERNET_PORT_SETTINGS, messageId)
      case 'Pull':
        if (enumerationContext != null) {
          return this.pull(CIM_Actions.PULL, AMT_Classes.AMT_ETHERNET_PORT_SETTINGS, messageId, enumerationContext)
        } else {
          return null
        }
      case 'Put':
        if (ethernetPortObject != null) {
          const selector: Selector = { name: 'InstanceID', value: ethernetPortObject.instanceId }
          const header = this.wsmanMessageCreator.createHeader(CIM_Actions.PUT, `${this.resourceUriBase}${AMT_Classes.AMT_ETHERNET_PORT_SETTINGS}`, messageId, null, null, selector)
          let body = `<Body><r:AMT_EthernetPortSettings xmlns:r="${this.resourceUriBase}${AMT_Classes.AMT_ETHERNET_PORT_SETTINGS}"><r:DHCPEnabled>${String(ethernetPortObject.dhcpEnabled)}</r:DHCPEnabled><r:ElementName>${ethernetPortObject.elementName}</r:ElementName><r:InstanceID>${ethernetPortObject.instanceId}</r:InstanceID><r:IpSyncEnabled>${String(ethernetPortObject.ipSyncEnabled)}</r:IpSyncEnabled><r:LinkIsUp>${String(ethernetPortObject.linkIsUp)}</r:LinkIsUp>`
          ethernetPortObject.linkPolicy.forEach(function (item) {
            body += `<r:LinkPolicy>${item}</r:LinkPolicy>`
          })
          body += `<r:MACAddress>${ethernetPortObject.macAddress}</r:MACAddress><r:PhysicalConnectionType>${ethernetPortObject.physicalConnectionType}</r:PhysicalConnectionType><r:SharedDynamicIP>${String(ethernetPortObject.sharedDynamicIp)}</r:SharedDynamicIP><r:SharedMAC>${String(ethernetPortObject.sharedMAC)}</r:SharedMAC><r:SharedStaticIp>${String(ethernetPortObject.sharedStaticIp)}</r:SharedStaticIp></r:AMT_EthernetPortSettings></Body>`
          return this.wsmanMessageCreator.createXml(header, body)
        } else {
          return null
        }
      default:
        return null
    }
  }

  amt_RemoteAccessPolicyRule = (method: Methods, messageId: String, selector?: Selector): String => {
    switch (method) {
      case 'Delete':
        return this.delete(CIM_Actions.DELETE, AMT_Classes.AMT_REMOTE_ACCESS_POLICY_RULE, messageId, selector)
      default:
        return null
    }
  }

  amt_ManagementPresenceRemoteSAP = (method: Methods, messageId: String, enumerationContext?: String): String => {
    switch (method) {
      case 'Enumerate':
        return this.enumerate(CIM_Actions.ENUMERATE, AMT_Classes.AMT_MANAGEMENT_PRESENCE_REMOTE_SAP, messageId)
      case 'Pull':
        if (enumerationContext != null) {
          return this.pull(CIM_Actions.PULL, AMT_Classes.AMT_MANAGEMENT_PRESENCE_REMOTE_SAP, messageId, enumerationContext)
        } else {
          return null
        }
      default:
        return null
    }
  }

  amt_PublicKeyCertificate = (method: Methods, messageId: String, enumerationContext?: String): String => {
    switch (method) {
      case 'Enumerate':
        return this.enumerate(CIM_Actions.ENUMERATE, AMT_Classes.AMT_PUBLIC_KEY_CERTIFICATE, messageId)
      case 'Pull':
        if (enumerationContext != null) {
          return this.pull(CIM_Actions.PULL, AMT_Classes.AMT_PUBLIC_KEY_CERTIFICATE, messageId, enumerationContext)
        } else {
          return null
        }
      default:
        return null
    }
  }
}
