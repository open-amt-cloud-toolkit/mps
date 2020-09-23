This tutorial shows how to construct an Admin method API call for [*ConnectedDevices*](../APIs/MPSmethods/connecteddevices.md). The ConnectedDevices method will retrieve a device's GUID and other information for all devices connected to the MPS server.

This guide walks through how to specifically implement it using Node.js.

This template can also be modified for other MPS Rest APIs by changing the following values:

- method
- payload
- path 

>**Note:** View all available MPS methods [here](../APIs/indexMPS.md).

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

>**Note:** The ConnectedDevices method uses the **admin** path. MPS methods use either **admin** or **amt** as the path. View the difference and all MPS methods [here](../APIs/indexMPS.md).

!!! note "Production Environment"
        By running MPS in dev mode, authentication is disabled for testing and demonstration purposes. In production, the MPS certificate should be signed by a CA. An API Key value should also be given in the headers of the API request.

``` javascript hl_lines="12"
const https = require('https')
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0 //For testing with self-signed certs, remove for production
let postData = {
'method': 'ConnectedDevices', //Retrieve all Devices Connected to MPS
'payload': {
    //Some methods such as PowerAction require a payload. 
    //This one does not as it just retrieves data of all connected devices.
}
}

const options = {
              hostname: 'MPS-Server-IP-Address', //Your Development Device's IP or MPS Server IP
              port: '3000',
              path: '/admin', //Supports admin and amt paths. See MPS API Docs for which to use for other different methods.
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
              'X-MPS-API-KEY': 'APIKEYFORMPS123!'
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

**Important Note:** This is one way to retrieve a device's GUID in the *host* field.  **For *amt* path methods (i.e. Power Actions, Audit Logs, etc), the device GUID is *required* as part of the POST data.** Save this value if you want to try other MPS methods. Other ways to retrieve a GUID can be found [here](../Topics/guids.md).

``` json

//Command Prompt Output
response :  [{"host":"d12428be-9fa1-4226-9784-54b2038beab6",
"amtuser":"admin","mpsuser":"standalone","icon":1,"conn":1,
"name":"d12428be-9fa1-4226-9784-54b2038beab6"}  ]



//JSON Pretty Print Example 
[{
    "host": "d12428be-9fa1-4226-9784-54b2038beab6",
    "amtuser": "admin",
    "mpsuser": "standalone",
    "icon": 1,
    "conn": 1,
    "name": "d12428be-9fa1-4226-9784-54b2038beab6"
}]

```

<br>

## Other Methods

The sample Node code snippet can be adapted for other MPS/RPS methods.  Find out what else you can do via the links below.

- View other available MPS Methods to manage a device, [here](../APIs/indexMPS.md).

- View other available RPS Methods for server configuration and provisioning, [here](../APIs/indexRPS.md).