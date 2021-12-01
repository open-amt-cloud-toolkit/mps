import { CIRASocket } from '../models/models'
import { CIM } from './cim/CIM'
import { Methods } from './cim/methods'
import { HttpHandler } from './HttpHandler'
import { CIRAChannel, CIRAHandler } from './CIRAHandler'
import { logger } from '../utils/logger'
import { AMT } from './AMT'
import {
  AMT_SetupAndConfigurationService,
  CIM_ServiceAvailableToElement_Pull,
  CIM_SoftwareIdentity,
  Enumerate
} from './models/cim_response'

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

  async getPowerState (): Promise<any> {
    const cim = new CIM()
    let xmlRequestBody = cim.ServiceAvailableToElement(Methods.ENUMERATE, (this.messageId++).toString())

    const result = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody)

    const enumContext: string = result.Envelope.Body.EnumerateResponse.EnumerationContext
    xmlRequestBody = cim.ServiceAvailableToElement(Methods.PULL, (this.messageId++).toString(), enumContext)
    const pullResponse: CIM_ServiceAvailableToElement_Pull = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody)
    if (pullResponse == null) {
      logger.error('failed to pull CIM_ServiceAvailableToElement in get power state')
      return null
    }
    return pullResponse
  }

  async getVersion (): Promise<any> {
    let xmlRequestBody = this.cim.SoftwareIdentity(Methods.ENUMERATE, (this.messageId++).toString())
    const result: Enumerate|any = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody)

    const enumContext: string = result.Envelope.Body.EnumerateResponse.EnumerationContext
    xmlRequestBody = this.cim.SoftwareIdentity(Methods.PULL, (this.messageId++).toString(), enumContext)
    const pullResponse: CIM_SoftwareIdentity = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody)
    if (pullResponse == null) {
      logger.error('failed to pull CIM_SoftwareIdentity in get version')
      return null
    }
    xmlRequestBody = this.amt.amt_SetupAndConfigurationService(Methods.GET, (this.messageId++).toString())
    const getResponse: AMT_SetupAndConfigurationService = await this.ciraHandler.Send(this.ciraSocket, xmlRequestBody)
    if (getResponse == null) {
      logger.error('failed to get AMT_SetupAndConfigurationService in get version')
      return null
    }
    const response = {
      ...pullResponse.Envelope.Body.PullResponse.Items,
      ...getResponse.Envelope.Body
    }
    return response
  }
}
