# Quickstart - To Bundle Profiles Control  

This document shows how to bundle profiles control and display it on a sample html page for testing.

  - how to customize the control
  - how to create a bundle for profiles control
  - how to add to sample html
  - how to add a new language for Internalization 


## Prerequisites

In order to deploy and make changes, the following tools and application has to be installed on your development machine
-   [Git](https://git-scm.com/)
-   [Visual Studio Code](https://code.visualstudio.com/) or any other IDE 
-   [Node.js](https://nodejs.org/)
-   [RPS](https://github.com/open-amt-cloud-toolkit/rps) stands for **R**emote **P**rovisioning **S**erver
-   Build and deploy RPS MicroService locally.
-	Intel AMT device is configured and connected to RPS. See the [RPS](https://github.com/open-amt-cloud-toolkit/rps) for documentation.
-   Chrome 

## Download and Install UI Toolkit

At a command prompt, run the following commands:
```
git clone https://github.com/open-amt-cloud-toolkit/ui-toolkit.git
cd ui-toolkit
npm install
```

## Customize the control

To add new changes and test the changes  instantly before bundling the control, webpack dev server can be used

After making  the changes, open a command prompt and navigate to the root of ui-toolkit, run the below command.

```
npm start
```

Open the browser and navigate to the following url

```
http://localhost:8080/profile.htm?server=<protocol>://<rps IPaddress>:<rps port>
```

**Note:** By default webpack dev server runs on port 8080. If port 8080 is already in use, webpack automatically runs on  the next immediate available port

## Create Bundle for Profile
At a command prompt navigate to the root of ui-toolkit, run the below command.
> **Note:** Remove or rename the existing **profile.core.min.js**  in **dist/**
```
npm run build
```
A new **profile.core.min.js** will be created in **dist/** directory.

To bundle the profile control without node_modules,  run the below command in a command prompt on the root of ui-toolkit,

```
npm run build-ext
```

**Note**: The bundle generated using build-ext command can be used in react apps as an independent control

## Add to sample html page

To display the profile control on a sample web page, update following changes to the existing **src/sample/sampleProfile.htm** page.

```
<body>
<div id="profileroot"></div>
<script src="../../dist/profile.core.min.js" crossorigin></script>
</body>
```

## Test the sample page
At a command prompt navigate to the root of ui-toolkit, run the below command.
```
npx serve
```
Open Chrome browser, navigate to the following url
```
http://<localhost>:5000/src/sample/sampleProfile.htm?server=<http>://<rps IPaddress>:<rps port>
```

## Add a new Language for Internationalization

 Please refer to [Localization](../localization.md) docs

