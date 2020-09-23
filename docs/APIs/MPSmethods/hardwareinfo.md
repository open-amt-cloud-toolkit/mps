# HadwareInformation

This AMT method returns hardware information such as processor, storage capacity, etc.

Click [here](types.md) for supported input and output types.

## Example: Request Body

>**Important Note:** More information on obtaining an AMT device's GUID can be found [here](../../Topics/guids.md).

>**Note:** The following code block is an example of what would be the data sent as part of the POST request. 

``` yaml
//amt method

{  
   "method":"HardwareInformation",
   "payload":{  
      "guid":"038d0240-045c-05f4-7706-980700080009" //Replace with an AMT Device's GUID
   }
}
	
```
## Example : Success ResponseBody

``` yaml

'200':
    {
      "ResponseBody":
		{
		"CIM_ComputerSystemPackage": {
		"response": {
			"antecedent": {
			"address": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
			"referenceParameters": {
			"resourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Chassis",
			"selectorSet": {
			"selector": [
			{
			"value": "CIM_Chassis",
			"@name": "CreationClassName"
			},
			{
			"value": "CIM_Chassis",
			"@name": "Tag"
			}
			]
			}
			}
		},
			"dependent": {
			"address": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
			"RreferenceParameters": {
			"resourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem",
			"selectorSet": {
			"selector": [
			{
			"value": "CIM_ComputerSystem",
			"@name": "CreationClassName"
			},
			{
			"value": "ManagedSystem",
			"@name": "Name"
			}
			]
			}
			}
			},
			"platformGUID": "1095AC4BA6042143BAE2D45DDF07B684"
			},
			"status": 200
		},
		"CIM_SystemPackaging": {
			"responses": [
			{
			"antecedent": {
			"address": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
			"referenceParameters": {
			"resourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Chassis",
			"selectorSet": {
			"selector": [
			{
			"value": "CIM_Chassis",
			"@name": "CreationClassName"
			},
			{
			"value": "CIM_Chassis",
			"@name": "Tag"
			}
			]
			}
			}
			},
			"dependent": {
			"address": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
			"referenceParameters": {
			"resourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem",
			"selectorSet": {
			"selector": [
			{
			"value": "CIM_ComputerSystem",
			"@name": "CreationClassName"
			},
			{
			"value": "ManagedSystem",
			"@name": "Name"
			}
			]
			}
			}
			},
			"platformGUID": "1095AC4BA6042143BAE2D45DDF07B684"
			}
			],
			"status": 200
		},
		"CIM_Chassis": {
			"response": {
			"chassisPackageType": 0,
			"creationClassName": "CIM_Chassis",
			"elementName": "Managed System Chassis",
			"manufacturer": "Intel Corporation",
			"model": "NUC7i5DNHE",
			"operationalStatus": 0,
			"packageType": 3,
			"serialNumber": "DW1646647500075",
			"tag": "CIM_Chassis",
			"version": "J57828-503"
			},
			"status": 200
			},
		"CIM_Chip": {
			"responses": [
			{
			"canBeFRUed": true,
			"creationClassName": "CIM_Chip",
			"elementName": "Managed System Processor Chip",
			"manufacturer": "Intel(R) Corporation",
			"operationalStatus": 0,
			"tag": "CPU 0",
			"version": "Intel(R) Core(TM) i5-7300U CPU @ 2.60GHz"
			},
			{
			"bankLabel": "BANK 0",
			"capacity": 4294967296,
			"creationClassName": "CIM_PhysicalMemory",
			"elementName": "Managed System Memory Chip",
			"formFactor": 13,
			"manufacturer": "04EF",
			"memoryType": 26,
			"partNumber": "TEAMGROUP-SD4-2133  ",
			"serialNumber": "020300C5",
			"speed": 0,
			"tag": 9876543210
			},
			{
			"bankLabel": "BANK 2",
			"capacity": 4294967296,
			"creationClassName": "CIM_PhysicalMemory",
			"elementName": "Managed System Memory Chip",
			"formFactor": 13,
			"manufacturer": "04EF",
			"memoryType": 26,
			"partNumber": "TEAMGROUP-SD4-2133  ",
			"serialNumber": "020300BD",
			"speed": 0,
			"tag": "9876543210 (#2)"
			}
			],
			"status": 200
		},
		"CIM_Card": {
			"response": {
			"canBeFRUed": true,
			"creationClassName": "CIM_Card",
			"elementName": "Managed System Base Board",
			"manufacturer": "Intel Corporation",
			"model": "NUC7i5DNB",
			"operationalStatus": 0,
			"packageType": 9,
			"serialNumber": "BTDN7490016E",
			"tag": "CIM_Card",
			"version": "J57626-503"
			},
			"status": 200
		},
		"CIM_BIOSElement": {
			"response": {
			"elementName": "Primary BIOS",
			"manufacturer": "Intel Corp.",
			"name": "Primary BIOS",
			"operationalStatus": 0,
			"primaryBIOS": true,
			"releaseDate": {
			"datetime": "2018-03-15T00:00:00Z"
			},
			"softwareElementID": "DNKBLi5v.86A.0040.2018.0315.1451",
			"softwareElementState": 2,
			"targetOperatingSystem": 66,
			"version": "DNKBLi5v.86A.0040.2018.0315.1451"
			},
			"status": 200
		},
		"CIM_Processor": {
			"responses": [
			{
			"cpuStatus": 1,
			"creationClassName": "CIM_Processor",
			"currentClockSpeed": 2500,
			"deviceID": "CPU 0",
			"elementName": "Managed System CPU",
			"enabledState": 2,
			"externalBusClockSpeed": 100,
			"family": 205,
			"healthState": 0,
			"maxClockSpeed": 8300,
			"operationalStatus": 0,
			"requestedState": 12,
			"role": "Central",
			"stepping": 9,
			"systemCreationClassName": "CIM_ComputerSystem",
			"systemName": "ManagedSystem",
			"upgradeMethod": 2
			}
			],
			"status": 200
		},
		"CIM_PhysicalMemory": {
			"responses": [
			{
			"bankLabel": "BANK 0",
			"capacity": 4294967296,
			"creationClassName": "CIM_PhysicalMemory",
			"elementName": "Managed System Memory Chip",
			"formFactor": 13,
			"manufacturer": "04EF",
			"memoryType": 26,
			"partNumber": "TEAMGROUP-SD4-2133  ",
			"serialNumber": "020300C5",
			"speed": 0,
			"tag": 9876543210
			},
			{
			"bankLabel": "BANK 2",
			"capacity": 4294967296,
			"creationClassName": "CIM_PhysicalMemory",
			"elementName": "Managed System Memory Chip",
			"formFactor": 13,
			"manufacturer": "04EF",
			"memoryType": 26,
			"partNumber": "TEAMGROUP-SD4-2133  ",
			"serialNumber": "020300BD",
			"speed": 0,
			"tag": "9876543210 (#2)"
			}
			],
			"status": 200
		},
		"CIM_MediaAccessDevice": {
			"responses": [
			{
			"capabilities": [
			4,
			10
			],
			"creationClassName": "CIM_MediaAccessDevice",
			"deviceID": "MEDIA DEV 0",
			"elementName": "Managed System Media Access Device",
			"enabledDefault": 2,
			"enabledState": 0,
			"maxMediaSize": 250059350,
			"operationalStatus": 0,
			"requestedState": 12,
			"security": 2,
			"systemCreationClassName": "CIM_ComputerSystem",
			"systemName": "ManagedSystem"
			}
			],
			"status": 200
		},
		"CIM_PhysicalPackage": {
			"responses": [
			{
			"canBeFRUed": true,
			"creationClassName": "CIM_Card",
			"elementName": "Managed System Base Board",
			"manufacturer": "Intel Corporation",
			"model": "NUC7i5DNB",
			"operationalStatus": 0,
			"packageType": 9,
			"serialNumber": "BTDN7490016E",
			"tag": "CIM_Card",
			"version": "J57626-503"
			},
			{
			"creationClassName": "CIM_PhysicalPackage",
			"elementName": "Managed System Storage Media Package",
			"model": "Samsung SSD 850 EVO M.2 250GB           ",
			"operationalStatus": 0,
			"packageType": 15,
			"serialNumber": "S33CNX0JC36654D     ",
			"tag": "Storage Media Package 0"
			},
			{
			"chassisPackageType": 0,
			"creationClassName": "CIM_Chassis",
			"elementName": "Managed System Chassis",
			"manufacturer": "Intel Corporation",
			"model": "NUC7i5DNHE",
			"operationalStatus": 0,
			"packageType": 3,
			"serialNumber": "DW1646647500075",
			"tag": "CIM_Chassis",
			"version": "J57828-503"
			}
			],
			"status": 200
		}
	}
}

```

Return to [MPS Methods](../indexMPS.md)