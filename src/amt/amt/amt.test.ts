/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { AMT } from './AMT'
import { Methods } from './index'

import { AMT_BootSettingData, AMT_EnvironmentDetectionSettingData, AMT_EthernetPortSettings, MPServer, RemoteAccessPolicyRule } from '../models/amt_models'
import { Selector, WSManErrors } from '../WSMan'
import { Classes } from './classes'

describe('AMT Tests', () => {
  const amtClass = new AMT()
  const castedAMTClass = new AMT() as any
  const messageId = '1'
  const enumerationContext = 'AC070000-0000-0000-0000-000000000000'
  const operationTimeout = 'PT60S'
  const ethernetPortObject: AMT_EthernetPortSettings = {
    InstanceId: 'Intel(r) AMT Ethernet Port Settings 0',
    ElementName: 'Intel(r) AMT Ethernet Port Settings',
    SharedMAC: true,
    MACAddress: 'a4-ae-11-1c-02-4d',
    LinkIsUp: true,
    LinkPolicy: [1, 14, 16],
    SharedStaticIp: false,
    SharedDynamicIp: true,
    IpSyncEnabled: true,
    DHCPEnabled: true,
    PhysicalConnectionType: 0
  }
  const mpsServer: MPServer = {
    AccessInfo: '192.168.0.38',
    InfoFormat: 3,
    Port: 4433,
    AuthMethod: 2,
    Username: 'admin',
    Password: 'eD9J*56Bn7ieEsVR',
    CommonName: '192.168.0.38'
  }
  const remoteAccessPolicyRule: RemoteAccessPolicyRule = {
    Trigger: 2,
    TunnelLifeTime: 0,
    ExtendedData: 'AAAAAAAAABk='
  }
  const bootSettingData: AMT_BootSettingData = {
    BiosLastStatus: [2, 0],
    BiosPause: false,
    BiosSetup: false,
    BootMediaIndex: 0,
    ConfigurationDataReset: false,
    ElementName: 'Intel(r) AMT Boot Configuration Settings',
    EnforceSecureBoot: false,
    FirmwareVerbosity: 0,
    ForcedProgressEvents: false,
    IDERBootDevice: 0,
    InstanceId: 'Intel(r) AMT:BootSettingData 0',
    LockKeyboard: false,
    LockPowerButton: false,
    LockResetButton: false,
    LockSleepButton: false,
    OptionsCleared: true,
    OwningEntity: 'Intel(r) AMT',
    ReflashBIOS: false,
    SecureErase: false,
    UseIDER: false,
    UseSOL: false,
    UseSafeMode: false,
    UserPasswordBypass: false,
    UEFIBootNumberOfParams: [1],
    UEFIBootParametersArray: [1]
  }
  const trustedRootCert = 'MIIEOzCCAqOgAwIBAgIDAZiFMA0GCSqGSIb3DQEBDAUAMD0xFzAVBgNVBAMTDk1QU1Jvb3QtNjE0ZDg4MRAwDgYDVQQKEwd1bmtub3duMRAwDgYDVQQGEwd1bmtub3duMCAXDTIwMDgyNTE4MzMzN1oYDzIwNTEwODI1MTgzMzM3WjA9MRcwFQYDVQQDEw5NUFNSb290LTYxNGQ4ODEQMA4GA1UEChMHdW5rbm93bjEQMA4GA1UEBhMHdW5rbm93bjCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAOi1jx9L8DG6gBPxd9gmJ6vqQC/F/TBMTJvb3ZAuRbDxUKnxZk3PafyNM6fO8QTL4qZVhvyGEZaIzVePrdJj31aZ93mNY2TJee3/DLRsJUIZHGFufBvi8pgQL+JjE9JmFD5/S2yciHIEVpKmXo1CbGmZGsnb8NRjaQVwB94pI1mg8JFMxyKzU/cUoCBfI+wmeMgBVdOJPNpH2zjC/GxwEFNQaxGe9GHmYbwoeiDeMPo75E/o+Gw6kJm429cuhJBC3KqHevAJj9V2nSUvoO0oxKqzLVkUYcjHEGYjxIvP6a6uo7x9llwfshJsBZ3PE5hucNdWS3dY3GeCqOwcaAQQIj2jULpZ/KlgVAdBK/o5QjE+IIQXCVK9USvktGzz7I5oH98zy8jCFStbGM7PQCo+DEnHn/SANmVbcy3hjzrXC8zf5dvmKiUb2eKnpv+z3FHsi64sVwFqBArB2ipcTM/qv4nEM6uLW1t+7+NB0OyaBmLktJrpb6af7z/EW1QuPIfTcQIDAQABo0IwQDAMBgNVHRMEBTADAQH/MBEGCWCGSAGG+EIBAQQEAwIABzAdBgNVHQ4EFgQUYU2IeTFqWXI1rG+JqZq8eVDO/LMwDQYJKoZIhvcNAQEMBQADggGBANoKIsFOn8/Lrb98DjOP+LUeopoU9KQ70ndreNqchrkPmM61V9IdD9OZiLr/7OY/rLGZwNvkhQYRPUa842Mqjfpr4YcV6HC0j6Zg0lcpxQ5eGGBkLb/teBcboi3sZcJvbCFUW2DJjhy7uqYxzE4eqSsKx5fEjp/wa6oNzNrgWRXyxQlaOo42RjXnOXS7sB0jPrgO0FClL1Xzif06kFHzzyJCVUqzNEJv0ynLgkpzCVdUUfoMM1RcKc3xJes5C0zg64ugj2R9e4VwJfn9W3+rlYS1So1q1jL8w+3qOM7lXyvr8Bdgc5BMvrOvHxzdOnpZmUEJkbKty62e8fYKN+WP7BrpxnzFQSzczX5S0uN4rn0rLO4wxVf2rtnTqIhKKYTsPMRBVEjpbRT1smzPPdINKu5l/Rz/zZS0b5I4yKJrkTYNgoPC/QSq8A9uXZxxQvj6x1bWZJVWywmaqYolEp8NaVHd+JYnlTmr4XpMHm01TPi1laowtY3ZepnKm8I55Ly0JA=='
  describe('AMT private function Tests', () => {
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedAMTClass.amtSwitch({ method: Methods.READ_RECORDS, class: Classes.AMT_AUDIT_LOG, messageId: messageId }) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('amt_AuditLog Tests', () => {
    it('should return a valid amt_AuditLog ReadRecords wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:ReadRecords_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog"><r:StartIndex>1</r:StartIndex></r:ReadRecords_INPUT></Body></Envelope>`
      const response = amtClass.AuditLog(Methods.READ_RECORDS, messageId, 1)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedAMTClass.AuditLog(Methods.GET, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('amt_RedirectionService Tests', () => {
    it('should return a valid amt_RedirectionService Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body /></Envelope>`
      const boundCall = amtClass.RedirectionService.bind(this, Methods.GET, messageId)
      const response = boundCall()
      expect(response).toEqual(correctResponse)
    })
  })
  describe('amt_SetupAndConfigurationService Tests', () => {
    it('should return a valid amt_SetupAndConfigurationService Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body /></Envelope>`
      const response = amtClass.SetupAndConfigurationService(Methods.GET, messageId)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('amt_GeneralSettings Tests', () => {
    it('should return a valid amt_GeneralSettings Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body /></Envelope>`
      const response = amtClass.GeneralSettings(Methods.GET, messageId)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('amt_EthernetPortSettings Tests', () => {
    it('should return a valid amt_EthernetPortSettings Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.EthernetPortSettings(Methods.ENUMERATE, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EthernetPortSettings Pull wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.EthernetPortSettings(Methods.PULL, messageId, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EthernetPortSettings Put wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Ethernet Port Settings 0</w:Selector></w:SelectorSet></Header><Body><r:AMT_EthernetPortSettings xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings"><r:DHCPEnabled>true</r:DHCPEnabled><r:ElementName>Intel(r) AMT Ethernet Port Settings</r:ElementName><r:InstanceID>Intel(r) AMT Ethernet Port Settings 0</r:InstanceID><r:IpSyncEnabled>true</r:IpSyncEnabled><r:LinkIsUp>true</r:LinkIsUp><r:LinkPolicy>1</r:LinkPolicy><r:LinkPolicy>14</r:LinkPolicy><r:LinkPolicy>16</r:LinkPolicy><r:MACAddress>a4-ae-11-1c-02-4d</r:MACAddress><r:PhysicalConnectionType>0</r:PhysicalConnectionType><r:SharedDynamicIP>true</r:SharedDynamicIP><r:SharedMAC>true</r:SharedMAC><r:SharedStaticIp>false</r:SharedStaticIp></r:AMT_EthernetPortSettings></Body></Envelope>`
      const response = amtClass.EthernetPortSettings(Methods.PUT, messageId, null, ethernetPortObject)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if ethernetPortObject is missing from amt_EthernetPortSettings Pull request', () => {
      expect(() => { amtClass.EthernetPortSettings(Methods.PUT, messageId) }).toThrow(WSManErrors.ETHERNET_PORT_OBJECT)
    })
    it('should throw error if enumerationContext is missing from amt_EthernetPortSettings Pull request', () => {
      expect(() => { amtClass.EthernetPortSettings(Methods.PULL, messageId) }).toThrow(WSManErrors.ENUMERATION_CONTEXT)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedAMTClass.EthernetPortSettings(Methods.SET_BOOT_CONFIG_ROLE, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('amt_RemoteAccessPolicyRule Tests', () => {
    it('should create a valid amt_RemoteAccessPolicyRule Delete wsman message', () => {
      const selector: Selector = { name: 'PolicyRuleName', value: 'User Initiated' }
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="PolicyRuleName">User Initiated</w:Selector></w:SelectorSet></Header><Body /></Envelope>`
      const response = amtClass.RemoteAccessPolicyRule(Methods.DELETE, messageId, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if selector is missing from amt_RemoteAccessPolicyRule Delete method', () => {
      expect(() => { amtClass.RemoteAccessPolicyRule(Methods.DELETE, messageId) }).toThrow(WSManErrors.SELECTOR)
    })
  })
  describe('amt_ManagementPresenceRemoteSAP Tests', () => {
    it('should return a valid amt_ManagementPresenceRemoteSAP Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.ManagementPresenceRemoteSAP(Methods.ENUMERATE, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_ManagementPresenceRemoteSAP Pull wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.ManagementPresenceRemoteSAP(Methods.PULL, messageId, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if enumerationContext is missing from amt_ManagementPresenceRemoteSAP Pull request', () => {
      expect(() => { amtClass.ManagementPresenceRemoteSAP(Methods.PULL, messageId) }).toThrow(WSManErrors.ENUMERATION_CONTEXT)
    })
  })
  describe('amt_PublicKeyCertificate Tests', () => {
    it('should return a valid amt_PublicKeyCertificate Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.PublicKeyCertificate(Methods.ENUMERATE, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_PublicKeyCertificate Pull wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.PublicKeyCertificate(Methods.PULL, messageId, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if enumerationContext is missing from amt_PublicKeyCertificate Pull request', () => {
      expect(() => { amtClass.PublicKeyCertificate(Methods.PULL, messageId) }).toThrow(WSManErrors.ENUMERATION_CONTEXT)
    })
  })
  describe('amt_EnvironmentDetectionSettingData Tests', () => {
    it('should return a valid amt_EnvironmentDetectionSettingData Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body /></Envelope>`
      const response = amtClass.EnvironmentDetectionSettingData(Methods.GET, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EnvironmentDetectionSettingData Put wsman message', () => {
      const environmentDetectionSettingData: AMT_EnvironmentDetectionSettingData = {
        InstanceId: 'Intel(r) AMT Environment Detection Settings',
        DetectionAlgorithm: 0,
        ElementName: 'Intel(r) AMT Environment Detection Settings',
        DetectionStrings: ['dummy.com']
      }
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">${environmentDetectionSettingData.InstanceId}</w:Selector></w:SelectorSet></Header><Body><r:AMT_EnvironmentDetectionSettingData xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData"><r:DetectionAlgorithm>${environmentDetectionSettingData.DetectionAlgorithm}</r:DetectionAlgorithm><r:ElementName>${environmentDetectionSettingData.ElementName}</r:ElementName><r:InstanceID>${environmentDetectionSettingData.InstanceId}</r:InstanceID><r:DetectionStrings>${environmentDetectionSettingData.DetectionStrings}</r:DetectionStrings></r:AMT_EnvironmentDetectionSettingData></Body></Envelope>`
      const response = amtClass.EnvironmentDetectionSettingData(Methods.PUT, messageId, environmentDetectionSettingData)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if environmentDetectionSettingData is missing from amt_EnvironmentDetectionSettingData Pull request', () => {
      expect(() => { amtClass.EnvironmentDetectionSettingData(Methods.PUT, messageId) }).toThrow(WSManErrors.ENVIRONMENT_DETECTION_SETTING_DATA)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedAMTClass.EnvironmentDetectionSettingData(Methods.SET_BOOT_CONFIG_ROLE, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('amt_PublicKeyManagementService Tests', () => {
    it('should return a valid amt_PublicKeyManagementService AddTrustedRootCertificate wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddTrustedRootCertificate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AddTrustedRootCertificate_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><r:CertificateBlob>${trustedRootCert}</r:CertificateBlob></r:AddTrustedRootCertificate_INPUT></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService(Methods.ADD_TRUSTED_ROOT_CERTIFICATE, messageId, trustedRootCert)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if certificateBlob is missing from amt_PublicKeyManagementService methods', () => {
      expect(() => { amtClass.PublicKeyManagementService(Methods.ADD_TRUSTED_ROOT_CERTIFICATE, messageId) }).toThrow(WSManErrors.CERTIFICATE_BLOB)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedAMTClass.PublicKeyManagementService(Methods.SET_BOOT_CONFIG_ROLE, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('amt_RemoteAccessService Tests', () => {
    it('should return a valid amt_RemoteAccessService addMpsServer wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddMpServer</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AddMpServer_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:AccessInfo>${mpsServer.AccessInfo}</r:AccessInfo><r:InfoFormat>${mpsServer.InfoFormat}</r:InfoFormat><r:Port>${mpsServer.Port}</r:Port><r:AuthMethod>${mpsServer.AuthMethod}</r:AuthMethod><r:Username>${mpsServer.Username}</r:Username><r:Password>${mpsServer.Password}</r:Password><r:CN>${mpsServer.CommonName}</r:CN></r:AddMpServer_INPUT></Body></Envelope>`
      const response = amtClass.RemoteAccessService(Methods.ADD_MPS, messageId, mpsServer)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if remoteAccessPolicyRule is missing from amt_RemoteAccessService AddRemoteAccessPolicyRule methods', () => {
      const selector: Selector = { name: 'Name', value: 'Intel(r) AMT:Management Presence Server 0' }
      expect(() => { amtClass.RemoteAccessService(Methods.ADD_REMOTE_ACCESS_POLICY_RULE, messageId, null, null, selector) }).toThrow(WSManErrors.REMOTE_ACCESS_POLICY_RULE)
    })
    it('should throw error if selector is missing from amt_RemoteAccessService AddRemoteAccessPolicyRule methods', () => {
      expect(() => { amtClass.RemoteAccessService(Methods.ADD_REMOTE_ACCESS_POLICY_RULE, messageId, null, remoteAccessPolicyRule) }).toThrow(WSManErrors.SELECTOR)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedAMTClass.RemoteAccessService(Methods.SET_BOOT_CONFIG_ROLE, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('amt_UserInitiatedConnectionService Tests', () => {
    it('should return a valid amt_UserInitiatedConnectionService AddTrustedRootCertificate wsman message', () => {
      const requestedState = 32771
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService/RequestStateChange</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:RequestStateChange_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService"><r:RequestedState>${requestedState}</r:RequestedState></r:RequestStateChange_INPUT></Body></Envelope>`
      const response = amtClass.UserInitiatedConnectionService(Methods.REQUEST_STATE_CHANGE, messageId, requestedState)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if requestedState is missing from amt_UserInitiatedConnectionService RequestStateChange methods', () => {
      expect(() => { amtClass.UserInitiatedConnectionService(Methods.REQUEST_STATE_CHANGE, messageId) }).toThrow(WSManErrors.REQUESTED_STATE)
    })
  })
  describe('amt_BootSettingData Tests', () => {
    it('should return a valid amt_BootSettingData Get wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body /></Envelope>`
      const response = amtClass.BootSettingData(Methods.GET, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootSettingData Put wsman message', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AMT_BootSettingData xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData"><r:BIOSLastStatus>${bootSettingData.BiosLastStatus[0]}</r:BIOSLastStatus><r:BIOSLastStatus>${bootSettingData.BiosLastStatus[1]}</r:BIOSLastStatus><r:UEFIBootNumberOfParams>${bootSettingData.UEFIBootNumberOfParams[0]}</r:UEFIBootNumberOfParams><r:UEFIBootParametersArray>${bootSettingData.UEFIBootParametersArray[0]}</r:UEFIBootParametersArray><r:BIOSPause>${bootSettingData.BiosPause}</r:BIOSPause><r:BIOSSetup>${bootSettingData.BiosSetup}</r:BIOSSetup><r:BootMediaIndex>${bootSettingData.BootMediaIndex}</r:BootMediaIndex><r:ConfigurationDataReset>${bootSettingData.ConfigurationDataReset}</r:ConfigurationDataReset><r:ElementName>${bootSettingData.ElementName}</r:ElementName><r:EnforceSecureBoot>${bootSettingData.EnforceSecureBoot}</r:EnforceSecureBoot><r:FirmwareVerbosity>${bootSettingData.FirmwareVerbosity}</r:FirmwareVerbosity><r:ForcedProgressEvents>${bootSettingData.ForcedProgressEvents}</r:ForcedProgressEvents><r:IDERBootDevice>${bootSettingData.IDERBootDevice}</r:IDERBootDevice><r:InstanceID>${bootSettingData.InstanceId}</r:InstanceID><r:LockKeyboard>${bootSettingData.LockKeyboard}</r:LockKeyboard><r:LockPowerButton>${bootSettingData.LockPowerButton}</r:LockPowerButton><r:LockResetButton>${bootSettingData.LockResetButton}</r:LockResetButton><r:LockSleepButton>${bootSettingData.LockSleepButton}</r:LockSleepButton><r:OptionsCleared>${bootSettingData.OptionsCleared}</r:OptionsCleared><r:OwningEntity>${bootSettingData.OwningEntity}</r:OwningEntity><r:ReflashBIOS>${bootSettingData.ReflashBIOS}</r:ReflashBIOS><r:SecureErase>${bootSettingData.SecureErase}</r:SecureErase><r:UseIDER>${bootSettingData.UseIDER}</r:UseIDER><r:UseSOL>${bootSettingData.UseSOL}</r:UseSOL><r:UseSafeMode>${bootSettingData.UseSafeMode}</r:UseSafeMode><r:UserPasswordBypass>${bootSettingData.UserPasswordBypass}</r:UserPasswordBypass></r:AMT_BootSettingData></Body></Envelope>`
      const response = amtClass.BootSettingData(Methods.PUT, messageId, bootSettingData)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if bootSettingData is missing from amt_BootSettingData Put method', () => {
      expect(() => { amtClass.BootSettingData(Methods.PUT, messageId) }).toThrow(WSManErrors.BOOT_SETTING_DATA)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedAMTClass.BootSettingData(Methods.SET_BOOT_CONFIG_ROLE, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
})
