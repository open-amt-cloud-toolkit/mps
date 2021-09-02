/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Selector, WSManMessageCreator, WSManErrors } from './wsman'
import { CIM_Methods, CIM_Actions, CIM_Classes } from './enums/cim_enums'

interface CIMCall {
  method: CIM_Methods
  class: CIM_Classes
  messageId: string
  enumerationContext?: string
}
export class CIM {
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator()
  readonly resourceUriBase: string = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/'
  private readonly enumerate = (action: CIM_Actions, cimClass: CIM_Classes, messageId: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`, messageId)
    const body: string = this.wsmanMessageCreator.createBody(CIM_Methods.ENUMERATE)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly pull = (action: CIM_Actions, cimClass: CIM_Classes, messageId: string, enumerationContext: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`, messageId)
    const body: string = this.wsmanMessageCreator.createBody(CIM_Methods.PULL, enumerationContext)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly get = (action: CIM_Actions, cimClass: CIM_Classes, messageId: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`, messageId)
    const body: string = this.wsmanMessageCreator.createBody(CIM_Methods.GET)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly cimSwitch = (cim: CIMCall): string => {
    switch (cim.method) {
      case CIM_Methods.GET:
        return this.get(CIM_Actions.GET, cim.class, cim.messageId)
      case CIM_Methods.PULL:
        if (cim.enumerationContext == null) { throw new Error(WSManErrors.ENUMERATION_CONTEXT) }
        return this.pull(CIM_Actions.PULL, cim.class, cim.messageId, cim.enumerationContext)
      case CIM_Methods.ENUMERATE:
        return this.enumerate(CIM_Actions.ENUMERATE, cim.class, cim.messageId)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  cim_ServiceAvailableToElement = (method: CIM_Methods.PULL | CIM_Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.cimSwitch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: CIM_Classes.CIM_SERVICE_AVAILABLE_TO_ELEMENT })
  }

  cim_SoftwareIdentity = (method: CIM_Methods.PULL | CIM_Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.cimSwitch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: CIM_Classes.CIM_SOFTWARE_IDENTITY })
  }

  cim_ComputerSystemPackage = (method: CIM_Methods.GET | CIM_Methods.ENUMERATE, messageId: string): string => {
    return this.cimSwitch({ method: method, messageId: messageId, class: CIM_Classes.CIM_COMPUTER_SYSTEM_PACKAGE })
  }

  cim_SystemPackaging = (method: CIM_Methods.PULL | CIM_Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.cimSwitch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: CIM_Classes.CIM_SYSTEM_PACKAGING })
  }

  cim_KVMRedirectionSAP = (method: CIM_Methods.GET, messageId: string): string => {
    return this.cimSwitch({ method: method, messageId: messageId, class: CIM_Classes.CIM_KVM_REDIRECTION_SAP })
  }

  cim_Chassis = (method: CIM_Methods.GET, messageId: string): string => {
    return this.cimSwitch({ method: method, messageId: messageId, class: CIM_Classes.CIM_CHASSIS })
  }

  cim_Chip = (method: CIM_Methods.PULL | CIM_Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.cimSwitch({ method: method, messageId, enumerationContext: enumerationContext, class: CIM_Classes.CIM_CHIP })
  }

  cim_Card = (method: CIM_Methods.GET, messageId: string): string => {
    return this.cimSwitch({ method: method, messageId: messageId, class: CIM_Classes.CIM_CARD })
  }

  cim_BIOSElement = (method: CIM_Methods.GET, messageId: string): string => {
    return this.cimSwitch({ method: method, messageId: messageId, class: CIM_Classes.CIM_BIOS_ELEMENT })
  }

  cim_Processor = (method: CIM_Methods.PULL | CIM_Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.cimSwitch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: CIM_Classes.CIM_PROCESSOR })
  }

  cim_PhysicalMemory = (method: CIM_Methods.PULL | CIM_Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.cimSwitch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: CIM_Classes.CIM_PHYSICAL_MEMORY })
  }

  cim_MediaAccessDevice = (method: CIM_Methods.PULL | CIM_Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.cimSwitch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: CIM_Classes.CIM_MEDIA_ACCESS_DEVICE })
  }

  cim_PhysicalPackage = (method: CIM_Methods.PULL | CIM_Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.cimSwitch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: CIM_Classes.CIM_PHYSICAL_PACKAGE })
  }

  cim_WiFiEndpointSettings = (method: CIM_Methods.PULL | CIM_Methods.ENUMERATE, messageId: string, enumerationContext?: string): string => {
    return this.cimSwitch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: CIM_Classes.CIM_WIFI_ENDPOINT_SETTINGS })
  }

  cim_BootService = (method: CIM_Methods.SET_BOOT_CONFIG_ROLE, messageId: string, selector?: Selector, role?: number): string => {
    switch (method) {
      case 'SetBootConfigRole': {
        if (selector == null) { throw new Error(WSManErrors.SELECTOR) }
        if (role == null) { throw new Error(WSManErrors.ROLE) }
        const header = this.wsmanMessageCreator.createHeader(CIM_Actions.SET_BOOT_CONFIG_ROLE, `${this.resourceUriBase}${CIM_Classes.CIM_BOOT_SERVICE}`, messageId)
        const body = `<Body><r:SetBootConfigRole_INPUT xmlns:r="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService"><r:BootConfigSetting><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="InstanceID">${selector.value}</Selector></SelectorSet></ReferenceParameters></r:BootConfigSetting><r:Role>${role}</r:Role></r:SetBootConfigRole_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  cim_BootConfigSetting = (method: CIM_Methods.CHANGE_BOOT_ORDER, messageId: string): string => {
    switch (method) {
      case 'ChangeBootOrder': { // TODO: Example used was incomplete, per AMT SDK there is more work on body required for robust support
        const header = this.wsmanMessageCreator.createHeader(CIM_Actions.CHANGE_BOOT_ORDER, `${this.resourceUriBase}${CIM_Classes.CIM_BOOT_CONFIG_SETTING}`, messageId)
        const body = '<Body><r:ChangeBootOrder_INPUT xmlns:r="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting"></r:ChangeBootOrder_INPUT></Body>'
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  cim_PowerManagementService = (method: CIM_Methods.REQUEST_POWER_STATE_CHANGE, messageId: string, powerState?: number): string => {
    switch (method) {
      case 'RequestPowerStateChange': {
        if (powerState == null) { throw new Error(WSManErrors.REQUESTED_POWER_STATE_CHANGE) }
        const header = this.wsmanMessageCreator.createHeader(CIM_Actions.REQUEST_POWER_STATE_CHANGE, `${this.resourceUriBase}${CIM_Classes.CIM_POWER_MANAGEMENT_SERVICE}`, messageId)
        const body = `<Body><r:RequestPowerStateChange_INPUT xmlns:r="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService"><r:PowerState>${powerState}</r:PowerState><r:ManagedElement><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="CreationClassName">CIM_ComputerSystem</Selector><Selector Name="Name">ManagedSystem</Selector></SelectorSet></ReferenceParameters></r:ManagedElement></r:RequestPowerStateChange_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }
}
