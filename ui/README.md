# AMT UI Toolkit

## Objective:

Create a collection of Intel&reg; AMT UI Components (reactjs) so developers can pick the functionality they want and integrate them into their console web applications.

## How? 

Use ReactJS to create the UI components for each Intel&reg; AMT functionality for developers to choose from. 

## Who can use this?

Any developer with prior experience creating web UI dashboards or consoles looking for out-of-band Intel&reg; AMT remote desktop functionality can use this. 

## Prerequisites

Whoever wants to integrate this UI functionality should already have a Management Presence Server (MPS) up and running in the cloud. He/She would need the url for MPS to configure the KVM component.

You should also have access to a development environment with Node and Git preinstalled to create your UI bundle.

### Steps to integrate Intel&reg; AMT Cloud UI toolkit:

1. Setup MPS

https://open-amt-cloud-toolkit.github.io/MPS/

2. Activate AMT on a device

https://open-amt-cloud-toolkit.github.io/MPS/activateAMT/


3. Installation:

Since UI toolkit is currently packaged as part of MPS, user needs to clone the MPS repo to get the UI functionality. Perform these steps on a client device which has git and node preinstalled.

```
git clone https://github.com/open-amt-cloud-toolkit/MPS.git
cd MPS
npm install
npm run build-kvm-prod
```

4. Sample Usage:

```
npx serve
```

The above command will run a local web server to serve the files from MPS directory. Once you see the message "Serving!...". Open the local web url (usually running at http://localhost:5000) and browse to sampleKVM.htm under ui/sample/ directory.

Add the query string '?deviceId={YOUR_DEVICE_GUID}&server={YOUR_MPS_SERVER_ADDRESS}' at the end after sampleKVM.htm.

Using the query string, UI RemoteDesktop control, connects to the server and displays webpage for KVM connection. Select RLE-8 or RLE-16 encoding method and then click on 'Connect' to connect to the device and see the remote desktop.

For third party integration, copy the ui folder under MPS into your own solution.

Use code snippet below (change mpsServer and deviceId strings appropriately. deviceId is the device AMT GUID. mpsServer is MPS microservice IP address and endpoint.)

Code snippet below assumes you are using Typescript for your UI development. If you are using Javascript, please change your import statements to point to your transpiled Javascript.

```
    import {KVMProps, RemoteDesktop} from 'ui/reactjs/components/UI';
    let kvmprops : KVMProps= {
        deviceId: "AMT_GUID", 
        mpsServer: "MPS_ADDRESS_IN_CLOUD",
        // Below are recommended settings
        mouseDebounceTime: 10, // Time in ms before next mousemove event is sent to remote device. For performance reasons.
        canvasHeight: "600",
        canvasWidth: "400"
    };

    // you can use RemoteDesktop like below in your web console. 
    <RemoteDesktop {...kvmprops} />

```