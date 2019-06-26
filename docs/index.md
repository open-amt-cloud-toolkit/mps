# Getting started

## Pre-requisite

* [git](https://git-scm.com/downloads)
* [node.js v10](https://nodejs.org/dist/latest-v10.x/)
* [Activated Intel AMT](activateAMT.md)

## Installation

### 1.Clone the repository
```
git clone [PLACEHOLDER FOR GITHUB URL]
cd MPS_MicroService
```
### 2.Add/modify config.json

create config.json file in *private* folder under MPS_microservice. These following parameters can be configured.

* *usewhitelist* - set true to whitelist the GUIDs stored in guids.json.
* *commonName* - used in self signed certificate can be either FQDN or IP address.
* *useglobalmpscredentials* - set to true, such that any device using global *mpsusername* and  *mpspass* are allowed to connect. 
* *https* - set to true to enable TLS. 
* *mpstlsoffload* - set to true to run MPS without TLS. 
* *generateCertificates* - Generates certificates automatically. SSL and Root cert are generated and stored in private folder when set to true.
* *loggeroff* - Set to true to turnoff logs. By default, they are turnon.

For example:
``` yaml

	{
		"usewhitelist" : false,
		"commonName": "127.0.0.1",
		"mpsport": 4433,
		"mpsusername": "standalone", 
		"mpspass": "P@ssw0rd", 
		"useglobalmpscredentials": true,
		"country": "US",
		"company": "NoCorp",
		"debug": true,
		"listenany": true,
		"https": true, 
		"mpstlsoffload": false, 
		"webport" : 3000, 
		"generateCertificates": true,
		"loggeroff": true
	} 
	
```	
### 3.Add/modify credentials.json

Create credentials.json file in *private* folder. This file is used to simulate credential storage.

!!! info "Add new device"
        
		MPS user name and password are required to connect to MPS server. Where as, AMT user name and password are required whenever a request is made to ME.

For example:
``` yaml
	{
        "8dad96cb-c3db-11e6-9c43-bc0000d20000": { 
            "name": "Win7-machine", 
            "mpsuser": "standalone",
            "mpspass": "P@ssw0rd", 
            "amtuser": "admin", 
            "amtpass": "P@ssw0rd" 
        },
        "bf49cf00-9164-11e4-952b-b8aeed7ec594": {
            "name": "Ubuntu-machine",
            "mpsuser": "xenial",
            "mpspass": "P@ssw0rd",
            "amtuser": "admin",
            "amtpass": "P@ssw0rd"
        }
    }

```	

### 4.Add/modify guids.json

If *usewhitelist* is set to *true* in config.json file, add guids.json file in *private* folder to whitelist guids that are allowed to connect to MPS. This file is used to simulate whitelisting based on GUID's.

For example:
``` yaml

["8dad96cb-c3db-11e6-9c43-bc0000d20000","12345678-9abc-def1-2345-123456789000"]

```
### 5.Start the server

Browse to MPS_microservice root folder

``` javascript
npm install
npm start
```

This will install all the dependencies and start the server. Webserver runs on port 3000 by default and MPS Server listens on port 4433.
Certificates are generated and stored in private folder.

[![mps](assets/images/MPS_npminstall.PNG)](assets/images/MPS_npminstall.PNG)

### 6. Connect an AMT device

*  Make sure the device is connected to internet.

*  From the device browse to MPS server to Download MEScript.
  	
[![mps](assets/images/MPS_DownloadMEScript.PNG)](assets/images/MPS_DownloadMEScript.PNG)

*  Next, download MeshCmd from [site](https://www.meshcommander.com/meshcommander/meshcmd) appropriate to device platform.

[![mps](assets/images/MPS_MeshCommander.PNG)](assets/images/MPS_MeshCommander.PNG)

*  From the folder where MEScript and MeshCmd downloaded, open Cli, run the command the below command. This runs a script that does all the configuration required for CIRA setup.
    1. Adds root certificate to trust MPS Server.
    2. Sets periodic connection to MPS.
    3. Enables environment detection.
    
``` yaml
    meshcmd.exe amtscript --script cira_setup.mescript --pass <amt password>
```	

*  Device will now get connected to MPS Server.

[![mps](assets/images/MPS_DeviceOnline.PNG)](assets/images/MPS_DeviceOnline.PNG)
	
!!! info "Device credentials"

    Make sure that AMT guid entry is present in credential file of server. Also in guids.json file if usewhitelist is set to true in config file.



