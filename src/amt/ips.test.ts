/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { IPS } from './IPS'
import { IPS_Methods } from './enums/ips_enums'
import { WSManErrors } from './WSMan'
import { Methods } from './cim/methods'

const ipsClass = new IPS()
const castedIPSClass = new IPS() as any

describe('IPS Tests', function () {
  const messageId = '1'
  const adminPassEncryptionType = 2
  const adminPassword = 'ba74395270afd494f8658201162adfd0'
  describe('ips_OptInService Tests', function () {
    it('should create a valid ips_OptInService Get wsman message', function () {
      const response = ipsClass.ips_OptInService(Methods.GET, messageId)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body /></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('should return null if messageId in ips_OptInService is missing', function () {
      expect(() => { ipsClass.ips_OptInService(Methods.GET, null) }).toThrow(WSManErrors.MESSAGE_ID)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedIPSClass.ips_OptInService(Methods.REQUEST_POWER_STATE_CHANGE, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('ips_HostBasedSetupService Tests', function () {
    it('should return a valid ips_HostBasedSetupService Setup wsman message', function () {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/Setup</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:Setup_INPUT xmlns:r="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService"><r:NetAdminPassEncryptionType>${adminPassEncryptionType}</r:NetAdminPassEncryptionType><r:NetworkAdminPassword>${adminPassword}</r:NetworkAdminPassword></r:Setup_INPUT></Body></Envelope>`
      const response = ipsClass.ips_HostBasedSetupService(IPS_Methods.SETUP, messageId, adminPassEncryptionType, adminPassword)
      expect(response).toEqual(correctResponse)
    })
    it('should return null if adminPassEncryptionType in ips_HostBasedSetupService is missing', function () {
      expect(() => { ipsClass.ips_HostBasedSetupService(IPS_Methods.SETUP, messageId, null, adminPassword) }).toThrow(WSManErrors.ADMIN_PASS_ENCRYPTION_TYPE)
    })
    it('should return null if adminPassword in ips_HostBasedSetupService is missing', function () {
      expect(() => { ipsClass.ips_HostBasedSetupService(IPS_Methods.SETUP, messageId, adminPassEncryptionType, null) }).toThrow(WSManErrors.ADMIN_PASSWORD)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedIPSClass.ips_HostBasedSetupService(Methods.REQUEST_POWER_STATE_CHANGE, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
})
