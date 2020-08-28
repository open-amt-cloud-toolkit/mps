# Quickstart  - To run sol in development enviroment and bundle SerialOverLan control.

This document shows how to run serialoverlan in devlopment enviroment and bundle serialoverlan control and display it on sample html page.
 
- how to run sol control in development enviroment
- how to create a bundle for sol control.
- how to add to sample html file.


## Prerequisites

In order to deploy and make changes, the following tools and application has to be installed on your development machine
-   [Git](https://git-scm.com/)
-   [Visual Studio Code](https://code.visualstudio.com/) or any other IDE 
-   [Node.js](https://nodejs.org/)
-   [MPS](https://github.com/open-amt-cloud-toolkit/MPS) stands for **M**anagement **P**resence **S**erver
-   Intel AMT device is configured and connected to MPS. See the [MPS](https://github.com/open-amt-cloud-toolkit/MPS) for documentation.
-   Chrome Browser


## Download and Install MPS MicroService
At a command prompt, run the following commands:
```
git clone https://github.impcloud.net/Danger-Bay/MPS_MicroService.git
cd MPS_MicroService
npm install
```

## start mps server

At a command prompt navigate to the root of MPS_UI_Toolkit, run the below command.
npm start

## Download and Install MPS UI Toolkit

At a command prompt, run the following commands:
```
git clone https://github.impcloud.net/Danger-Bay/MPS_UI_Toolkit.git
cd MPS_UI_Toolkit
npm install
```

## Run sol in development enviroment
At a command prompt navigate to the root of MPS_UI_Toolkit, run the below command.
```
npm start
```

open chrome browser, navigate to following url

```
http://localhost:8080/sol.htm?deviceId=<device GUID>&server=<mps IPaddress>:<mps port>
```

## Create Bundle for SOL

At a command prompt navigate to the root of MPS_UI_Toolkit, run the below command.
> **Note:** Remove or rename the existing **sol.core.min.js**  in **dist/**
```
npm run build
```
A new **sol.core.min.js** will be created in **dist/** directory.

To bundle the Serial Over LAN control without node_modules,  run the below command in a command prompt on the root of ui-toolkit,

```
npm run build-ext
```

**Note**: The bundle generated using build-ext command can be used in react apps as an independent control

## Add to sample html page

To display the SOL control on a sample web page, update following changes to the existing **src/sample/sampleSOL.htm** page.

```
<body>
  <div id="sol"></div>
  <script src="../../dist/sol.core.min.js" crossorigin></script>
</body>
```

## Test the sample page
At a command prompt navigate to the root of MPS_UI_Toolkit, run the below command.
```
npx serve
```
Open Chrome browser, navigate to the following url
```
http://<localhost>:5000/src/sample/sampleKVM.htm?deviceId=<device GUID>&server=<mps IPaddress>:<mps port>
```
You will see the errors in the following scenario's: 
 - compilation errors if  mps-ui-toolkit has not downloaded and installed to your react app.
 - MPS server not running
 - MPS server running and device not connected.


 ## By-pass CORS Security for testing

To display UI controls on local react Web UI for **testing**, make the following changes to by-pass CORS.

- Go to your local **mps** application where it is running.
- Press **ctrl+c** to exit the application. 
- Edit the file **mps/src/server/webserver.ts** 
- Update the code as shown below to allow any origin by MPS 

Search for **X-Frame-Options** and update the code as shown below
```
//Clickjacking defence
this.app.use(function (req, res, next) {
	//res.setHeader('X-Frame-Options', 'SAMEORIGIN');
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers','*');
	if (req.method  ===  'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'POST');
		return  res.status(200).json({});
	}	
	next();
})
```
Search for **isAuthenticated** and comment the code as shown below
```
isAuthenticated(req, res, next) {
// if (req.session.loggedin){
// return next();
// }

// if (req.header('User-Agent').startsWith('Mozilla')) {
// // all browser calls that are not authenticated
// res.redirect('/login.htm')
// return;
// }

// // other api calls
// if(req.header('X-MPS-API-Key') !== process.env.XAPIKEY){
// res.status(401).end("Not Authenticated.")
// return;
// }
// else
return  next();
}
```
- Save the changes.
- At the command prompt, run the below command from the root of **mps** application 
```
npm start
```



