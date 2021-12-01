/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Actions, Classes, Methods } from '.'
import { Selector, WSManMessageCreator, WSManErrors } from '../WSMan'

interface CIMCall {
  method: Methods
  class: Classes
  messageId: string
  enumerationContext?: string
}
export class CIM {
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator()
  readonly resourceUriBase: string = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/'
  private readonly enumerate = (action: Actions, cimClass: Classes, messageId: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`, messageId)
    const body: string = this.wsmanMessageCreator.createBody(Methods.ENUMERATE)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly pull = (action: Actions, cimClass: Classes, messageId: string, enumerationContext: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`, messageId)
    const body: string = this.wsmanMessageCreator.createBody(Methods.PULL, enumerationContext)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly get = (action: Actions, cimClass: Classes, messageId: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`, messageId)
    const body: string = this.wsmanMessageCreator.createBody(Methods.GET)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly switch = (cim: CIMCall): string => {
    switch (cim.method) {
      case Methods.GET:
        return this.get(Actions.GET, cim.class, cim.messageId)
      case Methods.PULL:
        if (cim.enumerationContext == null) { throw new Error(WSManErrors.ENUMERATION_CONTEXT) }
        return this.pull(Actions.PULL, cim.class, cim.messageId, cim.enumerationContext)
      case Methods.ENUMERATE:
        return this.enumerate(Actions.ENUMERATE, cim.class, cim.messageId)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  ServiceAvailableToElement = (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: Classes.SERVICE_AVAILABLE_TO_ELEMENT })
  }

  SoftwareIdentity = (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: Classes.CIM_SOFTWARE_IDENTITY })
  }

  ComputerSystemPackage = (method: Methods.GET | Methods.ENUMERATE, messageId: string): string => {
    return this.switch({ method: method, messageId: messageId, class: Classes.CIM_COMPUTER_SYSTEM_PACKAGE })
  }

  SystemPackaging = (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: Classes.CIM_SYSTEM_PACKAGING })
  }

  KVMRedirectionSAP = (method: Methods.GET, messageId: string): string => {
    return this.switch({ method: method, messageId: messageId, class: Classes.CIM_KVM_REDIRECTION_SAP })
  }

  Chassis = (method: Methods.GET, messageId: string): string => {
    return this.switch({ method: method, messageId: messageId, class: Classes.CIM_CHASSIS })
  }

  Chip = (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.switch({ method: method, messageId, enumerationContext: enumerationContext, class: Classes.CIM_CHIP })
  }

  Card = (method: Methods.GET, messageId: string): string => {
    return this.switch({ method: method, messageId: messageId, class: Classes.CIM_CARD })
  }

  BIOSElement = (method: Methods.GET, messageId: string): string => {
    return this.switch({ method: method, messageId: messageId, class: Classes.CIM_BIOS_ELEMENT })
  }

  Processor = (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: Classes.CIM_PROCESSOR })
  }

  PhysicalMemory = (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: Classes.CIM_PHYSICAL_MEMORY })
  }

  MediaAccessDevice = (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: Classes.CIM_MEDIA_ACCESS_DEVICE })
  }

  PhysicalPackage = (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: Classes.CIM_PHYSICAL_PACKAGE })
  }

  WiFiEndpointSettings = (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: Classes.CIM_WIFI_ENDPOINT_SETTINGS })
  }

  BootService = (method: Methods.SET_BOOT_CONFIG_ROLE, messageId: string, selector?: Selector, role?: number): string => {
    switch (method) {
      case 'SetBootConfigRole': {
        if (selector == null) { throw new Error(WSManErrors.SELECTOR) }
        if (role == null) { throw new Error(WSManErrors.ROLE) }
        const header = this.wsmanMessageCreator.createHeader(Actions.SET_BOOT_CONFIG_ROLE, `${this.resourceUriBase}${Classes.CIM_BOOT_SERVICE}`, messageId)
        const body = `<Body><r:SetBootConfigRole_INPUT xmlns:r="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService"><r:BootConfigSetting><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="InstanceID">${selector.value}</Selector></SelectorSet></ReferenceParameters></r:BootConfigSetting><r:Role>${role}</r:Role></r:SetBootConfigRole_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  BootConfigSetting = (method: Methods.CHANGE_BOOT_ORDER, messageId: string): string => {
    switch (method) {
      case 'ChangeBootOrder': { // TODO: Example used was incomplete, per AMT SDK there is more work on body required for robust support
        const header = this.wsmanMessageCreator.createHeader(Actions.CHANGE_BOOT_ORDER, `${this.resourceUriBase}${Classes.CIM_BOOT_CONFIG_SETTING}`, messageId)
        const body = '<Body><r:ChangeBootOrder_INPUT xmlns:r="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting"></r:ChangeBootOrder_INPUT></Body>'
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  PowerManagementService = (method: Methods.REQUEST_POWER_STATE_CHANGE, messageId: string, powerState?: number): string => {
    switch (method) {
      case 'RequestPowerStateChange': {
        if (powerState == null) { throw new Error(WSManErrors.REQUESTED_POWER_STATE_CHANGE) }
        const header = this.wsmanMessageCreator.createHeader(Actions.REQUEST_POWER_STATE_CHANGE, `${this.resourceUriBase}${Classes.CIM_POWER_MANAGEMENT_SERVICE}`, messageId)
        const body = `<Body><r:RequestPowerStateChange_INPUT xmlns:r="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService"><r:PowerState>${powerState}</r:PowerState><r:ManagedElement><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="CreationClassName">CIM_ComputerSystem</Selector><Selector Name="Name">ManagedSystem</Selector></SelectorSet></ReferenceParameters></r:ManagedElement></r:RequestPowerStateChange_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }
}
