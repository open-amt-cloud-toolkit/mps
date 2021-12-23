import { CIRASocket } from '../models/models'
import { AMT, CIM, IPS, Common } from '@open-amt-cloud-toolkit/wsman-messages/dist/index'
import { HttpHandler } from './HttpHandler'
import { CIRAChannel, CIRAHandler } from './CIRAHandler'
import { logger } from '../utils/logger'

export class ConnectedDevice {
  isConnected: boolean = false
  httpHandler: HttpHandler
  ciraHandler: CIRAHandler
  ciraChannel: CIRAChannel
  ciraSocket: CIRASocket
  messageId: number = 0
  cim: CIM.CIM
  amt: AMT.AMT
  ips: IPS.IPS

  constructor (ciraSocket: CIRASocket, private readonly username: string, private readonly password: string) {
    this.cim = new CIM.CIM()
    this.amt = new AMT.AMT()
    this.ips = new IPS.IPS()
    this.ciraSocket = ciraSocket
    this.httpHandler = new HttpHandler()
    this.ciraHandler = new CIRAHandler(this.httpHandler, username, password)
  }

  async getPowerState (): Promise<Common.Models.Pull<CIM.Models.AssociatedPowerManagementService>> {
    let xmlRequestBody = this.cim.ServiceAvailableToElement(CIM.Methods.ENUMERATE, (this.messageId++).toString())
    const result = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    const enumContext: string = result?.Envelope?.Body?.EnumerateResponse?.EnumerationContext
    if (enumContext == null) {
      logger.error('failed to pull CIM_ServiceAvailableToElement in get power state')
      return null
    }
    xmlRequestBody = this.cim.ServiceAvailableToElement(CIM.Methods.PULL, (this.messageId++).toString(), enumContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.AssociatedPowerManagementService>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope.Body
  }

  async getSoftwareIdentity (): Promise<Common.Models.Pull<CIM.Models.SoftwareIdentity>> {
    let xmlRequestBody = this.cim.SoftwareIdentity(CIM.Methods.ENUMERATE, (this.messageId++).toString())
    const result = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    const enumContext: string = result?.Envelope.Body?.EnumerateResponse?.EnumerationContext
    if (enumContext == null) {
      logger.error('failed to pull CIM_SoftwareIdentity in get version')
      return null
    }
    xmlRequestBody = this.cim.SoftwareIdentity(CIM.Methods.PULL, (this.messageId++).toString(), enumContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.SoftwareIdentity>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope.Body
  }

  async getIpsOptInService (): Promise<IPS.Models.OptInServiceResponse> {
    const xmlRequestBody = this.ips.OptInService(IPS.Methods.GET, (this.messageId++).toString())
    const result = await this.ciraHandler.Get<IPS.Models.OptInServiceResponse>(this.ciraSocket, xmlRequestBody)
    return result.Envelope.Body
  }

  async getRedirectionService (): Promise<AMT.Models.RedirectionResponse> {
    const xmlRequestBody = this.amt.RedirectionService(AMT.Methods.GET, (this.messageId++).toString())
    const result = await this.ciraHandler.Get<AMT.Models.RedirectionResponse>(this.ciraSocket, xmlRequestBody)
    return result.Envelope.Body
  }

  async getKvmRedirectionSap (): Promise<CIM.Models.KVMRedirectionSAPResponse> {
    const xmlRequestBody = this.cim.KVMRedirectionSAP(CIM.Methods.GET, (this.messageId++).toString())
    const result = await this.ciraHandler.Get<CIM.Models.KVMRedirectionSAPResponse>(this.ciraSocket, xmlRequestBody)
    return result.Envelope.Body
  }

  async forceBootMode (bootSource: string = 'Intel(r) AMT: Boot Configuration 0', role: number = 1): Promise<number> {
    const xmlRequestBody = this.cim.BootService(CIM.Methods.SET_BOOT_CONFIG_ROLE, (this.messageId++).toString(), bootSource, role)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody)
    return result
  }

  // todo: convert to string enum
  async changeBootOrder (bootSource: string): Promise<any> {
    const bootChoice = `<Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootSourceSetting</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="InstanceID">Intel(r) AMT: ${bootSource}</Selector></SelectorSet></ReferenceParameters>`
    const xmlRequestBody = this.cim.BootConfigSetting(CIM.Methods.CHANGE_BOOT_ORDER, (this.messageId++).toString(), bootChoice)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody)
    return result
  }

  async setBootConfiguration (data: AMT.Models.BootSettingData): Promise<any> {
    const xmlRequestBody = this.amt.BootSettingData(AMT.Methods.PUT, (this.messageId++).toString(), data)
    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody)
    return result.Envelope.Body
  }

  async getBootOptions (): Promise<AMT.Models.BootSettingDataResponse> {
    const xmlRequestBody = this.amt.BootSettingData(AMT.Methods.GET, (this.messageId++).toString())
    const result = await this.ciraHandler.Get<AMT.Models.BootSettingDataResponse>(this.ciraSocket, xmlRequestBody)
    return result.Envelope.Body
  }

  async sendPowerAction (powerState: number): Promise<CIM.Models.PowerActionResponse> {
    const xmlToSend = this.cim.PowerManagementService(CIM.Methods.REQUEST_POWER_STATE_CHANGE, (this.messageId++).toString(), powerState)
    const result = await this.ciraHandler.Get<CIM.Models.PowerActionResponse>(this.ciraSocket, xmlToSend)
    return result.Envelope.Body
  }

  async getSetupAndConfigurationService (): Promise<Common.Models.Envelope<AMT.Models.SetupAndConfigurationService>> {
    const xmlRequestBody = this.amt.SetupAndConfigurationService(AMT.Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<AMT.Models.SetupAndConfigurationService>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async getGeneralSettings (): Promise<Common.Models.Envelope<AMT.Models.GeneralSettingsResponse>> {
    const xmlRequestBody = this.amt.GeneralSettings(AMT.Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<AMT.Models.GeneralSettingsResponse>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async getPowerCapabilities (): Promise<Common.Models.Envelope<AMT.Models.BootCapabilities>> {
    const xmlRequestBody = this.amt.BootCapabilities(AMT.Methods.GET, (this.messageId++).toString())
    const result = await this.ciraHandler.Get<AMT.Models.BootCapabilities>(this.ciraSocket, xmlRequestBody)
    console.log(JSON.stringify(result))
    return result.Envelope
  }

  async requestUserConsentCode (): Promise<Common.Models.Envelope<IPS.Models.StartOptIn_OUTPUT>> {
    const xmlRequestBody = this.ips.OptInService(IPS.Methods.START_OPT_IN, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<IPS.Models.StartOptIn_OUTPUT>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async cancelUserConsentCode (): Promise<Common.Models.Envelope<IPS.Models.CancelOptIn_OUTPUT>> {
    const xmlRequestBody = this.ips.OptInService(IPS.Methods.CANCEL_OPT_IN, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<IPS.Models.CancelOptIn_OUTPUT>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async sendUserConsentCode (code: Number): Promise<Common.Models.Envelope<IPS.Models.SendOptInCode_OUTPUT>> {
    const xmlRequestBody = this.ips.OptInService(IPS.Methods.SEND_OPT_IN_CODE, (this.messageId++).toString(), code)
    const getResponse = await this.ciraHandler.Get<IPS.Models.SendOptInCode_OUTPUT>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async getComputerSystemPackage (): Promise<Common.Models.Envelope<CIM.Models.ComputerSystemPackage>> {
    const xmlRequestBody = this.cim.ComputerSystemPackage(CIM.Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<CIM.Models.ComputerSystemPackage>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async getChassis (): Promise<Common.Models.Envelope<CIM.Models.Chassis>> {
    const xmlRequestBody = this.cim.Chassis(CIM.Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<CIM.Models.Chassis>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async getCard (): Promise<Common.Models.Envelope<CIM.Models.Card>> {
    const xmlRequestBody = this.cim.Card(CIM.Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<CIM.Models.Card>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async getBIOSElement (): Promise<Common.Models.Envelope<CIM.Models.BIOSElement>> {
    const xmlRequestBody = this.cim.BIOSElement(CIM.Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<CIM.Models.BIOSElement>(this.ciraSocket, xmlRequestBody)
    return getResponse.Envelope
  }

  async getProcessor (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.Processor>>> {
    let xmlRequestBody = this.cim.Processor(CIM.Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM Processor')
      return null
    }
    xmlRequestBody = this.cim.Processor(CIM.Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.Processor>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope
  }

  async getPhysicalMemory (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.PhysicalMemory>>> {
    let xmlRequestBody = this.cim.PhysicalMemory(CIM.Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM PhysicalMemory')
      return null
    }
    xmlRequestBody = this.cim.PhysicalMemory(CIM.Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.PhysicalMemory>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope
  }

  async getMediaAccessDevice (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.MediaAccessDevice>>> {
    let xmlRequestBody = this.cim.MediaAccessDevice(CIM.Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM Media Access Device')
      return null
    }
    xmlRequestBody = this.cim.MediaAccessDevice(CIM.Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.MediaAccessDevice>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope
  }

  async getPhysicalPackage (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.PhysicalPackage>>> {
    let xmlRequestBody = this.cim.PhysicalPackage(CIM.Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM Physical Package')
      return null
    }
    xmlRequestBody = this.cim.PhysicalPackage(CIM.Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.PhysicalPackage>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope
  }

  async getSystemPackaging (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.SystemPackaging>>> {
    let xmlRequestBody = this.cim.SystemPackaging(CIM.Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM System Packaging')
      return null
    }
    xmlRequestBody = this.cim.SystemPackaging(CIM.Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.SystemPackaging>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope
  }

  async getChip (): Promise<Common.Models.Envelope<Common.Models.Pull<CIM.Models.Chip>>> {
    let xmlRequestBody = this.cim.Chip(CIM.Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM Chip')
      return null
    }
    xmlRequestBody = this.cim.Chip(CIM.Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM.Models.Chip>(this.ciraSocket, xmlRequestBody)
    return pullResponse.Envelope
  }

  async getEventLog (): Promise<Common.Models.Envelope<AMT.Models.MessageLog>> {
    let xmlRequestBody = this.amt.MessageLog(AMT.Methods.POSITION_TO_FIRSTRECORD, (this.messageId++).toString())
    const response = await this.ciraHandler.Get<{PositionToFirstRecord_OUTPUT: {
      IterationIdentifier: string
      ReturnValue: string
    }}>(this.ciraSocket, xmlRequestBody)
    if (response == null) {
      logger.error('failed to get position to first record of AMT_MessageLog')
      return null
    }
    xmlRequestBody = this.amt.MessageLog(AMT.Methods.GET_RECORDS, (this.messageId++).toString(), Number(response.Envelope.Body.PositionToFirstRecord_OUTPUT.IterationIdentifier))
    const eventLogs = await this.ciraHandler.Get<AMT.Models.MessageLog>(this.ciraSocket, xmlRequestBody)
    return eventLogs.Envelope
  }

  async getAuditLog (startIndex: number): Promise<AMT.Models.AuditLog_ReadRecords> {
    const xmlRequestBody = this.amt.AuditLog(AMT.Methods.READ_RECORDS, (this.messageId++).toString(), startIndex)
    const getResponse = await this.ciraHandler.Get<AMT.Models.AuditLog_ReadRecords>(this.ciraSocket, xmlRequestBody)
    if (getResponse == null) {
      logger.error('failed to get audit log')
      throw new Error('unable to retrieve audit log')
    }
    return getResponse.Envelope.Body
  }
}
