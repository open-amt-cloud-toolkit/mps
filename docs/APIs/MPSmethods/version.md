# AMTVersion

This AMT method retrieves the Intel&reg; AMT version running on the specified device.

Click [here](types.md) for supported input and output types.

## Example: Request Body

``` yaml

{  
   "apiKey":"string",
   "method":"Version",
   "payload":{  
      "guid":"038d0240-045c-05f4-7706-980700080009"
   }
}
	
```
## Example : Success ResponseBody

``` yaml

'200':
    {
      "ResponseBody":{
		"CIM_SoftwareIdentity": {
		"responses": [
			{
			"instanceID": "Flash",
			"isEntity": true,
			"versionString": "11.8.50"
			},
			{
			"instanceID": "Netstack",
			"isEntity": true,
			"versionString": "11.8.50"
			},
			{
			"instanceID": "AMTApps",
			"isEntity": true,
			"versionString": "11.8.50"
			},
			{
			"instanceID": "AMT",
			"isEntity": true,
			"versionString": "11.8.50"
			},
			{
			"instanceID": "Sku",
			"isEntity": true,
			"versionString": 16392
			},
			{
			"instanceID": "VendorID",
			"isEntity": true,
			"versionString": 8086
			},
			{
			"instanceID": "Build Number",
			"isEntity": true,
			"versionString": 3425
			},
			{
			"instanceID": "Recovery Version",
			"isEntity": true,
			"versionString": "11.8.50"
			},
			{
			"instanceID": "Recovery Build Num",
			"isEntity": true,
			"versionString": 3425
			},
			{
			"instanceID": "Legacy Mode",
			"isEntity": true,
			"versionString": "False"
			},
			{
			"instanceID": "AMT FW Core Version",
			"isEntity": true,
			"versionString": "11.8.50"
			}
		  ],
		  "status": 200
		},
		"AMT_SetupAndConfigurationService": {
			"response": {
			"creationClassName": "AMT_SetupAndConfigurationService",
			"elementName": "Intel(r) AMT Setup and Configuration Service",
			"enabledState": 5,
			"name": "Intel(r) AMT Setup and Configuration Service",
			"passwordModel": 1,
			"provisioningMode": 1,
			"provisioningServerOTP": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
			"provisioningState": 2,
			"requestedState": 12,
			"systemCreationClassName": "CIM_ComputerSystem",
			"systemName": "Intel(r) AMT",
			"zeroTouchConfigurationEnabled": true
			},
		    "status": 200
		}
	}


```