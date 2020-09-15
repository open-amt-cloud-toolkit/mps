This tutorial shows how to construct an Admin method API call for [*AllDevices*](../APIs/MPSmethods/alldevices.md).  This guide walks through how to specifically implement it using Node.js.

## What You'll Need

**Hardware**

At minimum, to install and utilize the ActivEdge microservices, a network configuration must include:

-  A development PC with Windows 10 or Ubuntu 18.04 or newer
-  At least one Intel® vPro device

**Software** 

- [MPS](https://github.com/open-amt-cloud-toolkit/MPS), the Management Presence Server
- [RPS](https://github.com/open-amt-cloud-toolkit/RCS), the Remote Provisioning Server
- Intel&reg; vPro device, configured and connected to MPS

>**Note:** Instructions on how to set up the MPS and RPS servers to connect a vPro device can be followed in the [Local](../Local/overview.md) or [Local Docker](../Docker/overview.md) Build and Deploy Guides.

- The **development PC** requires the following software:
    - [Node.js](https://nodejs.org/)
    - [Visual Studio Code](https://code.visualstudio.com/) or any other IDE
  

## What You'll Do
Follow the steps in these sections sequentially: 

- Construct an Admin API Call to MPS
- View Device GUIDs

## Construct the Rest API

1\. Navigate to a file directory of your choice.

2\. Create and open a new javascript file with a name of your choice. In this guide we will refer to it as *SampleAPI.js*.

3\. Copy and paste the example code below.

4\. Replace *MPS-Server-IP-Address* with the IP Address of your development device or MPS server.

>**Note:** The AllDevices method uses the **admin** path (line 11). MPS methods use either **admin** or **amt** as the path. View the difference and all MPS methods [here](../APIs/indexMPS.md).

``` javascript hl_lines="9"
const https = require('https')
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
let postData = {
'method': 'AllDevices',
'payload': {}
}

const options = {
              hostname: '[MPS-Server-IP-Address]', //Your Development Device's IP or MPS Server IP
              port: '3000',
              path: '/admin',
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              }
}

const req = https.request(options, (res) => {
res.setEncoding('utf8')
res.on('data', (chunk) => {
console.log(chunk)
})
res.on('end', () => {
console.log('No more data in response.')
})
})

req.on('error', (e) => {
              console.error(`problem with request: ${e.message}`)
})

// Write data to request body
req.write(JSON.stringify(postData))
req.end()

```

<br>

## Execute the Rest API

1\. Open a Command Prompt or Terminal to execute the call.

2\. Navigate to the directory you saved the SampleAPI.js file.

3\. Run the code snippet using node.

```
node SampleAPI.js
```

Example Response:

>**Important Note:** This is one way to retrieve a device's GUID in the *host* field.  For **amt** path methods (i.e. Power Actions, Audit Logs, etc), the device GUID is **required** as part of the POST data. Other ways to retrieve a GUID can be found [here](../Topics/guids.md).

``` json
[{
             "host": "d12428be-9fa1-4226-9784-54b2038beab6",
             "amtuser": "admin",
             "mpsuser": "standalone",
             "icon": 1,
             "conn": 1,
             "name": "d12428be-9fa1-4226-9784-54b2038beab6"
}, {
             "name": "Win7-machine",
             "mpsuser": "standalone",
             "amtuser": "admin",
             "host": "c8429e33-d032-49d3-80e7-d45ddf046fff",
             "icon": 1,
             "conn": 0
}, {
             "name": "Win7-machine",
             "mpsuser": "standalone",
             "amtuser": "admin",
             "host": "12345678-9abc-def1-2345-123456789000",
             "icon": 1,
             "conn": 0
}]
```

<br>

The sample Node code snippet can be adapted for other MPS/RPS methods.  Find out what else you can do via the links below.

- View other available MPS Methods [here](../APIs/indexMPS.md).

- View other available RPS Methods [here](../APIs/indexRPS.md).