/*********************************************************************
* Copyright (c) Intel Corporation 2022
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { logger, messages } from '../logging'
import { CIRAHandler } from './CIRAHandler'
import { AMT, CIM, IPS, Common } from '@open-amt-cloud-toolkit/wsman-messages/dist/index'
import { CIRASocket } from '../models/models'

export class DeviceAction {
  ciraHandler: CIRAHandler
  ciraSocket: CIRASocket
  messageId: number = 0
  cim: CIM.CIM
  amt: AMT.AMT
  ips: IPS.IPS
  constructor (ciraHandler: CIRAHandler, ciraSocket: CIRASocket) {
    this.ciraHandler = ciraHandler
    this.ciraSocket = ciraSocket
    this.cim = new CIM.CIM()
    this.amt = new AMT.AMT()
    this.ips = new IPS.IPS()
  }

  async getPowerState (): Promise<Common.Models.Pull<CIM.Models.AssociatedPowerManagementService>> {
    logger.silly(`getPowerState ${messages.REQUEST}`)
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.cim.ServiceAvailableToElement(CIM.Methods.ENUMERATE, messageId)
    const result = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody, messageId)
    const enumContext: string = result?.Envelope?.Body?.EnumerateResponse?.EnumerationContext
    if (enumContext == null) {
      logger.error(`getPowerState failed. Reason: ${messages.ENUMERATION_RESPONSE_NULL}`)
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.cim.ServiceAvailableToElement(CIM.Methods.PULL, messageId, enumContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.AssociatedPowerManagementService>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`getPowerState ${messages.COMPLETE}`)
    return pullResponse.Envelope.Body
  }

  async getSoftwareIdentity (): Promise<Common.Models.Pull<CIM.Models.SoftwareIdentity>> {
    logger.silly(`getSoftwareIdentity enumeration ${messages.REQUEST}`)
    let messageId = (this.messageId++).toString()
    const result = await this.ciraHandler.Enumerate(this.ciraSocket, this.cim.SoftwareIdentity(CIM.Methods.ENUMERATE, messageId), messageId)
    logger.info('getSoftwareIdentity enumeration result :', JSON.stringify(result, null, '\t'))
    const enumContext: string = result?.Envelope.Body?.EnumerateResponse?.EnumerationContext
    if (enumContext == null) {
      logger.error(`getSoftwareIdentity failed. Reason: ${messages.ENUMERATION_RESPONSE_NULL}`)
      return null
    }
    messageId = (this.messageId++).toString()
    logger.silly(`getSoftwareIdentity pull ${messages.REQUEST}`)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.SoftwareIdentity>(this.ciraSocket, this.cim.SoftwareIdentity(CIM.Methods.PULL, messageId, enumContext), messageId)
    logger.info('getSoftwareIdentity pullResponse :', JSON.stringify(pullResponse, null, '\t'))
    logger.silly(`getSoftwareIdentity ${messages.COMPLETE}`)
    return pullResponse.Envelope.Body
  }

  async getIpsOptInService (): Promise<IPS.Models.OptInServiceResponse> {
    logger.silly(`getIpsOptInService ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.ips.OptInService(IPS.Methods.GET, messageId)
    const result = await this.ciraHandler.Get<IPS.Models.OptInServiceResponse>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`getIpsOptInService ${messages.COMPLETE}`)
    return result.Envelope.Body
  }

  async putIpsOptInService (data: IPS.Models.OptInServiceResponse): Promise<IPS.Models.OptInServiceResponse> {
    logger.silly(`putIpsOptInService ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.ips.OptInService(IPS.Methods.PUT, messageId, null, data)
    const result = await this.ciraHandler.Get<IPS.Models.OptInServiceResponse>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`putIpsOptInService ${messages.COMPLETE}`)
    return result.Envelope.Body
  }

  async getRedirectionService (): Promise<AMT.Models.RedirectionResponse> {
    logger.silly(`getRedirectionService ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.RedirectionService(AMT.Methods.GET, messageId)
    const result = await this.ciraHandler.Get<AMT.Models.RedirectionResponse>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`getRedirectionService ${messages.COMPLETE}`)
    return result.Envelope.Body
  }

  async setRedirectionService (requestState: number): Promise<any> {
    logger.silly(`setRedirectionService ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.RedirectionService(AMT.Methods.REQUEST_STATE_CHANGE, messageId, requestState)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`setRedirectionService ${messages.COMPLETE}`)
    return result.Envelope.Body
  }

  async putRedirectionService (data: AMT.Models.RedirectionResponse): Promise<any> {
    logger.silly(`putRedirectionService ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.RedirectionService(AMT.Methods.PUT, messageId, null, data)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`putRedirectionService ${messages.COMPLETE}`)
    return result.Envelope.Body
  }

  async getKvmRedirectionSap (): Promise<CIM.Models.KVMRedirectionSAPResponse> {
    logger.silly(`getKvmRedirectionSap ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.cim.KVMRedirectionSAP(CIM.Methods.GET, messageId)
    const result = await this.ciraHandler.Get<CIM.Models.KVMRedirectionSAPResponse>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`getKvmRedirectionSap ${messages.COMPLETE}`)
    return result.Envelope.Body
  }

  async setKvmRedirectionSap (requestedState: number): Promise<any> {
    logger.silly(`setKvmRedirectionSap ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.cim.KVMRedirectionSAP(CIM.Methods.REQUEST_STATE_CHANGE, messageId, requestedState)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`setKvmRedirectionSap ${messages.COMPLETE}`)
    return result.Envelope.Body
  }

  async forceBootMode (bootSource: string = 'Intel(r) AMT: Boot Configuration 0', role: number = 1): Promise<number> {
    logger.silly(`forceBootMode ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.cim.BootService(CIM.Methods.SET_BOOT_CONFIG_ROLE, messageId, bootSource, role)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`forceBootMode ${messages.COMPLETE}`)
    return result
  }

  async changeBootOrder (bootSource: string): Promise<any> {
    logger.silly(`changeBootOrder ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    // TODO: convert to string enum
    const bootChoice = `<Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootSourceSetting</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="InstanceID">Intel(r) AMT: ${bootSource}</Selector></SelectorSet></ReferenceParameters>`
    const xmlRequestBody = this.cim.BootConfigSetting(CIM.Methods.CHANGE_BOOT_ORDER, messageId, bootChoice)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`changeBootOrder ${messages.COMPLETE}`)
    return result
  }

  async setBootConfiguration (data: AMT.Models.BootSettingData): Promise<any> {
    logger.silly(`setBootConfiguration ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.BootSettingData(AMT.Methods.PUT, messageId, data)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`setBootConfiguration ${messages.COMPLETE}`)
    return result.Envelope.Body
  }

  async getBootOptions (): Promise<AMT.Models.BootSettingDataResponse> {
    logger.silly(`getBootOptions ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.BootSettingData(AMT.Methods.GET, messageId)
    const result = await this.ciraHandler.Get<AMT.Models.BootSettingDataResponse>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`getBootOptions ${messages.COMPLETE}`)
    return result.Envelope.Body
  }

  async sendPowerAction (powerState: number): Promise<CIM.Models.PowerActionResponse> {
    logger.silly(`sendPowerAction ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlToSend = this.cim.PowerManagementService(CIM.Methods.REQUEST_POWER_STATE_CHANGE, messageId, powerState)
    const result = await this.ciraHandler.Get<CIM.Models.PowerActionResponse>(this.ciraSocket, xmlToSend, messageId)
    logger.silly(`sendPowerAction ${messages.COMPLETE}`)
    return result.Envelope.Body
  }

  async getSetupAndConfigurationService (): Promise<Common.Models.Envelope<AMT.Models.SetupAndConfigurationService>> {
    logger.silly(`getSetupAndConfigurationService ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.SetupAndConfigurationService(AMT.Methods.GET, messageId)
    const getResponse = await this.ciraHandler.Get<AMT.Models.SetupAndConfigurationService>(this.ciraSocket, xmlRequestBody, messageId)
    logger.info('getSetupAndConfigurationService result :', JSON.stringify(getResponse, null, '\t'))
    logger.silly(`getSetupAndConfigurationService ${messages.COMPLETE}`)
    return getResponse.Envelope
  }

  async getGeneralSettings (): Promise<Common.Models.Envelope<AMT.Models.GeneralSettingsResponse>> {
    logger.silly(`getGeneralSettings ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.GeneralSettings(AMT.Methods.GET, messageId)
    const getResponse = await this.ciraHandler.Get<AMT.Models.GeneralSettingsResponse>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`getGeneralSettings ${messages.COMPLETE}`)
    return getResponse.Envelope
  }

  async getPowerCapabilities (): Promise<Common.Models.Envelope<AMT.Models.BootCapabilities>> {
    logger.silly(`getPowerCapabilities ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.BootCapabilities(AMT.Methods.GET, messageId)
    const result = await this.ciraHandler.Get<AMT.Models.BootCapabilities>(this.ciraSocket, xmlRequestBody, messageId)
    logger.info(JSON.stringify(result))
    logger.silly(`getPowerCapabilities ${messages.COMPLETE}`)
    return result.Envelope
  }

  async requestUserConsentCode (): Promise<Common.Models.Envelope<IPS.Models.StartOptIn_OUTPUT>> {
    logger.silly(`requestUserConsentCode ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.ips.OptInService(IPS.Methods.START_OPT_IN, messageId)
    const getResponse = await this.ciraHandler.Get<IPS.Models.StartOptIn_OUTPUT>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`requestUserConsentCode ${messages.COMPLETE}`)
    return getResponse.Envelope
  }

  async cancelUserConsentCode (): Promise<Common.Models.Envelope<IPS.Models.CancelOptIn_OUTPUT>> {
    logger.silly(`cancelUserConsentCode ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.ips.OptInService(IPS.Methods.CANCEL_OPT_IN, messageId)
    const getResponse = await this.ciraHandler.Get<IPS.Models.CancelOptIn_OUTPUT>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`cancelUserConsentCode ${messages.COMPLETE}`)
    return getResponse.Envelope
  }

  async sendUserConsentCode (code: Number): Promise<Common.Models.Envelope<IPS.Models.SendOptInCode_OUTPUT>> {
    logger.silly(`sendUserConsentCode ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.ips.OptInService(IPS.Methods.SEND_OPT_IN_CODE, messageId, code)
    const getResponse = await this.ciraHandler.Get<IPS.Models.SendOptInCode_OUTPUT>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`sendUserConsentCode ${messages.COMPLETE}`)
    return getResponse.Envelope
  }

  async getComputerSystemPackage (): Promise<Common.Models.Envelope<CIM.Models.ComputerSystemPackage>> {
    logger.silly(`getComputerSystemPackage ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.cim.ComputerSystemPackage(CIM.Methods.GET, messageId)
    const getResponse = await this.ciraHandler.Get<CIM.Models.ComputerSystemPackage>(this.ciraSocket, xmlRequestBody, messageId)
    logger.info('getComputerSystemPackage getResponse :', JSON.stringify(getResponse, null, '\t'))
    logger.silly(`getComputerSystemPackage ${messages.COMPLETE}`)
    return getResponse.Envelope
  }

  async getChassis (): Promise<Common.Models.Envelope<CIM.Models.Chassis>> {
    logger.silly(`getChassis ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.cim.Chassis(CIM.Methods.GET, messageId)
    const getResponse = await this.ciraHandler.Get<CIM.Models.Chassis>(this.ciraSocket, xmlRequestBody, messageId)
    logger.info('getChassis getChassis :', JSON.stringify(getResponse, null, '\t'))
    logger.silly(`getChassis ${messages.COMPLETE}`)
    return getResponse.Envelope
  }

  async getCard (): Promise<Common.Models.Envelope<CIM.Models.Card>> {
    logger.silly(`getCard ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.cim.Card(CIM.Methods.GET, messageId)
    const getResponse = await this.ciraHandler.Get<CIM.Models.Card>(this.ciraSocket, xmlRequestBody, messageId)
    logger.info('getCard getResponse :', JSON.stringify(getResponse, null, '\t'))
    logger.silly(`getCard ${messages.COMPLETE}`)
    return getResponse.Envelope
  }

  async getBIOSElement (): Promise<Common.Models.Envelope<CIM.Models.BIOSElement>> {
    logger.silly(`getBIOSElement ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.cim.BIOSElement(CIM.Methods.GET, messageId)
    const getResponse = await this.ciraHandler.Get<CIM.Models.BIOSElement>(this.ciraSocket, xmlRequestBody, messageId)
    logger.info('getBIOSElement getResponse :', JSON.stringify(getResponse, null, '\t'))
    logger.silly(`getBIOSElement ${messages.COMPLETE}`)
    return getResponse.Envelope
  }

  async getProcessor (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.Processor>>> {
    logger.silly(`getProcessor ${messages.REQUEST}`)
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.cim.Processor(CIM.Methods.ENUMERATE, messageId)
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody, messageId)
    if (enumResponse == null) {
      logger.error(`getProcessor failed. Reason: ${messages.ENUMERATION_RESPONSE_NULL}`)
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.cim.Processor(CIM.Methods.PULL, messageId, enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.Processor>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`getProcessor ${messages.COMPLETE}`)
    return pullResponse.Envelope
  }

  async getPhysicalMemory (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.PhysicalMemory>>> {
    logger.silly(`getPhysicalMemory ${messages.REQUEST}`)
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.cim.PhysicalMemory(CIM.Methods.ENUMERATE, messageId)
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody, messageId)
    if (enumResponse == null) {
      logger.error(`getPhysicalMemory failed. Reason: ${messages.ENUMERATION_RESPONSE_NULL}`)
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.cim.PhysicalMemory(CIM.Methods.PULL, messageId, enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.PhysicalMemory>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`getPhysicalMemory ${messages.COMPLETE}`)
    return pullResponse.Envelope
  }

  async getMediaAccessDevice (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.MediaAccessDevice>>> {
    logger.silly(`getMediaAccessDevice ${messages.REQUEST}`)
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.cim.MediaAccessDevice(CIM.Methods.ENUMERATE, messageId)
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody, messageId)
    if (enumResponse == null) {
      logger.error(`getMediaAccessDevice failed. Reason: ${messages.ENUMERATION_RESPONSE_NULL}`)
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.cim.MediaAccessDevice(CIM.Methods.PULL, messageId, enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.MediaAccessDevice>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`getMediaAccessDevice ${messages.COMPLETE}`)
    return pullResponse.Envelope
  }

  async getPhysicalPackage (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.PhysicalPackage>>> {
    logger.silly(`getPhysicalPackage ${messages.REQUEST}`)
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.cim.PhysicalPackage(CIM.Methods.ENUMERATE, messageId)
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody, messageId)
    if (enumResponse == null) {
      logger.error(`getPhysicalPackage failed. Reason: ${messages.ENUMERATION_RESPONSE_NULL}`)
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.cim.PhysicalPackage(CIM.Methods.PULL, messageId, enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.PhysicalPackage>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`getPhysicalPackage ${messages.COMPLETE}`)
    return pullResponse.Envelope
  }

  async getSystemPackaging (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.SystemPackaging>>> {
    logger.silly(`getSystemPackaging ${messages.REQUEST}`)
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.cim.SystemPackaging(CIM.Methods.ENUMERATE, messageId)
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody, messageId)
    if (enumResponse == null) {
      logger.error(`getSystemPackaging failed. Reason: ${messages.ENUMERATION_RESPONSE_NULL}`)
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.cim.SystemPackaging(CIM.Methods.PULL, messageId, enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.SystemPackaging>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`getSystemPackaging ${messages.COMPLETE}`)
    return pullResponse.Envelope
  }

  async getChip (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.Chip>>> {
    logger.silly(`getChip ${messages.REQUEST}`)
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.cim.Chip(CIM.Methods.ENUMERATE, messageId)
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody, messageId)
    if (enumResponse == null) {
      logger.error(`getChip failed. Reason: ${messages.ENUMERATION_RESPONSE_NULL}`)
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.cim.Chip(CIM.Methods.PULL, messageId, enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.Chip>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly(`getChip ${messages.COMPLETE}`)
    return pullResponse.Envelope
  }

  async getEventLog (): Promise<Common.Models.Envelope<AMT.Models.MessageLog>> {
    logger.silly(`getEventLog ${messages.REQUEST}`)
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.amt.MessageLog(AMT.Methods.POSITION_TO_FIRSTRECORD, messageId)
    const response = await this.ciraHandler.Get<{PositionToFirstRecord_OUTPUT: {
      IterationIdentifier: string
      ReturnValue: string
    }}>(this.ciraSocket, xmlRequestBody, messageId)
    if (response == null) {
      logger.error(`failed to get position to first record of AMT_MessageLog. Reason: ${messages.RESPONSE_NULL}`)
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.amt.MessageLog(AMT.Methods.GET_RECORDS, messageId, Number(response.Envelope.Body.PositionToFirstRecord_OUTPUT.IterationIdentifier))
    const eventLogs = await this.ciraHandler.Get<AMT.Models.MessageLog>(this.ciraSocket, xmlRequestBody, messageId)
    logger.info('getEventLog response :', JSON.stringify(eventLogs, null, '\t'))
    logger.silly(`getEventLog ${messages.COMPLETE}`)
    return eventLogs.Envelope
  }

  async getAuditLog (startIndex: number): Promise<AMT.Models.AuditLog_ReadRecords> {
    logger.silly(`getAuditLog ${messages.REQUEST}`)
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.AuditLog(AMT.Methods.READ_RECORDS, messageId, startIndex)
    const getResponse = await this.ciraHandler.Get<AMT.Models.AuditLog_ReadRecords>(this.ciraSocket, xmlRequestBody, messageId)
    logger.info('getAuditLog response :', JSON.stringify(getResponse, null, '\t'))

    if (getResponse == null) {
      logger.error(`failed to get audit log. Reason: ${messages.RESPONSE_NULL}`)
      throw new Error('unable to retrieve audit log')
    }
    logger.silly(`getAuditLog ${messages.COMPLETE}`)
    return getResponse.Envelope.Body
  }
}
