import { CIRASocket } from '../models/models'
import { Methods as CIM_Methods, CIM } from './cim/index'
import { HttpHandler } from './HttpHandler'
import { CIRAChannel, CIRAHandler } from './CIRAHandler'
import { logger } from '../utils/logger'
import { Methods as AMT_Methods, AMT } from './amt/index'
import { Methods as IPS_Methods, IPS } from './ips/index'
import {
  CIM_AssociatedPowerManagementService,
  CIM_BIOSElement,
  CIM_Card,
  CIM_Chassis,
  CIM_Chip,
  CIM_ComputerSystemPackage,
  CIM_KVMRedirectionSAPResponse,
  CIM_MediaAccessDevice,
  CIM_PhysicalMemory,
  CIM_PhysicalPackage,
  CIM_Processor,
  CIM_SoftwareIdentity,
  CIM_SystemPackaging,
  PowerActionResponse
} from './models/cim_models'

import { AMT_BootCapabilities, AMT_SetupAndConfigurationService, AMT_AuditLog_ReadRecords, AMT_MessageLog, AMT_BootSettingData, AMT_BootSettingDataResponse, AMT_RedirectionResponse, AMT_GeneralSettingsResponse } from './models/amt_models'

import { Envelope, Pull } from './models/common'
import { CancelOptIn_OUTPUT, IPS_OptInServiceResponse, SendOptInCode_OUTPUT, StartOptIn_OUTPUT } from './models/ips_models'
export class ConnectedDevice {
  isConnected: boolean = false
  httpHandler: HttpHandler
  ciraHandler: CIRAHandler
  ciraChannel: CIRAChannel
  ciraSocket: CIRASocket
  messageId: number = 0
  cim: CIM
  amt: AMT
  ips: IPS

  constructor (ciraSocket: CIRASocket, private readonly username: string, private readonly password: string) {
    this.cim = new CIM()
    this.amt = new AMT()
    this.ips = new IPS()
    this.ciraSocket = ciraSocket
    this.httpHandler = new HttpHandler()
    this.ciraHandler = new CIRAHandler(this.httpHandler, username, password)
  }

  async getPowerState (): Promise<Pull<CIM_AssociatedPowerManagementService>> {
    let xmlRequestBody = this.cim.ServiceAvailableToElement(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const result = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    const enumContext: string = result?.Envelope?.Body?.EnumerateResponse?.EnumerationContext
    if (enumContext == null) {
      logger.error('failed to pull CIM_ServiceAvailableToElement in get power state')
      return null
    }
    xmlRequestBody = this.cim.ServiceAvailableToElement(CIM_Methods.PULL, (this.messageId++).toString(), enumContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_AssociatedPowerManagementService>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope.Body
  }

  async getSoftwareIdentity (): Promise<Pull<CIM_SoftwareIdentity>> {
    let xmlRequestBody = this.cim.SoftwareIdentity(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const result = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    const enumContext: string = result?.Envelope.Body?.EnumerateResponse?.EnumerationContext
    if (enumContext == null) {
      logger.error('failed to pull CIM_SoftwareIdentity in get version')
      return null
    }
    xmlRequestBody = this.cim.SoftwareIdentity(CIM_Methods.PULL, (this.messageId++).toString(), enumContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_SoftwareIdentity>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope.Body
  }

  async getIpsOptInService (): Promise<IPS_OptInServiceResponse> {
    const xmlRequestBody = this.ips.OptInService(IPS_Methods.GET, (this.messageId++).toString())
    const result = await this.ciraHandler.Get<IPS_OptInServiceResponse>(this.ciraSocket, xmlRequestBody)
    return result.Envelope.Body
  }

  async getRedirectionService (): Promise<AMT_RedirectionResponse> {
    const xmlRequestBody = this.amt.RedirectionService(AMT_Methods.GET, (this.messageId++).toString())
    const result = await this.ciraHandler.Get<AMT_RedirectionResponse>(this.ciraSocket, xmlRequestBody)
    return result.Envelope.Body
  }

  async getKvmRedirectionSap (): Promise<CIM_KVMRedirectionSAPResponse> {
    const xmlRequestBody = this.cim.KVMRedirectionSAP(CIM_Methods.GET, (this.messageId++).toString())
    const result = await this.ciraHandler.Get<CIM_KVMRedirectionSAPResponse>(this.ciraSocket, xmlRequestBody)
    return result.Envelope.Body
  }

  async forceBootMode (bootSource: string = 'Intel(r) AMT: Boot Configuration 0', role: number = 1): Promise<number> {
    const xmlRequestBody = this.cim.BootService(CIM_Methods.SET_BOOT_CONFIG_ROLE, (this.messageId++).toString(), bootSource, role)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody)
    return result
  }

  // todo: convert to string enum
  async changeBootOrder (bootSource: string): Promise<any> {
    const bootChoice = `<Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootSourceSetting</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="InstanceID">Intel(r) AMT: ${bootSource}</Selector></SelectorSet></ReferenceParameters>`
    const xmlRequestBody = this.cim.BootConfigSetting(CIM_Methods.CHANGE_BOOT_ORDER, (this.messageId++).toString(), bootChoice)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody)
    return result
  }

  async setBootConfiguration (data: AMT_BootSettingData): Promise<any> {
    const xmlRequestBody = this.amt.BootSettingData(AMT_Methods.PUT, (this.messageId++).toString(), data)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody)
    return result.Envelope.Body
  }

  async getBootOptions (): Promise<AMT_BootSettingDataResponse> {
    const xmlRequestBody = this.amt.BootSettingData(AMT_Methods.GET, (this.messageId++).toString())
    const result = await this.ciraHandler.Get<AMT_BootSettingDataResponse>(this.ciraSocket, xmlRequestBody)
    return result.Envelope.Body
  }

  async sendPowerAction (powerState: number): Promise<PowerActionResponse> {
    const cim = new CIM()
    const xmlToSend = cim.PowerManagementService(CIM_Methods.REQUEST_POWER_STATE_CHANGE, (this.messageId++).toString(), powerState)
    const result = await this.ciraHandler.Get<PowerActionResponse>(this.ciraSocket, xmlToSend)
    return result.Envelope.Body
  }

  async getSetupAndConfigurationService (): Promise<Envelope<AMT_SetupAndConfigurationService>> {
    const xmlRequestBody = this.amt.SetupAndConfigurationService(AMT_Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<AMT_SetupAndConfigurationService>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async getGeneralSettings (): Promise<Envelope<AMT_GeneralSettingsResponse>> {
    const xmlRequestBody = this.amt.GeneralSettings(AMT_Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<AMT_GeneralSettingsResponse>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async getPowerCapabilities (): Promise<Envelope<AMT_BootCapabilities>> {
    const xmlRequestBody = this.amt.BootCapabilities(AMT_Methods.GET, (this.messageId++).toString())
    const result = await this.ciraHandler.Get<AMT_BootCapabilities>(this.ciraSocket, xmlRequestBody)
    console.log(JSON.stringify(result))
    return result.Envelope
  }

  async requestUserConsentCode (): Promise<Envelope<StartOptIn_OUTPUT>> {
    const xmlRequestBody = this.ips.OptInService(IPS_Methods.START_OPT_IN, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<StartOptIn_OUTPUT>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async cancelUserConsentCode (): Promise<Envelope<CancelOptIn_OUTPUT>> {
    const xmlRequestBody = this.ips.OptInService(IPS_Methods.CANCEL_OPT_IN, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<CancelOptIn_OUTPUT>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async sendUserConsentCode (code: Number): Promise<Envelope<SendOptInCode_OUTPUT>> {
    const xmlRequestBody = this.ips.OptInService(IPS_Methods.SEND_OPT_IN_CODE, (this.messageId++).toString(), code)
    const getResponse = await this.ciraHandler.Get<SendOptInCode_OUTPUT>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async getComputerSystemPackage (): Promise<Envelope<CIM_ComputerSystemPackage>> {
    const xmlRequestBody = this.cim.ComputerSystemPackage(CIM_Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<CIM_ComputerSystemPackage>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async getChassis (): Promise<Envelope<CIM_Chassis>> {
    const xmlRequestBody = this.cim.Chassis(CIM_Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<CIM_Chassis>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async getCard (): Promise<Envelope<CIM_Card>> {
    const xmlRequestBody = this.cim.Card(CIM_Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<CIM_Card>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async getBIOSElement (): Promise<Envelope<CIM_BIOSElement>> {
    const xmlRequestBody = this.cim.BIOSElement(CIM_Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<CIM_BIOSElement>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async getProcessor (): Promise<Envelope<Pull<CIM_Processor>>> {
    let xmlRequestBody = this.cim.Processor(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM Processor')
      return null
    }
    xmlRequestBody = this.cim.Processor(CIM_Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_Processor>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope
  }

  async getPhysicalMemory (): Promise<Envelope<Pull<CIM_PhysicalMemory>>> {
    let xmlRequestBody = this.cim.PhysicalMemory(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM PhysicalMemory')
      return null
    }
    xmlRequestBody = this.cim.PhysicalMemory(CIM_Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_PhysicalMemory>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope
  }

  async getMediaAccessDevice (): Promise<Envelope<Pull<CIM_MediaAccessDevice>>> {
    let xmlRequestBody = this.cim.MediaAccessDevice(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM Media Access Device')
      return null
    }
    xmlRequestBody = this.cim.MediaAccessDevice(CIM_Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_MediaAccessDevice>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope
  }

  async getPhysicalPackage (): Promise<Envelope<Pull<CIM_PhysicalPackage>>> {
    let xmlRequestBody = this.cim.PhysicalPackage(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM Physical Package')
      return null
    }
    xmlRequestBody = this.cim.PhysicalPackage(CIM_Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_PhysicalPackage>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope
  }

  async getSystemPackaging (): Promise<Envelope<Pull<CIM_SystemPackaging>>> {
    let xmlRequestBody = this.cim.SystemPackaging(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM System Packaging')
      return null
    }
    xmlRequestBody = this.cim.SystemPackaging(CIM_Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_SystemPackaging>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope
  }

  async getChip (): Promise<Envelope<Pull<CIM_Chip>>> {
    let xmlRequestBody = this.cim.Chip(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM Chip')
      return null
    }
    xmlRequestBody = this.cim.Chip(CIM_Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_Chip>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope
  }

  async getEventLog (): Promise<Envelope<AMT_MessageLog>> {
    let xmlRequestBody = this.amt.MessageLog(AMT_Methods.POSITION_TO_FIRSTRECORD, (this.messageId++).toString())
    const response = await this.ciraHandler.Get<{PositionToFirstRecord_OUTPUT: {
      IterationIdentifier: string
      ReturnValue: string
    }}>(this.ciraSocket, xmlRequestBody)
    if (response == null) {
      logger.error('failed to get position to first record of AMT_MessageLog')
      return null
    }
    xmlRequestBody = this.amt.MessageLog(AMT_Methods.GET_RECORDS, (this.messageId++).toString(), Number(response.Envelope.Body.PositionToFirstRecord_OUTPUT.IterationIdentifier))
    const eventLogs = await this.ciraHandler.Get<AMT_MessageLog>(this.ciraSocket, xmlRequestBody)
    return eventLogs.Envelope
  }

  async getAuditLog (startIndex: number): Promise<AMT_AuditLog_ReadRecords> {
    const xmlRequestBody = this.amt.AuditLog(AMT_Methods.READ_RECORDS, (this.messageId++).toString(), startIndex)
    const getResponse = await this.ciraHandler.Get<AMT_AuditLog_ReadRecords>(this.ciraSocket, xmlRequestBody)
    if (getResponse == null) {
      logger.error('failed to get audit log')
      throw new Error('unable to retrieve audit log')
    }
    return getResponse.Envelope.Body
  }
}
