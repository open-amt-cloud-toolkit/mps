# Getting started

## Prerequisite

* [git](https://git-scm.com/downloads)
* [node.js v10](https://nodejs.org/dist/latest-v10.x/)
* [Activated Intel AMT](activateAMT.md)

## Installation

### 1.Clone the repository
```
git clone https://github.com/open-amt-cloud-toolkit/MPS.git
cd MPS
```
### 2.Add/modify config.json

create config.json file in the *private* folder within MPS directory. These following parameters can be configured.

* *usewhitelist* - set to true to whitelist AMT GUIDs stored in guids.json.
* *commonName* - used in self signed certificate, can be either FQDN or IP address.
* *useglobalmpscredentials* - When set to true, any device using *mpsusername* and  *mpspass* in config.json are allowed to connect. When set to false, MPS validates credentials sent by AMT device using credentials.json.
* *https* - set to true to enable TLS on HTTP server. 
* *mpstlsoffload* - set to true to run MPS without TLS. 
* *generateCertificates* - Generates certificates automatically. When set to true, SSL and Root cert are generated and stored in private folder.
* *loggeroff* - set to true to disable logging. Logging is enabled by default.”.
* *webport* - Port used by WebServer (or HTTP server)

For example:
``` yaml

	{
		"usewhitelist" : false,
		"commonName": "iot-demosetup.lab.local.com",
		"mpsport": 4433,
		"mpsusername": "standalone", 
		"mpspass": "G@ppm0ym", 
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

Create credentials.json file in *private* folder within MPS directory. This file is used to simulate credential storage.

* *AMT GUID* - Each AMT device has a unique identifier (GUID) assigned to it by default. This GUID will be used as the reference to each device record.
* *name* - AMT hostname or user friendly identifier
* *mpsuser* - AMT Device uses this as the user name while connecting to MPS
* *mpspass* - AMT Device uses this as the password while connecting to MPS
* *amtuser* - MPS uses this as the AMT user name when making AMT API calls (WSMAN or Redirection)
* *amtpass* - MPS uses this as the AMT password when making AMT API calls (WSMAN or Redirection)

!!! info "AMT and MPS password security recommendation"
        
		Intel highly recommends that you don't use same password for MPS and AMT. An example strong password would contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least eight characters.

For example:
``` yaml
	{
        "8dad96cb-c3db-11e6-9c43-bc0000d20000": { 
            "name": "Win7-machine", 
            "mpsuser": "standalone",
            "mpspass": "G@ppm0ym", 
            "amtuser": "admin", 
            "amtpass": "G@ppm0ym" 
        },
        "bf49cf00-9164-11e4-952b-b8aeed7ec594": {
            "name": "Ubuntu-machine",
            "mpsuser": "xenial",
            "mpspass": "G@ppm0ym",
            "amtuser": "admin",
            "amtpass": "G@ppm0ym"
        }
    }

```	

### 4.Add/modify guids.json

If *usewhitelist* is set to *true* in config.json file, add guids.json file in *private* folder to whitelist AMT GUID's that are allowed to connect to MPS. Use guids.json.sample as an example to create the guids.json and populate it with guids for whitelisting. This file is used to simulate whitelisting based on AMT GUID's.

For example:
``` yaml

["8dad96cb-c3db-11e6-9c43-bc0000d20000","12345678-9abc-def1-2345-123456789000"]

```
### 5.Start the server

Browse to MPS root folder

``` javascript
npm install
npm start
```

This will install all the dependencies and start the server. Webserver (or HTTPS server) runs on port 3000 by default and MPS Server listens on port 4433.
Certificates are generated and stored in private folder.

[![mps](assets/images/MPS_npminstall.PNG)](assets/images/MPS_npminstall.PNG)

### 6. Connect an AMT device

*  Make sure the device is connected to internet.

*  On the device, browse to MPS server (Example URL: https://iot-demosetup.lab.local.com:3000) and click on Download MESCRIPT. This will download cira_setup.mescript file.

!!! info "MEScript"
	MEScript files are used by MeshCMD to execute a series of actions on the AMT device. 

[![mps](assets/images/MPS_DownloadMEScript.PNG)](assets/images/MPS_DownloadMEScript.PNG)

*  Next, download MeshCMD suitable to your device platform from [site](https://www.meshcommander.com/meshcommander/meshcmd).

[![mps](assets/images/MPS_MeshCommander.PNG)](assets/images/MPS_MeshCommander.PNG)

*  Browse to the folder where MEScript and MeshCMD are downloaded. Open Cli, run the below command. This runs a script that does all the configuration required for CIRA setup.
    1. Specifies the root certificate that the Firmware (ME) should use for TLS negotiation.
    2. Specifies the login credentials that the Firmware should use when connecting to MPS.
    3. Specifies the periodic connection time the Firmware should use to maintain MPS connection.
    4. Specifies the home domain suffix used to enable environment detection (When device is outside the home domain, AMT uses CIRA to connect to MPS).
    
``` yaml
    meshcmd.exe amtscript --script cira_setup.mescript --pass <amt password>
```	

*  Device will now get connected to MPS Server.

[![mps](assets/images/MPS_DeviceOnline.PNG)](assets/images/MPS_DeviceOnline.PNG)
	
!!! info "Device credentials"

    Make sure that AMT guid entry is present in credential.json file. Also in guids.json file if *usewhitelist* is set to *true* in config.json file.
