# Quickstart - To Bundle KVM control

This document shows how to bundle only KVM control and display it on a sample html page for testing. 

 - How to customize the control
 - How to create a bundle for only KVM control
 - How to add to sample html file 

## Prerequisites

In order to deploy and make changes, the following tools and application has to be installed on your development machine
-   [Git](https://git-scm.com/)
-   [Visual Studio Code](https://code.visualstudio.com/) or any other IDE 
-   [Node.js](https://nodejs.org/)
-   [MPS](https://github.com/open-amt-cloud-toolkit/mps) stands for **M**anagement **P**resence **S**erver
-	Build and deploy MPS MicroService locally.
-   Intel AMT device is configured and connected to MPS. See the [MPS](https://github.com/open-amt-cloud-toolkit/mps) for documentation.
-   Chrome Browser

## Download and Install MPS UI Toolkit

At a command prompt, run the following commands:
```
git clone https://github.com/open-amt-cloud-toolkit/ui-toolkit
cd UI_Toolkit
npm install
```

## Customize the control

To add new changes and test the changes  instantly before bundling the control, webpack dev server can be used

After making  the changes, open a command prompt and navigate to the root of ui-toolkit, run the below command.

```
npm start
```

- Open the browser and navigate to http://localhost:8080/kvm.htm?deviceId=<Device uuid>&server=<MPS server:port>

**Note:** By default webpack dev server runs on port 8080. If port 8080 is already in use, webpack automatically runs on  the next immediate available port


## Create Bundle for KVM
At a command prompt navigate to the root of UI_Toolkit, run the below command.
> **Note:** Remove or rename the existing **kvm.core.min.js**  in **dist/**
```
npm run build
```
A new **kvm.core.min.js** will be created in **dist/** directory.

To bundle the KVM control without node_modules,  run the below command in a command prompt on the root of ui-toolkit,

```
npm run built-ext
```

**Note**: The bundle generated using build-ext command can be used in react apps as an independent control

## Add to sample html page

To display the KVM control on a sample web page, update following changes to the existing **src/sample/sampleKVM.htm** page.

```
<body>
  <div id="kvm"></div>
  <script src="../../dist/kvm.core.min.js" crossorigin></script>
</body>
```
## Test the sample page
At a command prompt navigate to the root of UI_Toolkit, run the below command.
```
npx serve
```
Open Chrome browser, navigate to the following url
```
http://<localhost>:5000/src/sample/sampleKVM.htm?deviceId=<device GUID>&server=<mps IPaddress>:<mps port>
```
You will see the errors in the following scenario's: 
 - compilation errors if ui-toolkit has not downloaded and installed to your react app.
 - MPS server not running
 - MPS server running and device not connected.

