/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { AMT } from '../amt'
import { AMT_Methods, AMT_Classes } from '../enums/amt_enums'
import { CIM_Methods } from '../enums/cim_enums'
import { AMT_BootSettingData, AMT_EnvironmentDetectionSettingData, AMT_EthernetPortSettings, MPServer, RemoteAccessPolicyRule } from '../models/amt_models'
import { Selector, WSManErrors } from '../wsman'

describe('AMT Tests', () => {
  const amtClass = new AMT()
  const castedAMTClass = new AMT() as any
  const messageId = '1'
  const enumerationContext = 'AC070000-0000-0000-0000-000000000000'
  const operationTimeout = 'PT60S'
  const ethernetPortObject: AMT_EthernetPortSettings = {
    instanceId: 'Intel(r) AMT Ethernet Port Settings 0',
    elementName: 'Intel(r) AMT Ethernet Port Settings',
    sharedMAC: true,
    macAddress: 'a4-ae-11-1c-02-4d',
    linkIsUp: true,
    linkPolicy: [1, 14, 16],
    sharedStaticIp: false,
    sharedDynamicIp: true,
    ipSyncEnabled: true,
    dhcpEnabled: true,
    physicalConnectionType: 0
  }
  const mpsServer: MPServer = {
    accessInfo: '192.168.0.38',
    infoFormat: 3,
    port: 4433,
    authMethod: 2,
    username: 'admin',
    password: 'eD9J*56Bn7ieEsVR',
    commonName: '192.168.0.38'
  }
  const remoteAccessPolicyRule: RemoteAccessPolicyRule = {
    trigger: 2,
    tunnelLifeTime: 0,
    extendedData: 'AAAAAAAAABk='
  }
  const bootSettingData: AMT_BootSettingData = {
    biosLastStatus: [2, 0],
    biosPause: false,
    biosSetup: false,
    bootMediaIndex: 0,
    configurationDataReset: false,
    elementName: 'Intel(r) AMT Boot Configuration Settings',
    enforceSecureBoot: false,
    firmwareVerbosity: 0,
    forcedProgressEvents: false,
    iderBootDevice: 0,
    instanceId: 'Intel(r) AMT:BootSettingData 0',
    lockKeyboard: false,
    lockPowerButton: false,
    lockResetButton: false,
    lockSleepButton: false,
    optionsCleared: true,
    owningEntity: 'Intel(r) AMT',
    reflashBIOS: false,
    secureErase: false,
    useIDER: false,
    useSOL: false,
    useSafeMode: false,
    userPasswordBypass: false,
    uefiBootNumberOfParams: [1],
    uefiBootParametersArray: [1]
  }
  const trustedRootCert = 'MIIEOzCCAqOgAwIBAgIDAZiFMA0GCSqGSIb3DQEBDAUAMD0xFzAVBgNVBAMTDk1QU1Jvb3QtNjE0ZDg4MRAwDgYDVQQKEwd1bmtub3duMRAwDgYDVQQGEwd1bmtub3duMCAXDTIwMDgyNTE4MzMzN1oYDzIwNTEwODI1MTgzMzM3WjA9MRcwFQYDVQQDEw5NUFNSb290LTYxNGQ4ODEQMA4GA1UEChMHdW5rbm93bjEQMA4GA1UEBhMHdW5rbm93bjCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAOi1jx9L8DG6gBPxd9gmJ6vqQC/F/TBMTJvb3ZAuRbDxUKnxZk3PafyNM6fO8QTL4qZVhvyGEZaIzVePrdJj31aZ93mNY2TJee3/DLRsJUIZHGFufBvi8pgQL+JjE9JmFD5/S2yciHIEVpKmXo1CbGmZGsnb8NRjaQVwB94pI1mg8JFMxyKzU/cUoCBfI+wmeMgBVdOJPNpH2zjC/GxwEFNQaxGe9GHmYbwoeiDeMPo75E/o+Gw6kJm429cuhJBC3KqHevAJj9V2nSUvoO0oxKqzLVkUYcjHEGYjxIvP6a6uo7x9llwfshJsBZ3PE5hucNdWS3dY3GeCqOwcaAQQIj2jULpZ/KlgVAdBK/o5QjE+IIQXCVK9USvktGzz7I5oH98zy8jCFStbGM7PQCo+DEnHn/SANmVbcy3hjzrXC8zf5dvmKiUb2eKnpv+z3FHsi64sVwFqBArB2ipcTM/qv4nEM6uLW1t+7+NB0OyaBmLktJrpb6af7z/EW1QuPIfTcQIDAQABo0IwQDAMBgNVHRMEBTADAQH/MBEGCWCGSAGG+EIBAQQEAwIABzAdBgNVHQ4EFgQUYU2IeTFqWXI1rG+JqZq8eVDO/LMwDQYJKoZIhvcNAQEMBQADggGBANoKIsFOn8/Lrb98DjOP+LUeopoU9KQ70ndreNqchrkPmM61V9IdD9OZiLr/7OY/rLGZwNvkhQYRPUa842Mqjfpr4YcV6HC0j6Zg0lcpxQ5eGGBkLb/teBcboi3sZcJvbCFUW2DJjhy7uqYxzE4eqSsKx5fEjp/wa6oNzNrgWRXyxQlaOo42RjXnOXS7sB0jPrgO0FClL1Xzif06kFHzzyJCVUqzNEJv0ynLgkpzCVdUUfoMM1RcKc3xJes5C0zg64ugj2R9e4VwJfn9W3+rlYS1So1q1jL8w+3qOM7lXyvr8Bdgc5BMvrOvHxzdOnpZmUEJkbKty62e8fYKN+WP7BrpxnzFQSzczX5S0uN4rn0rLO4wxVf2rtnTqIhKKYTsPMRBVEjpbRT1smzPPdINKu5l/Rz/zZS0b5I4yKJrkTYNgoPC/QSq8A9uXZxxQvj6x1bWZJVWywmaqYolEp8NaVHd+JYnlTmr4XpMHm01TPi1laowtY3ZepnKm8I55Ly0JA=='
  describe('AMT private function Tests', () => {
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedAMTClass.amtSwitch({ method: AMT_Methods.READ_RECORDS, class: AMT_Classes.AMT_AUDIT_LOG, messageId: messageId }) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('amt_AuditLog Tests', () => {
    it('should return a valid amt_AuditLog ReadRecords wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:ReadRecords_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog"><r:StartIndex>1</r:StartIndex></r:ReadRecords_INPUT></Body></Envelope>`
      const response = amtClass.amt_AuditLog(AMT_Methods.READ_RECORDS, messageId, 1)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedAMTClass.amt_AuditLog(CIM_Methods.GET, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('amt_RedirectionService Tests', () => {
    it('should return a valid amt_RedirectionService Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body /></Envelope>`
      const boundCall = amtClass.amt_RedirectionService.bind(this, CIM_Methods.GET, messageId)
      const response = boundCall()
      expect(response).toEqual(correctResponse)
    })
  })
  describe('amt_SetupAndConfigurationService Tests', () => {
    it('should return a valid amt_SetupAndConfigurationService Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body /></Envelope>`
      const response = amtClass.amt_SetupAndConfigurationService(CIM_Methods.GET, messageId)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('amt_GeneralSettings Tests', () => {
    it('should return a valid amt_GeneralSettings Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body /></Envelope>`
      const response = amtClass.amt_GeneralSettings(CIM_Methods.GET, messageId)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('amt_EthernetPortSettings Tests', () => {
    it('should return a valid amt_EthernetPortSettings Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.amt_EthernetPortSettings(CIM_Methods.ENUMERATE, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EthernetPortSettings Pull wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.amt_EthernetPortSettings(CIM_Methods.PULL, messageId, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EthernetPortSettings Put wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Ethernet Port Settings 0</w:Selector></w:SelectorSet></Header><Body><r:AMT_EthernetPortSettings xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings"><r:DHCPEnabled>true</r:DHCPEnabled><r:ElementName>Intel(r) AMT Ethernet Port Settings</r:ElementName><r:InstanceID>Intel(r) AMT Ethernet Port Settings 0</r:InstanceID><r:IpSyncEnabled>true</r:IpSyncEnabled><r:LinkIsUp>true</r:LinkIsUp><r:LinkPolicy>1</r:LinkPolicy><r:LinkPolicy>14</r:LinkPolicy><r:LinkPolicy>16</r:LinkPolicy><r:MACAddress>a4-ae-11-1c-02-4d</r:MACAddress><r:PhysicalConnectionType>0</r:PhysicalConnectionType><r:SharedDynamicIP>true</r:SharedDynamicIP><r:SharedMAC>true</r:SharedMAC><r:SharedStaticIp>false</r:SharedStaticIp></r:AMT_EthernetPortSettings></Body></Envelope>`
      const response = amtClass.amt_EthernetPortSettings(CIM_Methods.PUT, messageId, null, ethernetPortObject)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if ethernetPortObject is missing from amt_EthernetPortSettings Pull request', () => {
      expect(() => { amtClass.amt_EthernetPortSettings(CIM_Methods.PUT, messageId) }).toThrow(WSManErrors.ETHERNET_PORT_OBJECT)
    })
    it('should throw error if enumerationContext is missing from amt_EthernetPortSettings Pull request', () => {
      expect(() => { amtClass.amt_EthernetPortSettings(CIM_Methods.PULL, messageId) }).toThrow(WSManErrors.ENUMERATION_CONTEXT)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedAMTClass.amt_EthernetPortSettings(CIM_Methods.SET_BOOT_CONFIG_ROLE, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('amt_RemoteAccessPolicyRule Tests', () => {
    it('should create a valid amt_RemoteAccessPolicyRule Delete wsman message', () => {
      const selector: Selector = { name: 'PolicyRuleName', value: 'User Initiated' }
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="PolicyRuleName">User Initiated</w:Selector></w:SelectorSet></Header><Body /></Envelope>`
      const response = amtClass.amt_RemoteAccessPolicyRule(CIM_Methods.DELETE, messageId, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if selector is missing from amt_RemoteAccessPolicyRule Delete method', () => {
      expect(() => { amtClass.amt_RemoteAccessPolicyRule(CIM_Methods.DELETE, messageId) }).toThrow(WSManErrors.SELECTOR)
    })
  })
  describe('amt_ManagementPresenceRemoteSAP Tests', () => {
    it('should return a valid amt_ManagementPresenceRemoteSAP Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.amt_ManagementPresenceRemoteSAP(CIM_Methods.ENUMERATE, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_ManagementPresenceRemoteSAP Pull wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.amt_ManagementPresenceRemoteSAP(CIM_Methods.PULL, messageId, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if enumerationContext is missing from amt_ManagementPresenceRemoteSAP Pull request', () => {
      expect(() => { amtClass.amt_ManagementPresenceRemoteSAP(CIM_Methods.PULL, messageId) }).toThrow(WSManErrors.ENUMERATION_CONTEXT)
    })
  })
  describe('amt_PublicKeyCertificate Tests', () => {
    it('should return a valid amt_PublicKeyCertificate Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.amt_PublicKeyCertificate(CIM_Methods.ENUMERATE, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_PublicKeyCertificate Pull wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.amt_PublicKeyCertificate(CIM_Methods.PULL, messageId, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if enumerationContext is missing from amt_PublicKeyCertificate Pull request', () => {
      expect(() => { amtClass.amt_PublicKeyCertificate(CIM_Methods.PULL, messageId) }).toThrow(WSManErrors.ENUMERATION_CONTEXT)
    })
  })
  describe('amt_EnvironmentDetectionSettingData Tests', () => {
    it('should return a valid amt_EnvironmentDetectionSettingData Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body /></Envelope>`
      const response = amtClass.amt_EnvironmentDetectionSettingData(CIM_Methods.GET, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EnvironmentDetectionSettingData Put wsman message', () => {
      const environmentDetectionSettingData: AMT_EnvironmentDetectionSettingData = {
        instanceId: 'Intel(r) AMT Environment Detection Settings',
        detectionAlgorithm: 0,
        elementName: 'Intel(r) AMT Environment Detection Settings',
        detectionStrings: ['dummy.com']
      }
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">${environmentDetectionSettingData.instanceId}</w:Selector></w:SelectorSet></Header><Body><r:AMT_EnvironmentDetectionSettingData xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData"><r:DetectionAlgorithm>${environmentDetectionSettingData.detectionAlgorithm}</r:DetectionAlgorithm><r:ElementName>${environmentDetectionSettingData.elementName}</r:ElementName><r:InstanceID>${environmentDetectionSettingData.instanceId}</r:InstanceID><r:DetectionStrings>${environmentDetectionSettingData.detectionStrings}</r:DetectionStrings></r:AMT_EnvironmentDetectionSettingData></Body></Envelope>`
      const response = amtClass.amt_EnvironmentDetectionSettingData(CIM_Methods.PUT, messageId, environmentDetectionSettingData)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if environmentDetectionSettingData is missing from amt_EnvironmentDetectionSettingData Pull request', () => {
      expect(() => { amtClass.amt_EnvironmentDetectionSettingData(CIM_Methods.PUT, messageId) }).toThrow(WSManErrors.ENVIRONMENT_DETECTION_SETTING_DATA)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedAMTClass.amt_EnvironmentDetectionSettingData(CIM_Methods.SET_BOOT_CONFIG_ROLE, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('amt_PublicKeyManagementService Tests', () => {
    it('should return a valid amt_PublicKeyManagementService AddTrustedRootCertificate wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddTrustedRootCertificate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AddTrustedRootCertificate_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><r:CertificateBlob>${trustedRootCert}</r:CertificateBlob></r:AddTrustedRootCertificate_INPUT></Body></Envelope>`
      const response = amtClass.amt_PublicKeyManagementService(AMT_Methods.ADD_TRUSTED_ROOT_CERTIFICATE, messageId, trustedRootCert)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if certificateBlob is missing from amt_PublicKeyManagementService methods', () => {
      expect(() => { amtClass.amt_PublicKeyManagementService(AMT_Methods.ADD_TRUSTED_ROOT_CERTIFICATE, messageId) }).toThrow(WSManErrors.CERTIFICATE_BLOB)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedAMTClass.amt_PublicKeyManagementService(CIM_Methods.SET_BOOT_CONFIG_ROLE, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('amt_RemoteAccessService Tests', () => {
    it('should return a valid amt_RemoteAccessService addMpsServer wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddMpServer</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AddMpServer_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:AccessInfo>${mpsServer.accessInfo}</r:AccessInfo><r:InfoFormat>${mpsServer.infoFormat}</r:InfoFormat><r:Port>${mpsServer.port}</r:Port><r:AuthMethod>${mpsServer.authMethod}</r:AuthMethod><r:Username>${mpsServer.username}</r:Username><r:Password>${mpsServer.password}</r:Password><r:CN>${mpsServer.commonName}</r:CN></r:AddMpServer_INPUT></Body></Envelope>`
      const response = amtClass.amt_RemoteAccessService(AMT_Methods.ADD_MPS, messageId, mpsServer)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_RemoteAccessService AddRemoteAccessPolicyRule wsman message', () => {
      const selector: Selector = { name: 'Name', value: 'Intel(r) AMT:Management Presence Server 0' }
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddRemoteAccessPolicyRule</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AddRemoteAccessPolicyRule_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:Trigger>${remoteAccessPolicyRule.trigger}</r:Trigger><r:TunnelLifeTime>${remoteAccessPolicyRule.tunnelLifeTime}</r:TunnelLifeTime><r:ExtendedData>${remoteAccessPolicyRule.extendedData}</r:ExtendedData><r:MpServer><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="${selector.name}">${selector.value}</Selector></SelectorSet></ReferenceParameters></r:MpServer></r:AddRemoteAccessPolicyRule_INPUT></Body></Envelope>`
      const response = amtClass.amt_RemoteAccessService(AMT_Methods.ADD_REMOTE_ACCESS_POLICY_RULE, messageId, null, remoteAccessPolicyRule, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if mpServer is missing from amt_RemoteAccessService AddMpServer methods', () => {
      expect(() => { amtClass.amt_RemoteAccessService(AMT_Methods.ADD_MPS, messageId) }).toThrow(WSManErrors.MP_SERVER)
    })
    it('should throw error if remoteAccessPolicyRule is missing from amt_RemoteAccessService AddRemoteAccessPolicyRule methods', () => {
      const selector: Selector = { name: 'Name', value: 'Intel(r) AMT:Management Presence Server 0' }
      expect(() => { amtClass.amt_RemoteAccessService(AMT_Methods.ADD_REMOTE_ACCESS_POLICY_RULE, messageId, null, null, selector) }).toThrow(WSManErrors.REMOTE_ACCESS_POLICY_RULE)
    })
    it('should throw error if selector is missing from amt_RemoteAccessService AddRemoteAccessPolicyRule methods', () => {
      expect(() => { amtClass.amt_RemoteAccessService(AMT_Methods.ADD_REMOTE_ACCESS_POLICY_RULE, messageId, null, remoteAccessPolicyRule) }).toThrow(WSManErrors.SELECTOR)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedAMTClass.amt_RemoteAccessService(CIM_Methods.SET_BOOT_CONFIG_ROLE, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('amt_UserInitiatedConnectionService Tests', () => {
    it('should return a valid amt_UserInitiatedConnectionService AddTrustedRootCertificate wsman message', () => {
      const requestedState = 32771
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService/RequestStateChange</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:RequestStateChange_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService"><r:RequestedState>${requestedState}</r:RequestedState></r:RequestStateChange_INPUT></Body></Envelope>`
      const response = amtClass.amt_UserInitiatedConnectionService(AMT_Methods.REQUEST_STATE_CHANGE, messageId, requestedState)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if requestedState is missing from amt_UserInitiatedConnectionService RequestStateChange methods', () => {
      expect(() => { amtClass.amt_UserInitiatedConnectionService(AMT_Methods.REQUEST_STATE_CHANGE, messageId) }).toThrow(WSManErrors.REQUESTED_STATE)
    })
  })
  describe('amt_BootSettingData Tests', () => {
    it('should return a valid amt_BootSettingData Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body /></Envelope>`
      const response = amtClass.amt_BootSettingData(CIM_Methods.GET, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootSettingData Put wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AMT_BootSettingData xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData"><r:BIOSLastStatus>${bootSettingData.biosLastStatus[0]}</r:BIOSLastStatus><r:BIOSLastStatus>${bootSettingData.biosLastStatus[1]}</r:BIOSLastStatus><r:UEFIBootNumberOfParams>${bootSettingData.uefiBootNumberOfParams[0]}</r:UEFIBootNumberOfParams><r:UEFIBootParametersArray>${bootSettingData.uefiBootParametersArray[0]}</r:UEFIBootParametersArray><r:BIOSPause>${bootSettingData.biosPause}</r:BIOSPause><r:BIOSSetup>${bootSettingData.biosSetup}</r:BIOSSetup><r:BootMediaIndex>${bootSettingData.bootMediaIndex}</r:BootMediaIndex><r:ConfigurationDataReset>${bootSettingData.configurationDataReset}</r:ConfigurationDataReset><r:ElementName>${bootSettingData.elementName}</r:ElementName><r:EnforceSecureBoot>${bootSettingData.enforceSecureBoot}</r:EnforceSecureBoot><r:FirmwareVerbosity>${bootSettingData.firmwareVerbosity}</r:FirmwareVerbosity><r:ForcedProgressEvents>${bootSettingData.forcedProgressEvents}</r:ForcedProgressEvents><r:IDERBootDevice>${bootSettingData.iderBootDevice}</r:IDERBootDevice><r:InstanceID>${bootSettingData.instanceId}</r:InstanceID><r:LockKeyboard>${bootSettingData.lockKeyboard}</r:LockKeyboard><r:LockPowerButton>${bootSettingData.lockPowerButton}</r:LockPowerButton><r:LockResetButton>${bootSettingData.lockResetButton}</r:LockResetButton><r:LockSleepButton>${bootSettingData.lockSleepButton}</r:LockSleepButton><r:OptionsCleared>${bootSettingData.optionsCleared}</r:OptionsCleared><r:OwningEntity>${bootSettingData.owningEntity}</r:OwningEntity><r:ReflashBIOS>${bootSettingData.reflashBIOS}</r:ReflashBIOS><r:SecureErase>${bootSettingData.secureErase}</r:SecureErase><r:UseIDER>${bootSettingData.useIDER}</r:UseIDER><r:UseSOL>${bootSettingData.useSOL}</r:UseSOL><r:UseSafeMode>${bootSettingData.useSafeMode}</r:UseSafeMode><r:UserPasswordBypass>${bootSettingData.userPasswordBypass}</r:UserPasswordBypass></r:AMT_BootSettingData></Body></Envelope>`
      const response = amtClass.amt_BootSettingData(CIM_Methods.PUT, messageId, bootSettingData)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if bootSettingData is missing from amt_BootSettingData Put method', () => {
      expect(() => { amtClass.amt_BootSettingData(CIM_Methods.PUT, messageId) }).toThrow(WSManErrors.BOOT_SETTING_DATA)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedAMTClass.amt_BootSettingData(CIM_Methods.SET_BOOT_CONFIG_ROLE, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
})
