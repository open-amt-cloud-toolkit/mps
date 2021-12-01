/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Selector, WSManMessageCreator, WSManErrors } from './WSMan'
import { AMT_Methods, AMT_Actions, AMT_Classes } from './enums/amt_enums'
import { AMT_EthernetPortSettings, MPServer, RemoteAccessPolicyRule, AMT_EnvironmentDetectionSettingData, AMT_BootSettingData } from './models/amt_models'
import { Actions } from './cim/actions'
import { Methods } from './cim/methods'

type AllActions = AMT_Actions | Actions // Allows for Action reuse between CIM and AMT

interface AMTCall {
  method: Methods | AMT_Methods
  class: AMT_Classes
  messageId: string
  enumerationContext?: string
  selector?: Selector
  requestedState?: number
}

export class AMT {
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator()
  readonly resourceUriBase: string = 'http://intel.com/wbem/wscim/1/amt-schema/1/'

  private readonly get = (action: AllActions, amtClass: AMT_Classes, messageId: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId)
    const body: string = this.wsmanMessageCreator.createBody(Methods.GET)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly enumerate = (action: AllActions, amtClass: AMT_Classes, messageId: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId)
    const body: string = this.wsmanMessageCreator.createBody(Methods.ENUMERATE)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly pull = (action: AllActions, amtClass: AMT_Classes, messageId: string, enumerationContext: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId)
    const body: string = this.wsmanMessageCreator.createBody(Methods.PULL, enumerationContext)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly delete = (action: AllActions, amtClass: AMT_Classes, messageId: string, selector: Selector): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId, null, null, selector)
    const body: string = this.wsmanMessageCreator.createBody(Methods.DELETE)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly requestStateChange = (action: AllActions, amtClass: AMT_Classes, messageId: string, requestedState: number): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId)
    const body: string = this.wsmanMessageCreator.createBody(AMT_Methods.REQUEST_STATE_CHANGE, null, `${this.resourceUriBase}${amtClass}`, requestedState)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly amtSwitch = (amt: AMTCall): string => {
    switch (amt.method) {
      case Methods.GET:
        return this.get(Actions.GET, amt.class, amt.messageId)
      case Methods.PULL:
        if (amt.enumerationContext == null) { throw new Error(WSManErrors.ENUMERATION_CONTEXT) }
        return this.pull(Actions.PULL, amt.class, amt.messageId, amt.enumerationContext)
      case Methods.ENUMERATE:
        return this.enumerate(Actions.ENUMERATE, amt.class, amt.messageId)
      case Methods.DELETE:
        if (amt.selector == null) { throw new Error(WSManErrors.SELECTOR) }
        return this.delete(Actions.DELETE, amt.class, amt.messageId, amt.selector)
      case AMT_Methods.REQUEST_STATE_CHANGE:
        if (amt.requestedState == null) { throw new Error(WSManErrors.REQUESTED_STATE) }
        return this.requestStateChange(AMT_Actions.REQUEST_STATE_CHANGE, amt.class, amt.messageId, amt.requestedState)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  amt_AuditLog = (method: AMT_Methods.READ_RECORDS, messageId: string, startIndex: number): string => {
    let header: string, body: string
    switch (method) {
      case AMT_Methods.READ_RECORDS:
        header = this.wsmanMessageCreator.createHeader(AMT_Actions.READ_RECORDS, `${this.resourceUriBase}${AMT_Classes.AMT_AUDIT_LOG}`, messageId)
        body = `<Body><r:ReadRecords_INPUT xmlns:r="${this.resourceUriBase}${AMT_Classes.AMT_AUDIT_LOG}"><r:StartIndex>${startIndex}</r:StartIndex></r:ReadRecords_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  amt_RedirectionService = (method: Methods.GET, messageId: string): string => {
    return this.amtSwitch({ method: method, messageId: messageId, class: AMT_Classes.AMT_REDIRECTION_SERVICE })
  }

  amt_SetupAndConfigurationService = (method: Methods.GET, messageId: string): string => {
    return this.amtSwitch({ method: method, messageId: messageId, class: AMT_Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE })
  }

  amt_GeneralSettings = (method: Methods.GET, messageId: string): string => {
    return this.amtSwitch({ method: method, messageId: messageId, class: AMT_Classes.AMT_GENERAL_SETTINGS })
  }

  amt_EthernetPortSettings = (method: Methods.PULL | Methods.ENUMERATE | Methods.PUT, messageId: string, enumerationContext?: string, ethernetPortObject?: AMT_EthernetPortSettings): string => {
    switch (method) {
      case Methods.PULL:
      case Methods.ENUMERATE:
        return this.amtSwitch({ method: method, messageId: messageId, class: AMT_Classes.AMT_ETHERNET_PORT_SETTINGS, enumerationContext })
      case Methods.PUT: {
        if (ethernetPortObject == null) { throw new Error(WSManErrors.ETHERNET_PORT_OBJECT) }
        const selector: Selector = { name: 'InstanceID', value: ethernetPortObject.instanceId }
        const header = this.wsmanMessageCreator.createHeader(Actions.PUT, `${this.resourceUriBase}${AMT_Classes.AMT_ETHERNET_PORT_SETTINGS}`, messageId, null, null, selector)
        let body = `<Body><r:AMT_EthernetPortSettings xmlns:r="${this.resourceUriBase}${AMT_Classes.AMT_ETHERNET_PORT_SETTINGS}"><r:DHCPEnabled>${String(ethernetPortObject.dhcpEnabled)}</r:DHCPEnabled><r:ElementName>${ethernetPortObject.elementName}</r:ElementName><r:InstanceID>${ethernetPortObject.instanceId}</r:InstanceID><r:IpSyncEnabled>${String(ethernetPortObject.ipSyncEnabled)}</r:IpSyncEnabled><r:LinkIsUp>${String(ethernetPortObject.linkIsUp)}</r:LinkIsUp>`
        ethernetPortObject.linkPolicy.forEach(function (item) {
          body += `<r:LinkPolicy>${item}</r:LinkPolicy>`
        })
        body += `<r:MACAddress>${ethernetPortObject.macAddress}</r:MACAddress><r:PhysicalConnectionType>${ethernetPortObject.physicalConnectionType}</r:PhysicalConnectionType><r:SharedDynamicIP>${String(ethernetPortObject.sharedDynamicIp)}</r:SharedDynamicIP><r:SharedMAC>${String(ethernetPortObject.sharedMAC)}</r:SharedMAC><r:SharedStaticIp>${String(ethernetPortObject.sharedStaticIp)}</r:SharedStaticIp></r:AMT_EthernetPortSettings></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  amt_RemoteAccessPolicyRule = (method: Methods.DELETE, messageId: string, selector?: Selector): string => {
    return this.amtSwitch({ method: method, messageId: messageId, class: AMT_Classes.AMT_REMOTE_ACCESS_POLICY_RULE, selector: selector })
  }

  amt_ManagementPresenceRemoteSAP = (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.amtSwitch({ method: method, messageId: messageId, class: AMT_Classes.AMT_MANAGEMENT_PRESENCE_REMOTE_SAP, enumerationContext: enumerationContext })
  }

  amt_PublicKeyCertificate = (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.amtSwitch({ method: method, messageId: messageId, class: AMT_Classes.AMT_PUBLIC_KEY_CERTIFICATE, enumerationContext: enumerationContext })
  }

  amt_EnvironmentDetectionSettingData = (method: Methods.GET | Methods.PUT, messageId: string, environmentDetectionSettingData?: AMT_EnvironmentDetectionSettingData): string => {
    switch (method) {
      case Methods.GET:
        return this.amtSwitch({ method: method, messageId: messageId, class: AMT_Classes.AMT_ENVIRONMENT_DETECTION_SETTING_DATA })
      case Methods.PUT: {
        if (environmentDetectionSettingData == null) { throw new Error(WSManErrors.ENVIRONMENT_DETECTION_SETTING_DATA) }
        const selector: Selector = { name: 'InstanceID', value: environmentDetectionSettingData.instanceId }
        const header = this.wsmanMessageCreator.createHeader(Actions.PUT, `${this.resourceUriBase}${AMT_Classes.AMT_ENVIRONMENT_DETECTION_SETTING_DATA}`, messageId, null, null, selector)
        let body = `<Body><r:AMT_EnvironmentDetectionSettingData xmlns:r="${this.resourceUriBase}${AMT_Classes.AMT_ENVIRONMENT_DETECTION_SETTING_DATA}"><r:DetectionAlgorithm>${environmentDetectionSettingData.detectionAlgorithm}</r:DetectionAlgorithm><r:ElementName>${environmentDetectionSettingData.elementName}</r:ElementName><r:InstanceID>${environmentDetectionSettingData.instanceId}</r:InstanceID>`
        environmentDetectionSettingData.detectionStrings.forEach(function (item) {
          body += `<r:DetectionStrings>${item}</r:DetectionStrings>`
        })
        body += '</r:AMT_EnvironmentDetectionSettingData></Body>'
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  amt_PublicKeyManagementService = (method: AMT_Methods.ADD_TRUSTED_ROOT_CERTIFICATE, messageId: string, certificateBlob?: string): string => {
    switch (method) {
      case AMT_Methods.ADD_TRUSTED_ROOT_CERTIFICATE: {
        if (certificateBlob == null) { throw new Error(WSManErrors.CERTIFICATE_BLOB) }
        const header = this.wsmanMessageCreator.createHeader(AMT_Actions.ADD_TRUSTED_ROOT_CERTIFICATE, `${this.resourceUriBase}${AMT_Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE}`, messageId)
        const body = `<Body><r:AddTrustedRootCertificate_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><r:CertificateBlob>${certificateBlob}</r:CertificateBlob></r:AddTrustedRootCertificate_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  amt_RemoteAccessService = (method: AMT_Methods.ADD_MPS | AMT_Methods.ADD_REMOTE_ACCESS_POLICY_RULE, messageId: string, mpServer?: MPServer, remoteAccessPolicyRule?: RemoteAccessPolicyRule, selector?: Selector): string => {
    switch (method) {
      case AMT_Methods.ADD_MPS: {
        if (mpServer == null) { throw new Error(WSManErrors.MP_SERVER) }
        const header = this.wsmanMessageCreator.createHeader(AMT_Actions.ADD_MPS, `${this.resourceUriBase}${AMT_Classes.AMT_REMOTE_ACCESS_SERVICE}`, messageId)
        const body = `<Body><r:AddMpServer_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:AccessInfo>${mpServer.accessInfo}</r:AccessInfo><r:InfoFormat>${mpServer.infoFormat}</r:InfoFormat><r:Port>${mpServer.port}</r:Port><r:AuthMethod>${mpServer.authMethod}</r:AuthMethod><r:Username>${mpServer.username}</r:Username><r:Password>${mpServer.password}</r:Password><r:CN>${mpServer.commonName}</r:CN></r:AddMpServer_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case AMT_Methods.ADD_REMOTE_ACCESS_POLICY_RULE: {
        if (remoteAccessPolicyRule == null) { throw new Error(WSManErrors.REMOTE_ACCESS_POLICY_RULE) }
        if (selector == null) { throw new Error(WSManErrors.SELECTOR) }
        const header = this.wsmanMessageCreator.createHeader(AMT_Actions.ADD_REMOTE_ACCESS_POLICY_RULE, `${this.resourceUriBase}${AMT_Classes.AMT_REMOTE_ACCESS_SERVICE}`, messageId)
        const body = `<Body><r:AddRemoteAccessPolicyRule_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:Trigger>${remoteAccessPolicyRule.trigger}</r:Trigger><r:TunnelLifeTime>${remoteAccessPolicyRule.tunnelLifeTime}</r:TunnelLifeTime><r:ExtendedData>${remoteAccessPolicyRule.extendedData}</r:ExtendedData><r:MpServer><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="${selector.name}">${selector.value}</Selector></SelectorSet></ReferenceParameters></r:MpServer></r:AddRemoteAccessPolicyRule_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  amt_UserInitiatedConnectionService = (method: AMT_Methods.REQUEST_STATE_CHANGE, messageId: string, requestedState?: number): string => {
    return this.amtSwitch({ method: method, messageId: messageId, class: AMT_Classes.AMT_USER_INITIATED_CONNECTION_SERVICE, requestedState: requestedState })
  }

  amt_BootSettingData = (method: Methods.GET | Methods.PUT, messageId: string, bootSettingData?: AMT_BootSettingData): string => {
    switch (method) {
      case Methods.GET:
        return this.amtSwitch({ method: method, messageId: messageId, class: AMT_Classes.AMT_BOOT_SETTING_DATA })
      case Methods.PUT: {
        if (bootSettingData == null) { throw new Error(WSManErrors.BOOT_SETTING_DATA) }
        const header = this.wsmanMessageCreator.createHeader(Actions.PUT, `${this.resourceUriBase}${AMT_Classes.AMT_BOOT_SETTING_DATA}`, messageId)
        let body = '<Body><r:AMT_BootSettingData xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData">'
        bootSettingData.biosLastStatus?.forEach(function (item) {
          body += `<r:BIOSLastStatus>${item}</r:BIOSLastStatus>`
        })
        bootSettingData.uefiBootNumberOfParams?.forEach(function (item) {
          body += `<r:UEFIBootNumberOfParams>${item}</r:UEFIBootNumberOfParams>`
        })
        bootSettingData.uefiBootParametersArray?.forEach(function (item) {
          body += `<r:UEFIBootParametersArray>${item}</r:UEFIBootParametersArray>`
        })
        body += `<r:BIOSPause>${String(bootSettingData.biosPause)}</r:BIOSPause><r:BIOSSetup>${String(bootSettingData.biosSetup)}</r:BIOSSetup><r:BootMediaIndex>${bootSettingData.bootMediaIndex}</r:BootMediaIndex><r:ConfigurationDataReset>${String(bootSettingData.configurationDataReset)}</r:ConfigurationDataReset><r:ElementName>${bootSettingData.elementName}</r:ElementName><r:EnforceSecureBoot>${String(bootSettingData.enforceSecureBoot)}</r:EnforceSecureBoot><r:FirmwareVerbosity>${String(bootSettingData.firmwareVerbosity)}</r:FirmwareVerbosity><r:ForcedProgressEvents>${String(bootSettingData.forcedProgressEvents)}</r:ForcedProgressEvents><r:IDERBootDevice>${bootSettingData.iderBootDevice}</r:IDERBootDevice><r:InstanceID>${bootSettingData.instanceId}</r:InstanceID><r:LockKeyboard>${String(bootSettingData.lockKeyboard)}</r:LockKeyboard><r:LockPowerButton>${String(bootSettingData.lockPowerButton)}</r:LockPowerButton><r:LockResetButton>${String(bootSettingData.lockResetButton)}</r:LockResetButton><r:LockSleepButton>${String(bootSettingData.lockSleepButton)}</r:LockSleepButton><r:OptionsCleared>${String(bootSettingData.optionsCleared)}</r:OptionsCleared><r:OwningEntity>${bootSettingData.owningEntity}</r:OwningEntity><r:ReflashBIOS>${String(bootSettingData.reflashBIOS)}</r:ReflashBIOS><r:SecureErase>${String(bootSettingData.secureErase)}</r:SecureErase><r:UseIDER>${String(bootSettingData.useIDER)}</r:UseIDER><r:UseSOL>${String(bootSettingData.useSOL)}</r:UseSOL><r:UseSafeMode>${String(bootSettingData.useSafeMode)}</r:UseSafeMode><r:UserPasswordBypass>${String(bootSettingData.userPasswordBypass)}</r:UserPasswordBypass></r:AMT_BootSettingData></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }
}
