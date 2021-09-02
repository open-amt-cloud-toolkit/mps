/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export interface Selector {
  name: string
  value: string
}

export enum WSManErrors {
  HEADER = 'missing header',
  BODY = 'missing body',
  ACTION = 'missing action',
  MESSAGE_ID = 'missing messageId',
  RESOURCE_URI = 'missing resourceUri',
  ENUMERATION_CONTEXT = 'missing enumerationContext',
  UNSUPPORTED_METHOD = 'unsupported method',
  INPUT = 'missing input',
  REQUESTED_STATE = 'missing requestedState',
  SELECTOR = 'missing selector',
  ROLE = 'missing role',
  REQUESTED_POWER_STATE_CHANGE = 'missing powerState',
  ADMIN_PASS_ENCRYPTION_TYPE = 'missing adminPassEncryptionType',
  ADMIN_PASSWORD = 'missing adminPassword',
  ETHERNET_PORT_OBJECT = 'missing ethernetPortObject',
  ENVIRONMENT_DETECTION_SETTING_DATA = 'missing environmentDetectionSettingData',
  CERTIFICATE_BLOB = 'missing certificateBlob',
  MP_SERVER = 'missing mpServer',
  REMOTE_ACCESS_POLICY_RULE = 'missing remoteAccessPolicyRule',
  BOOT_SETTING_DATA = 'missing bootSettingData'
}

export class WSManMessageCreator {
  xmlCommonPrefix: string = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope">'
  xmlCommonEnd: string = '</Envelope>'
  anonymousAddress: string = 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous'
  defaultTimeout: string = 'PT60S'

  createXml = (header: string, body: string): string => {
    if (header == null) throw new Error(WSManErrors.HEADER)
    if (body == null) throw new Error(WSManErrors.BODY)
    return this.xmlCommonPrefix + header + body + this.xmlCommonEnd
  }

  createHeader = (action: string, resourceUri: string, messageId: string, address?: string, timeout?: string, selector?: Selector): string => {
    let header: string = '<Header>'
    if (action == null) { throw new Error(WSManErrors.ACTION) }
    if (resourceUri == null) { throw new Error(WSManErrors.RESOURCE_URI) }
    if (messageId == null) { throw new Error(WSManErrors.MESSAGE_ID) }
    header += `<a:Action>${action}</a:Action><a:To>/wsman</a:To><w:ResourceURI>${resourceUri}</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo>`
    if (address != null) { header += `<a:Address>${address}</a:Address>` } else { header += `<a:Address>${this.anonymousAddress}</a:Address>` }
    header += '</a:ReplyTo>'
    if (timeout != null) { header += `<w:OperationTimeout>${timeout}</w:OperationTimeout>` } else { header += `<w:OperationTimeout>${this.defaultTimeout}</w:OperationTimeout>` }
    if (selector != null) { header += `<w:SelectorSet><w:Selector Name="${selector.name}">${selector.value}</w:Selector></w:SelectorSet>` }
    header += '</Header>'
    return header
  }

  createBody = (method: string, enumerationContext?: string, input?: string, requestedState?: Number): string => {
    switch (method) {
      case 'Pull':
        if (enumerationContext == null) { throw new Error(WSManErrors.ENUMERATION_CONTEXT) }
        return `<Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body>`
      case 'Enumerate':
        return '<Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body>'
      case 'Get':
      case 'Delete':
        return '<Body />'
      case 'RequestStateChange':
        if (input == null) { throw new Error(WSManErrors.INPUT) }
        if (requestedState == null) { throw new Error(WSManErrors.REQUESTED_STATE) }
        return `<Body><r:RequestStateChange_INPUT xmlns:r="${input}"><r:RequestedState>${requestedState}</r:RequestedState></r:RequestStateChange_INPUT></Body>`
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }
}
