/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { AMT } from "../amt"
import { AMT_Methods } from '../enums/amt_enums'
import { CIM_Methods } from '../enums/cim_enums'
import { AMT_EthernetPortSettings } from '../models/amt_models'
import { Selector } from '../wsman'

describe('AMT Tests', function () {
  const amtClass = new AMT()
  const messageId = '1'
  const enumerationContext = 'AC070000-0000-0000-0000-000000000000'
  const operationTimeout = 'PT60S'
  const ethernetPortObject: AMT_EthernetPortSettings = {
    instanceId: 'Intel(r) AMT Ethernet Port Settings 0',
    elementName: 'Intel(r) AMT Ethernet Port Settings',
    sharedMAC: true,
    macAddress: 'a4-ae-11-1c-02-4d',
    linkIsUp: true,
    linkPolicy: [1,14,16],
    sharedStaticIp: false,
    sharedDynamicIp: true,
    ipSyncEnabled: true,
    dhcpEnabled: true,
    physicalConnectionType: 0
  }
  describe('amt_AuditLog Tests', function () {
    it('should return a valid amt_AuditLog ReadRecords wsman message', function () {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:ReadRecords_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog"><r:StartIndex>1</r:StartIndex></r:ReadRecords_INPUT></Body></Envelope>`
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
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body /></Envelope>`
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
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body /></Envelope>`
      const response = amtClass.amt_SetupAndConfigurationService(CIM_Methods.GET, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should return null for unsupported in amt_SetupAndConfigurationService methods', function () {
      const response = amtClass.amt_SetupAndConfigurationService(AMT_Methods.READ_RECORDS, messageId)
      expect(response).toBeNull()
    })
  })
  describe('amt_GeneralSettings Tests', function () {
    it('should return a valid amt_GeneralSettings Get wsman message', function () {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body /></Envelope>`
      const response = amtClass.amt_GeneralSettings(CIM_Methods.GET, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should return null for unsupported in amt_GeneralSettings methods', function () {
      const response = amtClass.amt_GeneralSettings(AMT_Methods.READ_RECORDS, messageId)
      expect(response).toBeNull()
    })
  })
  describe('amt_EthernetPortSettings Tests', function () {
    it('should return a valid amt_EthernetPortSettings Get wsman message', function () {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.amt_EthernetPortSettings(CIM_Methods.ENUMERATE, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EthernetPortSettings Pull wsman message', function () {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.amt_EthernetPortSettings(CIM_Methods.PULL, messageId, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EthernetPortSettings Put wsman message', function () {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Ethernet Port Settings 0</w:Selector></w:SelectorSet></Header><Body><r:AMT_EthernetPortSettings xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings"><r:DHCPEnabled>true</r:DHCPEnabled><r:ElementName>Intel(r) AMT Ethernet Port Settings</r:ElementName><r:InstanceID>Intel(r) AMT Ethernet Port Settings 0</r:InstanceID><r:IpSyncEnabled>true</r:IpSyncEnabled><r:LinkIsUp>true</r:LinkIsUp><r:LinkPolicy>1</r:LinkPolicy><r:LinkPolicy>14</r:LinkPolicy><r:LinkPolicy>16</r:LinkPolicy><r:MACAddress>a4-ae-11-1c-02-4d</r:MACAddress><r:PhysicalConnectionType>0</r:PhysicalConnectionType><r:SharedDynamicIP>true</r:SharedDynamicIP><r:SharedMAC>true</r:SharedMAC><r:SharedStaticIp>false</r:SharedStaticIp></r:AMT_EthernetPortSettings></Body></Envelope>`
      const response = amtClass.amt_EthernetPortSettings(CIM_Methods.PUT, messageId, null, ethernetPortObject)
      expect(response).toEqual(correctResponse)
    })
    it('should return null when ethernetPortObject is missing from amt_EthernetPortSettings Pull request', function () {
      let response = amtClass.amt_EthernetPortSettings(CIM_Methods.PUT, messageId)
      expect(response).toBeNull()
    })
    it('should return null when enumerationContext is missing from amt_EthernetPortSettings Pull request', function () {
      let response = amtClass.amt_EthernetPortSettings(CIM_Methods.PULL, messageId)
      expect(response).toBeNull()
    })
    it('should return null for unsupported in amt_EthernetPortSettings methods', function () {
      const response = amtClass.amt_EthernetPortSettings(AMT_Methods.READ_RECORDS, messageId)
      expect(response).toBeNull()
    })
  })
  describe('amt_RemoteAccessPolicyRule Tests', function () {
    it('should create a valid amt_RemoteAccessPolicyRule Delete wsman message', function () {
      const selector: Selector = { name: 'PolicyRuleName', value: 'User Initiated'}
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout><w:SelectorSet><w:Selector Name="PolicyRuleName">User Initiated</w:Selector></w:SelectorSet></Header><Body /></Envelope>`
      const response = amtClass.amt_RemoteAccessPolicyRule(CIM_Methods.DELETE, messageId, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should return null for unsupported in amt_RemoteAccessPolicyRule methods', function () {
      const response = amtClass.amt_RemoteAccessPolicyRule(AMT_Methods.READ_RECORDS, messageId)
      expect(response).toBeNull()
    })
  })
  describe('amt_ManagementPresenceRemoteSAP Tests', function () {
    it('should return a valid amt_ManagementPresenceRemoteSAP Get wsman message', function () {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.amt_ManagementPresenceRemoteSAP(CIM_Methods.ENUMERATE, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_ManagementPresenceRemoteSAP Pull wsman message', function () {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.amt_ManagementPresenceRemoteSAP(CIM_Methods.PULL, messageId, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return null when enumerationContext is missing from amt_ManagementPresenceRemoteSAP Pull request', function () {
      let response = amtClass.amt_ManagementPresenceRemoteSAP(CIM_Methods.PULL, messageId)
      expect(response).toBeNull()
    })
    it('should return null for unsupported in amt_ManagementPresenceRemoteSAP methods', function () {
      const response = amtClass.amt_ManagementPresenceRemoteSAP(AMT_Methods.READ_RECORDS, messageId)
      expect(response).toBeNull()
    })
  })
  describe('amt_PublicKeyCertificate Tests', function () {
    it('should return a valid amt_PublicKeyCertificate Get wsman message', function () {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.amt_PublicKeyCertificate(CIM_Methods.ENUMERATE, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_PublicKeyCertificate Pull wsman message', function () {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.amt_PublicKeyCertificate(CIM_Methods.PULL, messageId, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return null when enumerationContext is missing from amt_PublicKeyCertificate Pull request', function () {
      let response = amtClass.amt_PublicKeyCertificate(CIM_Methods.PULL, messageId)
      expect(response).toBeNull()
    })
    it('should return null for unsupported in amt_PublicKeyCertificate methods', function () {
      const response = amtClass.amt_PublicKeyCertificate(AMT_Methods.READ_RECORDS, messageId)
      expect(response).toBeNull()
    })
  })
})
