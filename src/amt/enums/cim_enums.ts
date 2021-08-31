/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum CIM_Methods {
  GET = 'Get',
  PULL = 'Pull',
  ENUMERATE = 'Enumerate',
  PUT = 'Put',
  DELETE = 'Delete',
  SET_BOOT_CONFIG_ROLE = 'SetBootConfigRole',
  CHANGE_BOOT_ORDER = 'ChangeBootOrder',
  REQUEST_POWER_STATE_CHANGE = 'RequestPowerStateChange'
}

export enum CIM_Actions {
  ENUMERATE = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate',
  PULL = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull',
  GET = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Get',
  PUT = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Put',
  DELETE = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete',
  SET_BOOT_CONFIG_ROLE = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService/SetBootConfigRole',
  CHANGE_BOOT_ORDER = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting/ChangeBootOrder',
  REQUEST_POWER_STATE_CHANGE = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService/RequestPowerStateChange'
}

export enum CIM_Classes {
  CIM_SERVICE_AVAILABLE_TO_ELEMENT = 'CIM_ServiceAvailableToElement',
  CIM_SOFTWARE_IDENTITY = 'CIM_SoftwareIdentity',
  CIM_COMPUTER_SYSTEM_PACKAGE = 'CIM_ComputerSystemPackage',
  CIM_SYSTEM_PACKAGING = 'CIM_SystemPackaging',
  CIM_KVM_REDIRECTION_SAP = 'CIM_KVMRedirectionSAP',
  CIM_CHASSIS = 'CIM_Chassis',
  CIM_CHIP = 'CIM_Chip',
  CIM_CARD = 'CIM_Card',
  CIM_BIOS_ELEMENT = 'CIM_BIOSElement',
  CIM_PROCESSOR = 'CIM_Processor',
  CIM_PHYSICAL_MEMORY = 'CIM_PhysicalMemory',
  CIM_MEDIA_ACCESS_DEVICE = 'CIM_MediaAccessDevice',
  CIM_PHYSICAL_PACKAGE = 'CIM_PhysicalPackage',
  CIM_WIFI_ENDPOINT_SETTINGS = 'CIM_WiFiEndpointSettings',
  CIM_BOOT_SERVICE = 'CIM_BootService',
  CIM_BOOT_CONFIG_SETTING = 'CIM_BootConfigSetting',
  CIM_POWER_MANAGEMENT_SERVICE = 'CIM_PowerManagementService'
}
