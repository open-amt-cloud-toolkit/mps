/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { IPS, IPS_Methods } from '../amt/ips'

const ipsClass = new IPS()

describe('IPS Tests', function () {
  describe('IPS_OptInService Tests', function () {
    it('should create a valid Get wsman message', function () {
      let response = ipsClass.ips_OptInService(IPS_Methods.GET, '1')
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body /></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('should return null if messageId is missing', function () {
      let response = ipsClass.ips_OptInService(IPS_Methods.GET, null)
      expect(response).toBeNull
    })
    it('should return null if method is unsupported', function () {
      let response = ipsClass.ips_OptInService(IPS_Methods.ENUMERATE, '1')
      expect(response).toBeNull
    })
  })
})
  