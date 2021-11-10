/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Selector, WSManErrors, WSManMessageCreator } from '../wsman'

const wsmanMessageCreator = new WSManMessageCreator()
describe('WSManMessageCreator Tests', function () {
  const messageId = '1'
  const selector: Selector = { name: 'InstanceID', value: 'Intel(r) AMT Device 0' }
  describe('createXml Tests', function () {
    it('creates an enumerate wsman string when provided a header and body to createXml', function () {
      const header = wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId)
      const body = wsmanMessageCreator.createBody('Enumerate')
      const response = wsmanMessageCreator.createXml(header, body)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('creates a pull wsman string when provided a header and body to createXml', function () {
      const header = wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId)
      const body = wsmanMessageCreator.createBody('Pull', 'A4070000-0000-0000-0000-000000000000')
      const response = wsmanMessageCreator.createXml(header, body)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>A4070000-0000-0000-0000-000000000000</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if header is null/undefined in createXml', function () {
      const header = null
      const body = wsmanMessageCreator.createBody('Enumerate')
      expect(() => { wsmanMessageCreator.createXml(header, body) }).toThrow(WSManErrors.HEADER)
    })
    it('should throw error if body is null/undefined in createXml', function () {
      const header = wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId)
      const body = null
      expect(() => { wsmanMessageCreator.createXml(header, body) }).toThrow(WSManErrors.BODY)
    })
  })
  describe('createHeader Tests', function () {
    it('creates a correct header with action, resourceUri, and messageId provided for createHeader', function () {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header>'
      const header = wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId)
      expect(header).toEqual(correctHeader)
    })
    it('should throw error if missing action in createHeader', function () {
      expect(() => { wsmanMessageCreator.createHeader(null, 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId) }).toThrow(WSManErrors.ACTION)
    })
    it('should throw error if missing resourceUri in createHeader', function () {
      expect(() => { wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate', null, messageId) }).toThrow(WSManErrors.RESOURCE_URI)
    })
    it('should throw error if missing messageId in createHeader', function () {
      expect(() => { wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', null) }).toThrow(WSManErrors.MESSAGE_ID)
    })
    it('applies custom address correctly in createHeader', function () {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>customAddress</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header>'
      const header = wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId, 'customAddress')
      expect(header).toEqual(correctHeader)
    })
    it('applies custom timeout correctly in createHeader', function () {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT30S</w:OperationTimeout></Header>'
      const header = wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId, null, 'PT30S')
      expect(header).toEqual(correctHeader)
    })
    it('applies custom selector correctly in createHeader', function () {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT30S</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Device 0</w:Selector></w:SelectorSet></Header>'
      const header = wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId, null, 'PT30S', selector)
      expect(header).toEqual(correctHeader)
    })
  })
  describe('createBody Tests', function () {
    it('creates correct Pull body for createBody', function () {
      const correctBody = '<Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>A4070000-0000-0000-0000-000000000000</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body>'
      const body = wsmanMessageCreator.createBody('Pull', 'A4070000-0000-0000-0000-000000000000')
      expect(body).toEqual(correctBody)
    })
    it('creates correct Enumerate body for createBody', function () {
      const correctBody = '<Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body>'
      const body = wsmanMessageCreator.createBody('Enumerate')
      expect(body).toEqual(correctBody)
    })
    it('creates correct Get body for createBody', function () {
      const correctBody = '<Body />'
      const body = wsmanMessageCreator.createBody('Get')
      expect(body).toEqual(correctBody)
    })
    it('creates correct Delete body for createBody', function () {
      const correctBody = '<Body />'
      const body = wsmanMessageCreator.createBody('Delete')
      expect(body).toEqual(correctBody)
    })
    it('should throw error if Pull is missing enumerationContext in createBody', function () {
      expect(() => { wsmanMessageCreator.createBody('Pull') }).toThrow(WSManErrors.ENUMERATION_CONTEXT)
    })
    it('should throw error if RequestStateChange is missing input in createBody', function () {
      expect(() => { wsmanMessageCreator.createBody('RequestStateChange', null, null, 8) }).toThrow(WSManErrors.INPUT)
    })
    it('should throw error if RequestStateChange is missing requestedState in createBody', function () {
      expect(() => { wsmanMessageCreator.createBody('RequestStateChange', null, 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService', null) }).toThrow(WSManErrors.REQUESTED_STATE)
    })
    it('should throw error if method is not handled in createBody', function () {
      expect(() => { wsmanMessageCreator.createBody('test') }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
})
