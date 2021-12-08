import { CIRASocket } from '../models/models'
import { CIM } from './cim/CIM'
import { Methods } from './cim/methods'
import { HttpHandler } from './HttpHandler'
import { CIRAChannel, CIRAHandler } from './CIRAHandler'
import { logger } from '../utils/logger'
import { AMT } from './AMT'
import { CIM_AssociatedPowerManagementService, CIM_SoftwareIdentity } from './models/cim_models'
import { AMT_BootCapabilities, AMT_SetupAndConfigurationService } from './models/amt_models'
import { Pull, Response } from './models/common'
export class ConnectedDevice {
  isConnected: boolean = false
  httpHandler: HttpHandler
  ciraHandler: CIRAHandler
  ciraChannel: CIRAChannel
  ciraSocket: CIRASocket
  messageId: number = 0
  cim: CIM
  amt: AMT

  constructor (ciraSocket: CIRASocket, private readonly username: string, private readonly password: string) {
    this.cim = new CIM()
    this.amt = new AMT()
    this.ciraSocket = ciraSocket
    this.httpHandler = new HttpHandler()
    this.ciraHandler = new CIRAHandler(this.httpHandler, username, password)
  }

  async getPowerState (): Promise<Response<Pull<CIM_AssociatedPowerManagementService>>> {
    const cim = new CIM()
    let xmlRequestBody = cim.ServiceAvailableToElement(Methods.ENUMERATE, (this.messageId++).toString())
    const result = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    const enumContext: string = result?.Envelope?.Body?.EnumerateResponse?.EnumerationContext
    if (enumContext == null) {
      logger.error('failed to pull CIM_ServiceAvailableToElement in get power state')
      return null
    }
    xmlRequestBody = cim.ServiceAvailableToElement(Methods.PULL, (this.messageId++).toString(), enumContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_AssociatedPowerManagementService>(this.ciraSocket, xmlRequestBody)
    if (pullResponse == null) {
      logger.error('failed to pull CIM_ServiceAvailableToElement in get power state')
      return null
    }
    return pullResponse
  }

  async getVersion (): Promise<any> {
    let xmlRequestBody = this.cim.SoftwareIdentity(Methods.ENUMERATE, (this.messageId++).toString())
    const result = await this.ciraHandler.Enumerate(this.ciraSocket, xmlRequestBody)
    const enumContext: string = result?.Envelope.Body?.EnumerateResponse?.EnumerationContext
    if (enumContext == null) {
      logger.error('failed to pull CIM_SoftwareIdentity in get version')
      return null
    }
    xmlRequestBody = this.cim.SoftwareIdentity(Methods.PULL, (this.messageId++).toString(), enumContext)
    const pullResponse = await this.ciraHandler.Pull<CIM_SoftwareIdentity>(this.ciraSocket, xmlRequestBody)
    if (pullResponse == null) {
      logger.error('failed to pull CIM_SoftwareIdentity in get version')
      return null
    }
    xmlRequestBody = this.amt.amt_SetupAndConfigurationService(Methods.GET, (this.messageId++).toString())
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

  async getPowerCapabilities (): Promise<Response<AMT_BootCapabilities>> {
    const xmlRequestBody = this.amt.amt_BootCapabilities(Methods.GET, (this.messageId++).toString())
    const result = await this.ciraHandler.Get<AMT_BootCapabilities>(this.ciraSocket, xmlRequestBody)
    console.log(result)
    return result
  }
}
