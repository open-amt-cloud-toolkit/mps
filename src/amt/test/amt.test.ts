/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { AMT } from "../amt"
import { AMT_Methods } from '../enums/amt_enums'
import { CIM_Methods } from '../enums/cim_enums'

describe('AMT Tests', function () {
  const amtClass = new AMT()
  const messageId = '1'
  describe('amt_AuditLog Tests', function () {
    it('should return a valid amt_AuditLog ReadRecords wsman message', function () {
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:ReadRecords_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog"><r:StartIndex>1</r:StartIndex></r:ReadRecords_INPUT></Body></Envelope>'
      const response = amtClass.amt_AuditLog(AMT_Methods.READ_RECORDS, messageId, 1)
      expect(response).toEqual(correctResponse)
    })
    it('should return null for unsupported in amt_AuditLog methods', function () {
      const response = amtClass.amt_AuditLog(CIM_Methods.GET, messageId, 1)
      expect(response).toBeNull()
    })
  })
  describe('amt_RedirectionService Tests', function () {
    it('should return a valid amt_RedirectionService Get wsman message', function () {
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body /></Envelope>'
      const response = amtClass.amt_RedirectionService(CIM_Methods.GET, messageId, 1)
      expect(response).toEqual(correctResponse)
    })
    it('should return null for unsupported in amt_RedirectionService methods', function () {
      const response = amtClass.amt_RedirectionService(AMT_Methods.READ_RECORDS, messageId, 1)
      expect(response).toBeNull()
    })
  })
  describe('amt_SetupAndConfigurationService Tests', function () {
    it('should return a valid amt_SetupAndConfigurationService Get wsman message', function () {
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body /></Envelope>'
      const response = amtClass.amt_SetupAndConfigurationService(CIM_Methods.GET, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should return null for unsupported in amt_SetupAndConfigurationService methods', function () {
      const response = amtClass.amt_SetupAndConfigurationService(AMT_Methods.READ_RECORDS, messageId)
      expect(response).toBeNull()
    })
  })
})
