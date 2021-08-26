/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { WSManMessageCreator } from '../amt/wsman'

const wsmanMessageCreator = new WSManMessageCreator()
describe('WSManMessageCreator Tests', function () {
  describe('createXml Tests', function () {
    it('creates an enumerate wsman string when provided a header and body', function () {
      let header = wsmanMessageCreator.createHeader('enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', '1')
      let body = wsmanMessageCreator.createBody('Enumerate')
      let response = wsmanMessageCreator.createXml(header, body)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('creates a pull wsman string when provided a header and body', function () {
      let header = wsmanMessageCreator.createHeader('enumeration/Pull', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', '1')
      let body = wsmanMessageCreator.createBody('Pull', 'A4070000-0000-0000-0000-000000000000')
      let response = wsmanMessageCreator.createXml(header, body)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>A4070000-0000-0000-0000-000000000000</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('should return null if header is null/undefined', function () {
      let header = null
      let body = wsmanMessageCreator.createBody('Enumerate')
      let response = wsmanMessageCreator.createXml(header, body)
      expect(response).toBeNull
    })
    it('should return null if body is null/undefined', function () {
      let header = wsmanMessageCreator.createHeader('enumeration/Pull', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', '1')
      let body = null
      let response = wsmanMessageCreator.createXml(header, body)
      expect(response).toBeNull
    })
  })
  describe('createHeader Tests', function () {
    it('creates a correct header with action, resourceUri, and messageId provided', function () {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header>'
      let header = wsmanMessageCreator.createHeader('enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', '1')
      expect(header).toEqual(correctHeader)
    })
    it('returns null if missing action', function () {
      let header = wsmanMessageCreator.createHeader(null, 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', '1')
      expect(header).toBeNull
    })
    it('returns null if missing resourceUri', function () {
      let header = wsmanMessageCreator.createHeader('enumeration/Enumerate', null, '1')
      expect(header).toBeNull
    })
    it('returns null if missing messageId', function () {
      let header = wsmanMessageCreator.createHeader('enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', null)
      expect(header).toBeNull
    })
    it('applies custom address correctly', function () {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>customAddress</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header>'
      let header = wsmanMessageCreator.createHeader('enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', '1', 'customAddress')
      expect(header).toEqual(correctHeader)
    })
    it('applies custom timeout correctly', function () {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT30S</w:OperationTimeout></Header>'
      let header = wsmanMessageCreator.createHeader('enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', '1', null, 'PT30S')
      expect(header).toEqual(correctHeader)
    })
  })
  describe('createBody Tests', function () {
    it('creates correct Pull body', function () {
      const correctBody = '<Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>A4070000-0000-0000-0000-000000000000</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body>'
      let body = wsmanMessageCreator.createBody('Pull', 'A4070000-0000-0000-0000-000000000000')
      expect(body).toEqual(correctBody)
    })
    it('creates correct Enumerate body', function () {
      const correctBody = '<Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body>'
      let body = wsmanMessageCreator.createBody('Enumerate')
      expect(body).toEqual(correctBody)
    })
    it('should return null if Pull is missing enumerationContext', function () {
      let body = wsmanMessageCreator.createBody('Pull')
      expect(body).toBeNull
    })
    it('should return null if method is not handled', function () {
      let body = wsmanMessageCreator.createBody('test')
      expect(body).toBeNull
    })
  })
})
