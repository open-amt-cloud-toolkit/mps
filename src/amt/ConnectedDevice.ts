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
  CIM_MediaAccessDevice,
  CIM_PhysicalMemory,
  CIM_PhysicalPackage,
  CIM_Processor,
  CIM_SoftwareIdentity,
  CIM_SystemPackaging
} from './models/cim_models'
import { AMT_GeneralSettings, AMT_BootCapabilities, AMT_SetupAndConfigurationService, AMT_AuditLog_ReadRecords } from './models/amt_models'
import { Pull, Response } from './models/common'
import { CancelOptIn_OUTPUT, SendOptInCode_OUTPUT, StartOptIn_OUTPUT } from './models/ips_models'
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

  async getPowerState (): Promise<Response<Pull<CIM_AssociatedPowerManagementService>>> {
    let xmlRequestBody = this.cim.ServiceAvailableToElement(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const result = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    const enumContext: string = result?.Envelope?.Body?.EnumerateResponse?.EnumerationContext
    if (enumContext == null) {
      logger.error('failed to pull CIM_ServiceAvailableToElement in get power state')
      return null
    }
    xmlRequestBody = this.cim.ServiceAvailableToElement(CIM_Methods.PULL, (this.messageId++).toString(), enumContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_AssociatedPowerManagementService>(this.ciraSocket, xmlRequestBody)
    if (pullResponse == null) {
      logger.error('failed to pull CIM_ServiceAvailableToElement in get power state')
      return null
    }
    return pullResponse
  }

  async getVersion (): Promise<any> {
    let xmlRequestBody = this.cim.SoftwareIdentity(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const result = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    const enumContext: string = result?.Envelope.Body?.EnumerateResponse?.EnumerationContext
    if (enumContext == null) {
      logger.error('failed to pull CIM_SoftwareIdentity in get version')
      return null
    }
    xmlRequestBody = this.cim.SoftwareIdentity(CIM_Methods.PULL, (this.messageId++).toString(), enumContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_SoftwareIdentity>(this.ciraSocket, xmlRequestBody)
    if (pullResponse == null) {
      logger.error('failed to pull CIM_SoftwareIdentity in get version')
      return null
    }
    xmlRequestBody = this.amt.SetupAndConfigurationService(AMT_Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<AMT_SetupAndConfigurationService>(this.ciraSocket, xmlRequestBody)
    if (getResponse == null) {
      logger.error('failed to get AMT_SetupAndConfigurationService in get version')
      return null
    }
    // matches version 2.x API for Open AMT
    const response = {
      CIM_SoftwareIdentity: {
        responses: pullResponse.Envelope.Body.PullResponse.Items.CIM_SoftwareIdentity,
        status: 200
      },
      AMT_SetupAndConfigurationService: {
        response: getResponse.Envelope.Body.AMT_SetupAndConfigurationService,
        responses: {
          Header: getResponse.Envelope.Header,
          Body: getResponse.Envelope.Body.AMT_SetupAndConfigurationService
        },
        status: 200
      }
    }
    return response
  }

  async getGeneralSettings (): Promise<any> {
    const xmlRequestBody = this.amt.GeneralSettings(AMT_Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<AMT_GeneralSettings>(this.ciraSocket, xmlRequestBody)
    return getResponse
  }

  async getPowerCapabilities (): Promise<Response<AMT_BootCapabilities>> {
    const xmlRequestBody = this.amt.BootCapabilities(AMT_Methods.GET, (this.messageId++).toString())
    const result = await this.ciraHandler.Get<AMT_BootCapabilities>(this.ciraSocket, xmlRequestBody)
    return result
  }

  async requestUserConsetCode (): Promise<any> {
    const xmlRequestBody = this.ips.OptInService(IPS_Methods.START_OPT_IN, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<StartOptIn_OUTPUT>(this.ciraSocket, xmlRequestBody)
    return getResponse
  }

  async cancelUserConsetCode (): Promise<any> {
    const xmlRequestBody = this.ips.OptInService(IPS_Methods.CANCEL_OPT_IN, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<CancelOptIn_OUTPUT>(this.ciraSocket, xmlRequestBody)
    return getResponse
  }

  async sendUserConsetCode (code: Number): Promise<any> {
    const xmlRequestBody = this.ips.OptInService(IPS_Methods.SEND_OPT_IN_CODE, (this.messageId++).toString(), code)
    const getResponse = await this.ciraHandler.Get<SendOptInCode_OUTPUT>(this.ciraSocket, xmlRequestBody)
    return getResponse
  }

  async getComputerSystemPackage (): Promise<Response<CIM_ComputerSystemPackage>> {
    const xmlRequestBody = this.cim.ComputerSystemPackage(CIM_Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<CIM_ComputerSystemPackage>(this.ciraSocket, xmlRequestBody)
    return getResponse
  }

  async getChassis (): Promise<Response<CIM_Chassis>> {
    const xmlRequestBody = this.cim.Chassis(CIM_Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<CIM_Chassis>(this.ciraSocket, xmlRequestBody)
    return getResponse
  }

  async getCard (): Promise<Response<CIM_Card>> {
    const xmlRequestBody = this.cim.Card(CIM_Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<CIM_Card>(this.ciraSocket, xmlRequestBody)
    return getResponse
  }

  async getBIOSElement (): Promise<Response<CIM_BIOSElement>> {
    const xmlRequestBody = this.cim.BIOSElement(CIM_Methods.GET, (this.messageId++).toString())
    const getResponse = await this.ciraHandler.Get<CIM_BIOSElement>(this.ciraSocket, xmlRequestBody)
    return getResponse
  }

  async getProcessor (): Promise<Response<Pull<CIM_Processor>>> {
    let xmlRequestBody = this.cim.Processor(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM Processor')
    }
    xmlRequestBody = this.cim.Processor(CIM_Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_Processor>(this.ciraSocket, xmlRequestBody)
    return pullResponse
  }

  async getPhysicalMemory (): Promise<Response<Pull<CIM_PhysicalMemory>>> {
    let xmlRequestBody = this.cim.PhysicalMemory(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM PhysicalMemory')
    }
    xmlRequestBody = this.cim.PhysicalMemory(CIM_Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_PhysicalMemory>(this.ciraSocket, xmlRequestBody)
    return pullResponse
  }

  async getMediaAccessDevice (): Promise<Response<Pull<CIM_MediaAccessDevice>>> {
    let xmlRequestBody = this.cim.MediaAccessDevice(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM Media Access Device')
    }
    xmlRequestBody = this.cim.MediaAccessDevice(CIM_Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_MediaAccessDevice>(this.ciraSocket, xmlRequestBody)
    return pullResponse
  }

  async getPhysicalPackage (): Promise<Response<Pull<CIM_PhysicalPackage>>> {
    let xmlRequestBody = this.cim.PhysicalPackage(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM Physical Package')
    }
    xmlRequestBody = this.cim.PhysicalPackage(CIM_Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_PhysicalPackage>(this.ciraSocket, xmlRequestBody)
    return pullResponse
  }

  async getSystemPackaging (): Promise<Response<Pull<CIM_SystemPackaging>>> {
    let xmlRequestBody = this.cim.SystemPackaging(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM System Packaging')
    }
    xmlRequestBody = this.cim.SystemPackaging(CIM_Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_SystemPackaging>(this.ciraSocket, xmlRequestBody)
    return pullResponse
  }

  async getChip (): Promise<Response<Pull<CIM_Chip>>> {
    let xmlRequestBody = this.cim.Chip(CIM_Methods.ENUMERATE, (this.messageId++).toString())
    const enumResponse = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    if (enumResponse == null) {
      logger.error('failed to get CIM Chip')
    }
    xmlRequestBody = this.cim.Chip(CIM_Methods.PULL, (this.messageId++).toString(), enumResponse.Envelope.Body.EnumerateResponse.EnumerationContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_Chip>(this.ciraSocket, xmlRequestBody)
    return pullResponse
  }

  async getAuditLog (startIndex: number): Promise<AMT_AuditLog_ReadRecords> {
    const xmlRequestBody = this.amt.AuditLog(AMT_Methods.READ_RECORDS, (this.messageId++).toString(), startIndex)
    const getResponse = await this.ciraHandler.Get<AMT_AuditLog_ReadRecords>(this.ciraSocket, xmlRequestBody)
    if (getResponse == null) {
      logger.error('failed to get audit log')
      return null
    }
    return getResponse.Envelope.Body
  }
}
