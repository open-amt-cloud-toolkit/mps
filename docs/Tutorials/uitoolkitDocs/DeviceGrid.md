# Quickstart  - To run devicegrid in development enviroment and bundle devicegrid control.

This document shows how to run devicegrid in devlopment enviroment and bundle devicegrid control and display it on sample html page.
 
- how to customize the control
- how to create a bundle for devicegrid control.
- how to add to sample html file.
- how to add a new language for Internalization 


## Prerequisites

In order to deploy and make changes, the following tools and application has to be installed on your development machine
-   [Git](https://git-scm.com/)
-   [Visual Studio Code](https://code.visualstudio.com/) or any other IDE 
-   [Node.js](https://nodejs.org/)
-   [MPS](https://github.com/open-amt-cloud-toolkit/MPS) stands for **M**anagement **P**resence **S**erver
-   Build and deploy MPS MicroService locally.
-   Intel AMT device is configured and connected to MPS. See the [MPS](https://github.com/open-amt-cloud-toolkit/MPS) for documentation.
-   Chrome Browser

## Download and Install MPS UI Toolkit

At a command prompt, run the following commands:
```
git clone https://github.com/open-amt-cloud-toolkit/ui-toolkit
cd ui-toolkit
npm install
```

## Customize control
To add new changes and test the changes  instantly before bundling the control, webpack dev server can be used

After making  the changes, open a command prompt and navigate to the root of ui-toolkit, run the below command.

```
npm start
```

-Open the browser and navigate  http://localhost:8080/device.htm?deviceId=<device GUID>&server=<mps IPaddress>:<mps port>


## Create Bundle for devicegrid

At a command prompt navigate to the root of UI_Toolkit, run the below command.
> **Note:** Remove or rename the existing **device.core.min.js**  in **dist/**
```
npm run build
```
A new **device.core.min.js** will be created in **dist/** directory.

To bundle the device grid control without node_modules,  run the below command in a command prompt on the root of ui-toolkit,

```
npm run built-ext
```
**Note**: The bundle generated using build-ext command can be used in react apps as an independent control

## Add to sample html page

To display the Device Grid control on a sample web page, update following changes to the existing **src/sample/sampleDG.htm** page.

```
<body>
  <div id="dgroot"></div>
  <script src="../../dist/device.core.min.js" crossorigin></script>
</body>
```

## Test the sample page
At a command prompt navigate to the root of UI_Toolkit, run the below command.
```
npx serve
```
Open Chrome browser, navigate to the following url
```
http://<localhost>:5000/src/sample/sampleDG.htm?deviceId=<device GUID>&server=<mps IPaddress>:<mps port>
```
You will see the errors in the following scenario's: 
 - compilation errors if  mps-ui-toolkit has not downloaded and installed to your react app.
 - MPS server not running
 - MPS server running and device not connected.

## Add a new Language for Internationalization

Please refer to [Localization](./localization.md) docs

