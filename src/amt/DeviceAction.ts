/*********************************************************************
* Copyright (c) Intel Corporation 2022
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { logger } from '../utils/logger'
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
    logger.silly('requesting getPowerState')
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.cim.ServiceAvailableToElement(CIM.Methods.ENUMERATE, messageId)
    const result = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody, messageId)
    const enumContext: string = result?.Envelope?.Body?.EnumerateResponse?.EnumerationContext
    if (enumContext == null) {
      logger.error('failed to pull CIM_ServiceAvailableToElement in get power state')
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.cim.ServiceAvailableToElement(CIM.Methods.PULL, messageId, enumContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.AssociatedPowerManagementService>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed getPowerState')
    return pullResponse.Envelope.Body
  }

  async getSoftwareIdentity (): Promise<Common.Models.Pull<CIM.Models.SoftwareIdentity>> {
    logger.silly('requesting getSoftwareIdentity enumeration')
    let messageId = (this.messageId++).toString()
    const result = await this.ciraHandler.Enumerate(this.ciraSocket, this.cim.SoftwareIdentity(CIM.Methods.ENUMERATE, messageId), messageId)
    console.log('getSoftwareIdentity enumeration result :', JSON.stringify(result, null, '\t'))
    const enumContext: string = result?.Envelope.Body?.EnumerateResponse?.EnumerationContext
    if (enumContext == null) {
      logger.error('failed to pull CIM_SoftwareIdentity in get version')
      return null
    }
    messageId = (this.messageId++).toString()
    logger.silly('requesting getSoftwareIdentity pull')
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.SoftwareIdentity>(this.ciraSocket, this.cim.SoftwareIdentity(CIM.Methods.PULL, messageId, enumContext), messageId)
    console.log('getSoftwareIdentity pullResponse :', JSON.stringify(pullResponse, null, '\t'))
    logger.silly('completed getSoftwareIdentity')
    return pullResponse.Envelope.Body
  }

  async getIpsOptInService (): Promise<IPS.Models.OptInServiceResponse> {
    logger.silly('requesting getIpsOptInService')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.ips.OptInService(IPS.Methods.GET, messageId)
    const result = await this.ciraHandler.Get<IPS.Models.OptInServiceResponse>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed getIpsOptInService')
    return result.Envelope.Body
  }

  async putIpsOptInService (data: IPS.Models.OptInServiceResponse): Promise<IPS.Models.OptInServiceResponse> {
    logger.silly('requesting putIpsOptInService')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.ips.OptInService(IPS.Methods.PUT, messageId, null, data)
    const result = await this.ciraHandler.Get<IPS.Models.OptInServiceResponse>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed putIpsOptInService')
    return result.Envelope.Body
  }

  async getRedirectionService (): Promise<AMT.Models.RedirectionResponse> {
    logger.silly('requesting getRedirectionService')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.RedirectionService(AMT.Methods.GET, messageId)
    const result = await this.ciraHandler.Get<AMT.Models.RedirectionResponse>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed getRedirectionService')
    return result.Envelope.Body
  }

  async setRedirectionService (requestState: number): Promise<any> {
    logger.silly('requesting setRedirectionService')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.RedirectionService(AMT.Methods.REQUEST_STATE_CHANGE, messageId, requestState)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed setRedirectionService')
    return result.Envelope.Body
  }

  async putRedirectionService (data: AMT.Models.RedirectionResponse): Promise<any> {
    logger.silly('requesting putRedirectionService')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.RedirectionService(AMT.Methods.PUT, messageId, null, data)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed putRedirectionService')
    return result.Envelope.Body
  }

  async getKvmRedirectionSap (): Promise<CIM.Models.KVMRedirectionSAPResponse> {
    logger.silly('requesting getKvmRedirectionSap')
    const messageId = (this.messageId++).toString()

    const xmlRequestBody = this.cim.KVMRedirectionSAP(CIM.Methods.GET, messageId)
    const result = await this.ciraHandler.Get<CIM.Models.KVMRedirectionSAPResponse>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed getKvmRedirectionSap')
    return result.Envelope.Body
  }

  async setKvmRedirectionSap (requestedState: number): Promise<any> {
    logger.silly('requesting setKvmRedirectionSap')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.cim.KVMRedirectionSAP(CIM.Methods.REQUEST_STATE_CHANGE, messageId, requestedState)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed setKvmRedirectionSap')
    return result.Envelope.Body
  }

  async forceBootMode (bootSource: string = 'Intel(r) AMT: Boot Configuration 0', role: number = 1): Promise<number> {
    logger.silly('requesting forceBootMode')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.cim.BootService(CIM.Methods.SET_BOOT_CONFIG_ROLE, messageId, bootSource, role)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed forceBootMode')
    return result
  }

  // todo: convert to string enum
  async changeBootOrder (bootSource: string): Promise<any> {
    logger.silly('requesting changeBootOrder')
    const messageId = (this.messageId++).toString()

    const bootChoice = `<Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootSourceSetting</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="InstanceID">Intel(r) AMT: ${bootSource}</Selector></SelectorSet></ReferenceParameters>`
    const xmlRequestBody = this.cim.BootConfigSetting(CIM.Methods.CHANGE_BOOT_ORDER, messageId, bootChoice)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed changeBootOrder')
    return result
  }

  async setBootConfiguration (data: AMT.Models.BootSettingData): Promise<any> {
    logger.silly('requesting setBootConfiguration')
    const messageId = (this.messageId++).toString()

    const xmlRequestBody = this.amt.BootSettingData(AMT.Methods.PUT, messageId, data)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed setBootConfiguration')
    return result.Envelope.Body
  }

  async getBootOptions (): Promise<AMT.Models.BootSettingDataResponse> {
    logger.silly('requesting getBootOptions')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.BootSettingData(AMT.Methods.GET, messageId)
    const result = await this.ciraHandler.Get<AMT.Models.BootSettingDataResponse>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed getBootOptions')
    return result.Envelope.Body
  }

  async sendPowerAction (powerState: number): Promise<CIM.Models.PowerActionResponse> {
    logger.silly('requesting sendPowerAction')
    const messageId = (this.messageId++).toString()
    const xmlToSend = this.cim.PowerManagementService(CIM.Methods.REQUEST_POWER_STATE_CHANGE, messageId, powerState)
    const result = await this.ciraHandler.Get<CIM.Models.PowerActionResponse>(this.ciraSocket, xmlToSend, messageId)
    logger.silly('completed sendPowerAction')
    return result.Envelope.Body
  }

  async getSetupAndConfigurationService (): Promise<Common.Models.Envelope<AMT.Models.SetupAndConfigurationService>> {
    logger.silly('requesting getSetupAndConfigurationService')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.SetupAndConfigurationService(AMT.Methods.GET, messageId)
    const getResponse = await this.ciraHandler.Get<AMT.Models.SetupAndConfigurationService>(this.ciraSocket, xmlRequestBody, messageId)
    console.log('getSetupAndConfigurationService result :', JSON.stringify(getResponse, null, '\t'))
    logger.silly('completed getSetupAndConfigurationService')
    return getResponse.Envelope
  }

  async getGeneralSettings (): Promise<Common.Models.Envelope<AMT.Models.GeneralSettingsResponse>> {
    logger.silly('requesting getGeneralSettings')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.GeneralSettings(AMT.Methods.GET, messageId)
    const getResponse = await this.ciraHandler.Get<AMT.Models.GeneralSettingsResponse>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed getGeneralSettings')
    return getResponse.Envelope
  }

  async getPowerCapabilities (): Promise<Common.Models.Envelope<AMT.Models.BootCapabilities>> {
    logger.silly('requesting getPowerCapabilities')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.BootCapabilities(AMT.Methods.GET, messageId)
    const result = await this.ciraHandler.Get<AMT.Models.BootCapabilities>(this.ciraSocket, xmlRequestBody, messageId)
    console.log(JSON.stringify(result))
    logger.silly('completed getPowerCapabilities')
    return result.Envelope
  }

  async requestUserConsentCode (): Promise<Common.Models.Envelope<IPS.Models.StartOptIn_OUTPUT>> {
    logger.silly('requesting requestUserConsentCode')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.ips.OptInService(IPS.Methods.START_OPT_IN, messageId)
    const getResponse = await this.ciraHandler.Get<IPS.Models.StartOptIn_OUTPUT>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed requestUserConsentCode')
    return getResponse.Envelope
  }

  async cancelUserConsentCode (): Promise<Common.Models.Envelope<IPS.Models.CancelOptIn_OUTPUT>> {
    logger.silly('requesting cancelUserConsentCode')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.ips.OptInService(IPS.Methods.CANCEL_OPT_IN, messageId)
    const getResponse = await this.ciraHandler.Get<IPS.Models.CancelOptIn_OUTPUT>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed cancelUserConsentCode')
    return getResponse.Envelope
  }

  async sendUserConsentCode (code: Number): Promise<Common.Models.Envelope<IPS.Models.SendOptInCode_OUTPUT>> {
    logger.silly('requesting sendUserConsentCode')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.ips.OptInService(IPS.Methods.SEND_OPT_IN_CODE, messageId, code)
    const getResponse = await this.ciraHandler.Get<IPS.Models.SendOptInCode_OUTPUT>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed sendUserConsentCode')
    return getResponse.Envelope
  }

  async getComputerSystemPackage (): Promise<Common.Models.Envelope<CIM.Models.ComputerSystemPackage>> {
    logger.silly('requesting getComputerSystemPackage')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.cim.ComputerSystemPackage(CIM.Methods.GET, messageId)
    const getResponse = await this.ciraHandler.Get<CIM.Models.ComputerSystemPackage>(this.ciraSocket, xmlRequestBody, messageId)
    console.log('getComputerSystemPackage getResponse :', JSON.stringify(getResponse, null, '\t'))
    logger.silly('completed getComputerSystemPackage')
    return getResponse.Envelope
  }

  async getChassis (): Promise<Common.Models.Envelope<CIM.Models.Chassis>> {
    logger.silly('requesting getChassis')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.cim.Chassis(CIM.Methods.GET, messageId)
    const getResponse = await this.ciraHandler.Get<CIM.Models.Chassis>(this.ciraSocket, xmlRequestBody, messageId)
    console.log('getChassis getChassis :', JSON.stringify(getResponse, null, '\t'))
    logger.silly('completed getChassis')
    return getResponse.Envelope
  }

  async getCard (): Promise<Common.Models.Envelope<CIM.Models.Card>> {
    logger.silly('requesting getCard')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.cim.Card(CIM.Methods.GET, messageId)
    const getResponse = await this.ciraHandler.Get<CIM.Models.Card>(this.ciraSocket, xmlRequestBody, messageId)
    console.log('getCard getResponse :', JSON.stringify(getResponse, null, '\t'))
    logger.silly('completed getCard')
    return getResponse.Envelope
  }

  async getBIOSElement (): Promise<Common.Models.Envelope<CIM.Models.BIOSElement>> {
    logger.silly('requesting getBIOSElement')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.cim.BIOSElement(CIM.Methods.GET, messageId)
    const getResponse = await this.ciraHandler.Get<CIM.Models.BIOSElement>(this.ciraSocket, xmlRequestBody, messageId)
    console.log('getBIOSElement getResponse :', JSON.stringify(getResponse, null, '\t'))
    logger.silly('completed getBIOSElement')
    return getResponse.Envelope
  }

  async getProcessor (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.Processor>>> {
    logger.silly('requesting getProcessor')
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.cim.Processor(CIM.Methods.ENUMERATE, messageId)
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody, messageId)
    if (enumResponse == null) {
      logger.error('failed to get CIM Processor')
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.cim.Processor(CIM.Methods.PULL, messageId, enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.Processor>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed getProcessor')
    return pullResponse.Envelope
  }

  async getPhysicalMemory (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.PhysicalMemory>>> {
    logger.silly('requesting getPhysicalMemory')
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.cim.PhysicalMemory(CIM.Methods.ENUMERATE, messageId)
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody, messageId)
    if (enumResponse == null) {
      logger.error('failed to get CIM PhysicalMemory')
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.cim.PhysicalMemory(CIM.Methods.PULL, messageId, enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.PhysicalMemory>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed getPhysicalMemory')
    return pullResponse.Envelope
  }

  async getMediaAccessDevice (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.MediaAccessDevice>>> {
    logger.silly('requesting getMediaAccessDevice')
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.cim.MediaAccessDevice(CIM.Methods.ENUMERATE, messageId)
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody, messageId)
    if (enumResponse == null) {
      logger.error('failed to get CIM Media Access Device')
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.cim.MediaAccessDevice(CIM.Methods.PULL, messageId, enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.MediaAccessDevice>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed getMediaAccessDevice')
    return pullResponse.Envelope
  }

  async getPhysicalPackage (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.PhysicalPackage>>> {
    logger.silly('requesting getPhysicalPackage')
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.cim.PhysicalPackage(CIM.Methods.ENUMERATE, messageId)
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody, messageId)
    if (enumResponse == null) {
      logger.error('failed to get CIM Physical Package')
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.cim.PhysicalPackage(CIM.Methods.PULL, messageId, enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.PhysicalPackage>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed getPhysicalPackage')
    return pullResponse.Envelope
  }

  async getSystemPackaging (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.SystemPackaging>>> {
    logger.silly('requesting getSystemPackaging')
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.cim.SystemPackaging(CIM.Methods.ENUMERATE, messageId)
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody, messageId)
    if (enumResponse == null) {
      logger.error('failed to get CIM System Packaging')
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.cim.SystemPackaging(CIM.Methods.PULL, messageId, enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.SystemPackaging>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed getSystemPackaging')
    return pullResponse.Envelope
  }

  async getChip (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.Chip>>> {
    logger.silly('requesting getChip')
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.cim.Chip(CIM.Methods.ENUMERATE, messageId)
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody, messageId)
    if (enumResponse == null) {
      logger.error('failed to get CIM Chip')
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.cim.Chip(CIM.Methods.PULL, messageId, enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.Chip>(this.ciraSocket, xmlRequestBody, messageId)
    logger.silly('completed getChip')
    return pullResponse.Envelope
  }

  async getEventLog (): Promise<Common.Models.Envelope<AMT.Models.MessageLog>> {
    logger.silly('requesting getEventLog')
    let messageId = (this.messageId++).toString()
    let xmlRequestBody = this.amt.MessageLog(AMT.Methods.POSITION_TO_FIRSTRECORD, messageId)
    const response = await this.ciraHandler.Get<{PositionToFirstRecord_OUTPUT: {
      IterationIdentifier: string
      ReturnValue: string
    }}>(this.ciraSocket, xmlRequestBody, messageId)
    if (response == null) {
      logger.error('failed to get position to first record of AMT_MessageLog')
      return null
    }
    messageId = (this.messageId++).toString()
    xmlRequestBody = this.amt.MessageLog(AMT.Methods.GET_RECORDS, messageId, Number(response.Envelope.Body.PositionToFirstRecord_OUTPUT.IterationIdentifier))
    const eventLogs = await this.ciraHandler.Get<AMT.Models.MessageLog>(this.ciraSocket, xmlRequestBody, messageId)
    console.log('getEventLog response :', JSON.stringify(eventLogs, null, '\t'))

    logger.silly('completed getEventLog')
    return eventLogs.Envelope
  }

  async getAuditLog (startIndex: number): Promise<AMT.Models.AuditLog_ReadRecords> {
    logger.silly('requesting getAuditLog')
    const messageId = (this.messageId++).toString()
    const xmlRequestBody = this.amt.AuditLog(AMT.Methods.READ_RECORDS, messageId, startIndex)
    const getResponse = await this.ciraHandler.Get<AMT.Models.AuditLog_ReadRecords>(this.ciraSocket, xmlRequestBody, messageId)
    console.log('getAuditLog response :', JSON.stringify(getResponse, null, '\t'))

    if (getResponse == null) {
      logger.error('failed to get audit log')
      throw new Error('unable to retrieve audit log')
    }
    logger.silly('completed getAuditLog')
    return getResponse.Envelope.Body
  }
}
