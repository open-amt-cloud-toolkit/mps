/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export class WSManMessageCreator {
  xmlCommonPrefix: string = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope">'
  xmlCommonEnd: string = '</Envelope>'
  commonAction: string = 'http://schemas.xmlsoap.org/ws/2004/09/'
  anonymousAddress: string = 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous'
  defaultTimeout: string = 'PT60S'

  createXml = (header: String, body: String): string => {
    if (header == null || body == null) { return null }
    const response = this.xmlCommonPrefix + header + body + this.xmlCommonEnd
    return response
  }

  createHeader = (action: String, resourceUri: String, messageId: String, address?: String, timeout?: String): String => {
    let header: string = '<Header>'
    if (action != null) { header += `<a:Action>${this.commonAction}${action}</a:Action>` } else { return null }
    header += '<a:To>/wsman</a:To>'
    if (resourceUri != null) { header += `<w:ResourceURI>${resourceUri}</w:ResourceURI>` } else { return null }
    if (messageId != null) { header += `<a:MessageID>${messageId}</a:MessageID>` } else { return null }
    header += '<a:ReplyTo>'
    if (address != null) { header += `<a:Address>${address}</a:Address>` } else { header += `<a:Address>${this.anonymousAddress}</a:Address>` }
    header += '</a:ReplyTo>'
    if (timeout != null) { header += `<w:OperationTimeout>${timeout}</w:OperationTimeout>` } else { header += `<w:OperationTimeout>${this.defaultTimeout}</w:OperationTimeout>` }
    header += '</Header>'
    return header
  }

  createBody = (method: String, enumerationContext?: String): String => {
    let body: string
    body = '<Body>'
    switch (method) {
      case 'Pull':
        if (enumerationContext == null) { return null } // TODO: error handling
        body +=
        `<Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull>`
        break
      case 'Enumerate':
        body += '<Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" />'
        break
      case 'Get':
        return '<Body />'
      default:
        return null // TODO: error handling
    }
    body += '</Body>'
    return body
  }
}
