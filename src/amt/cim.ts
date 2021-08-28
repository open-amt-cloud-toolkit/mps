/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { WSManMessageCreator } from './wsman'
import { CIM_Methods, CIM_Actions, CIM_Classes } from './enums/cim_enums'

export class CIM {
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator()
  readonly resourceUriBase: string = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/'
  private enumerate (action: CIM_Actions, cimClass: CIM_Classes, messageId: String): String {
    const header: String = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`, messageId)
    const body: String = this.wsmanMessageCreator.createBody(CIM_Methods.ENUMERATE)
    const response: String = this.wsmanMessageCreator.createXml(header, body)
    return response
  }

  private pull (action: CIM_Actions, cimClass: CIM_Classes, messageId: String, enumerationContext: String): String {
    const header: String = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`, messageId)
    const body: String = this.wsmanMessageCreator.createBody(CIM_Methods.PULL, enumerationContext)
    const response: String = this.wsmanMessageCreator.createXml(header, body)
    return response
  }

  private get (action: CIM_Actions, cimClass: CIM_Classes, messageId: String): String {
    const header: String = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`, messageId)
    const body: String = this.wsmanMessageCreator.createBody(CIM_Methods.GET)
    const response: String = this.wsmanMessageCreator.createXml(header, body)
    return response
  }

  cim_ServiceAvailableToElement = (method: CIM_Methods, messageId: String, enumerationContext?: String): String => {
    switch (method) {
      case 'Pull':
        return this.pull(CIM_Actions.PULL, CIM_Classes.CIM_SERVICE_AVAILABLE_TO_ELEMENT, messageId, enumerationContext)
      case 'Enumerate':
        return this.enumerate(CIM_Actions.ENUMERATE, CIM_Classes.CIM_SERVICE_AVAILABLE_TO_ELEMENT, messageId)
      default:
        return null
    }
  }

  cim_SoftwareIdentity = (method: CIM_Methods, messageId: String, enumerationContext?: String): String => {
    switch (method) {
      case 'Enumerate':
        return this.enumerate(CIM_Actions.ENUMERATE, CIM_Classes.CIM_SOFTWARE_IDENTITY, messageId)
      case 'Pull':
        if (enumerationContext != null) {
          return this.pull(CIM_Actions.PULL, CIM_Classes.CIM_SOFTWARE_IDENTITY, messageId, enumerationContext)
        } else {
          return null
        }
      default:
        return null
    }
  }

  cim_ComputerSystemPackage = (method: CIM_Methods, messageId: String): String => {
    switch (method) {
      case 'Get':
        return this.get(CIM_Actions.GET, CIM_Classes.CIM_COMPUTER_SYSTEM_PACKAGE, messageId)
      case 'Enumerate':
        return this.enumerate(CIM_Actions.ENUMERATE, CIM_Classes.CIM_COMPUTER_SYSTEM_PACKAGE, messageId)
      default:
        return null
    }
  }

  cim_SystemPackaging = (method: CIM_Methods, messageId: String, enumerationContext?: String): String => {
    switch (method) {
      case 'Enumerate':
        return this.enumerate(CIM_Actions.ENUMERATE, CIM_Classes.CIM_SYSTEM_PACKAGING, messageId)
      case 'Pull':
        if (enumerationContext != null) {
          return this.pull(CIM_Actions.PULL, CIM_Classes.CIM_SYSTEM_PACKAGING, messageId, enumerationContext)
        } else {
          return null
        }
      default:
        return null
    }
  }

  cim_KVMRedirectionSAP = (method: CIM_Methods, messageId: String): String => {
    switch (method) {
      case 'Get':
        return this.get(CIM_Actions.GET, CIM_Classes.CIM_KVM_REDIRECTION_SAP, messageId)
      default:
        return null
    }
  }

  cim_Chassis = (method: CIM_Methods, messageId: String): String => {
    switch (method) {
      case 'Get':
        return this.get(CIM_Actions.GET, CIM_Classes.CIM_CHASSIS, messageId)
      default:
        return null
    }
  }

  cim_Chip = (method: CIM_Methods, messageId: String, enumerationContext?: String): String => {
    switch (method) {
      case 'Enumerate':
        return this.enumerate(CIM_Actions.ENUMERATE, CIM_Classes.CIM_CHIP, messageId)
      case 'Pull':
        if (enumerationContext != null) {
          return this.pull(CIM_Actions.PULL, CIM_Classes.CIM_CHIP, messageId, enumerationContext)
        } else {
          return null
        }
      default:
        return null
    }
  }

  cim_Card = (method: CIM_Methods, messageId: String): String => {
    switch (method) {
      case 'Get':
        return this.get(CIM_Actions.GET, CIM_Classes.CIM_CARD, messageId)
      default:
        return null
    }
  }

  cim_BIOSElement = (method: CIM_Methods, messageId: String): String => {
    switch (method) {
      case 'Get':
        return this.get(CIM_Actions.GET, CIM_Classes.CIM_BIOS_ELEMENT, messageId)
      default:
        return null
    }
  }

  cim_Processor = (method: CIM_Methods, messageId: String, enumerationContext?: String): String => {
    switch (method) {
      case 'Enumerate':
        return this.enumerate(CIM_Actions.ENUMERATE, CIM_Classes.CIM_PROCESSOR, messageId)
      case 'Pull':
        if (enumerationContext != null) {
          return this.pull(CIM_Actions.PULL, CIM_Classes.CIM_PROCESSOR, messageId, enumerationContext)
        } else {
          return null
        }
      default:
        return null
    }
  }

  cim_PhysicalMemory = (method: CIM_Methods, messageId: String, enumerationContext?: String): String => {
    switch (method) {
      case 'Enumerate':
        return this.enumerate(CIM_Actions.ENUMERATE, CIM_Classes.CIM_PHYSICAL_MEMORY, messageId)
      case 'Pull':
        if (enumerationContext != null) {
          return this.pull(CIM_Actions.PULL, CIM_Classes.CIM_PHYSICAL_MEMORY, messageId, enumerationContext)
        } else {
          return null
        }
      default:
        return null
    }
  }

  cim_MediaAccessDevice = (method: CIM_Methods, messageId: String, enumerationContext?: String): String => {
    switch (method) {
      case 'Enumerate':
        return this.enumerate(CIM_Actions.ENUMERATE, CIM_Classes.CIM_MEDIA_ACCESS_DEVICE, messageId)
      case 'Pull':
        if (enumerationContext != null) {
          return this.pull(CIM_Actions.PULL, CIM_Classes.CIM_MEDIA_ACCESS_DEVICE, messageId, enumerationContext)
        } else {
          return null
        }
      default:
        return null
    }
  }

  cim_PhysicalPackage = (method: CIM_Methods, messageId: String, enumerationContext?: String): String => {
    switch (method) {
      case 'Enumerate':
        return this.enumerate(CIM_Actions.ENUMERATE, CIM_Classes.CIM_PHYSICAL_PACKAGE, messageId)
      case 'Pull':
        if (enumerationContext != null) {
          return this.pull(CIM_Actions.PULL, CIM_Classes.CIM_PHYSICAL_PACKAGE, messageId, enumerationContext)
        } else {
          return null
        }
      default:
        return null
    }
  }

  cim_WiFiEndpointSettings = (method: CIM_Methods, messageId: String, enumerationContext?: String): String => {
    switch (method) {
      case 'Enumerate':
        return this.enumerate(CIM_Actions.ENUMERATE, CIM_Classes.CIM_WIFI_ENDPOINT_SETTINGS, messageId)
      case 'Pull':
        if (enumerationContext != null) {
          return this.pull(CIM_Actions.PULL, CIM_Classes.CIM_WIFI_ENDPOINT_SETTINGS, messageId, enumerationContext)
        } else {
          return null
        }
      default:
        return null
    }
  }
}
