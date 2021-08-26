/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { doesNotMatch } from 'assert'
import e from 'express'
import { WSManMessageCreator } from '../middleware/wsman'

const wsmanMessageCreator = new WSManMessageCreator()

describe('createXml Tests', function () {
  it('creates an enumerate wsman string when provided a header and body', function (done) {
    let header = wsmanMessageCreator.createHeader('enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', '1')
    let body = wsmanMessageCreator.createBody('Enumerate')
    let response = wsmanMessageCreator.createXml(header, body)
    const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body>'
    if (response === correctResponse) {
      done()
    } else {
      done(new Error('Enumeration WSMan string failed'))
    }
  })
  it('creates a pull wsman string when provided a header and body', function (done) {
    let header = wsmanMessageCreator.createHeader('enumeration/Pull', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', '1')
    let body = wsmanMessageCreator.createBody('Pull', 'A4070000-0000-0000-0000-000000000000')
    let response = wsmanMessageCreator.createXml(header, body)
    const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>A4070000-0000-0000-0000-000000000000</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body>'
    if (response === correctResponse) {
      done()
    } else {
      done(new Error('Pull WSMan string failed'))
    }
  })
  it('should return null if header is null/undefined', function (done) {
    let header = null
    let body = wsmanMessageCreator.createBody('Enumerate')
    let response = wsmanMessageCreator.createXml(header, body)
    const correctResponse = null
    if (response === correctResponse) {
      done()
    } else {
      done(new Error('createXml did not return null'))
    }
  })
  it('should return null if body is null/undefined', function (done) {
    let header = wsmanMessageCreator.createHeader('enumeration/Pull', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', '1')
    let body = null
    let response = wsmanMessageCreator.createXml(header, body)
    const correctResponse = null
    if (response === correctResponse) {
      done()
    } else {
      done(new Error('createXml did not return null'))
    }
  })
})
describe('createHeader Tests', function () {
  it('creates a correct header with action, resourceUri, and messageId provided', function (done) {
    const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header>'
    let header = wsmanMessageCreator.createHeader('enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', '1')
    if (header === correctHeader) {
      done()
    } else {
      done(new Error('Header creation failed'))
    }
  })
  it('returns null if missing action', function (done) {
    const correctHeader = null
    let header = wsmanMessageCreator.createHeader(null, 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', '1')
    if (header === correctHeader) {
      done()
    } else {
      done(new Error('createHeader did not return null'))
    }
  })
  it('returns null if missing resourceUri', function (done) {
    const correctHeader = null
    let header = wsmanMessageCreator.createHeader('enumeration/Enumerate', null, '1')
    if (header === correctHeader) {
      done()
    } else {
      done(new Error('createHeader did not return null'))
    }
  })
  it('returns null if missing messageId', function (done) {
    const correctHeader = null
    let header = wsmanMessageCreator.createHeader('enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', null)
    if (header === correctHeader) {
      done()
    } else {
      done(new Error('createHeader did not return null'))
    }
  })
  it('applies custom address correctly', function (done) {
    const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>customAddress</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header>'
    let header = wsmanMessageCreator.createHeader('enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', '1', 'customAddress')
    if (header === correctHeader) {
      done()
    } else {
      done(new Error('createHeader did not input address correctly'))
    }
  })
  it('applies custom timeout correctly', function (done) {
    const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT30S</w:OperationTimeout></Header>'
    let header = wsmanMessageCreator.createHeader('enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', '1', null, 'PT30S')
    if (header === correctHeader) {
      done()
    } else {
      done(new Error('createHeader did not input timeout correctly'))
    }
  })
})
describe('createBody Tests', function () {
  it('creates correct Pull body', function (done) {
    const correctBody = '<Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>A4070000-0000-0000-0000-000000000000</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body>'
    let body = wsmanMessageCreator.createBody('Pull', 'A4070000-0000-0000-0000-000000000000')
    if (body === correctBody){
      done()
    } else {
      done(new Error('createBody did not create Pull body correctly'))
    }
  })
  it('creates correct Enumerate body', function (done) {
    const correctBody = '<Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body>'
    let body = wsmanMessageCreator.createBody('Enumerate')
    if (body === correctBody){
      done()
    } else {
      done(new Error('createBody did not create Enumerate body correctly'))
    }
  })
  it('should return null if Pull is missing enumerationContext', function (done) {
    const correctBody = null
    let body = wsmanMessageCreator.createBody('Pull')
    if (body === correctBody){
      done()
    } else {
      done(new Error('createBody did not return null'))
    }
  })
  it('should return null if method is not handled', function (done) {
    const correctBody = null
    let body = wsmanMessageCreator.createBody('test')
    if (body === correctBody){
      done()
    } else {
      done(new Error('createBody did not return null'))
    }
  })
})