# Quickstart: Add MPS UI Toolkit controls to WebUI

This document shows how to integrate controls from the MPS UI Toolkit into a React.js app for testing or development.

- How to create a new React app
- How to add UI controls to the React app
- How to create bundles for each UI control

## Prerequisites

The following tools and application must be installed on your development machine for this task:

- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) or any other IDE
- [Node.js](https://nodejs.org/)
- [MPS](https://github.com/open-amt-cloud-toolkit/MPS), the Management Presence Server
- [RPS](https://github.com/open-amt-cloud-toolkit/RCS), the Remote Provisioning Server
- Intel&reg; AMT device, configured and connected to MPS
- Chrome* browser

[![UI Toolkit](../assets/images/HelloWorld.png)](../assets/images/HelloWorld.png)

## Create a New React App

1\. At a command prompt, go to your preferred development directory.

2\. Run the following commands to create sample React app named **my-app**.

```
npx create-react-app my-app
cd my-app
npm start
```

>**Note**: By default, React apps run on port 3000. If port 3000 is already used by the MPS server or any other app, you'll beprompted to use another port. If this happens, enter 'Y'
>
>Output like the following should appear in the terminal window. By default, React launches in your machine's default browser.

```
You can now view my-app in the browser.
Local: http://localhost:3001
On Your Network: http://172.16.17.4:3001
```

3\. Press **Ctrl + C** in the terminal window to exit the application.

## Add UI Toolkit

1\. To access UI controls in the React app, add the following line to dependencies section in **my-app/package.json**:

   ```
   "ui-toolkit": "git+https://github.com/open-amt-cloud-toolkit/ui-toolkit.git"
   ```

2\. At a command prompt, navigate to the root directory of the React app, and run the following commands to install ui-toolkit to node-modules and run the web UI locally:

   ```
   npm install
   npm start
   ```

### Add KVM Control

The code snippet below adds KVM control to the React application. Open **src/App.js** and add it.

>**Note:** Change the **deviceId** value to your device GUID, and the **mpsServer** value to your MPS server address and appropriate web port.

```
import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { KVM, MpsProvider } from "ui-toolkit";
import '../node_modules/mps-ui-toolkit/i18n.ts';
function App() {
  const data = {
    mpsKey: '<MPS API key>'
  };
  return (
    <div className="App">
      <MpsProvider data={data}>
        <KVM deviceId="038d0240-045c-05f4-7706-980700080009"
        mpsServer="localhost:9300/relay"
        mouseDebounceTime="200"
        canvasHeight="100%"
        canvasWidth="100%"></KVM>
      </MpsProvider>
    </div>
  );
}

export default App;
```

### Add Audit Log Control

The following code snippet shows how to add Audit Log control to the React application.
Open **src/App.js**, add the following code as show below:

> **Note:** Change **deviceId** value to your device GUID **mpsServer** value to your MPS server address and appropriate webport.

```
import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { AuditLog, MpsProvider } from "ui-toolkit";

function App() {
  const data = {
    mpsKey: '<MPS API key>'
  };
  return (
    <div className="App">
      <MpsProvider data={data}>
        <AuditLog
        deviceId="038d0240-045c-05f4-7706-980700080009"
        mpsServer="localhost:9300"></AuditLog>
      </MpsProvider>
    </div>
  );
}

export default App;
```

### Add Device Grid Control

The following code snippet shows how to add Device Grid control to the React application.
Open **src/App.js**, add the following code as show below:

> **Note:** Change **mpsServer** value to your MPS server address and appropriate webport.

```
import React from "react";
import { DeviceGrid, MpsProvider } from "ui-toolkit";
import '../node_modules/mps-ui-toolkit/i18n.ts'

function App() {
  const data = {
    mpsKey: '<MPS API key>'
  };
  return (
    <div>
      <MpsProvider data={data}>
        <DeviceGrid
          mpsServer="localhost:9300"></DeviceGrid>
      </MpsProvider>
    </div>
  );
}

export default App;
```

### Add Serial Over LAN Control

The following code snippet shows how to add Serial Over LAN control to the React application.
Open **src/App.js**, add the following code as show below:

> **Note:** Change **deviceId** value to your device GUID **mpsServer** value to your MPS server address and appropriate webport.

```
import React from "react";
import { SOL, MpsProvider } from "ui-toolkit";
import '../node_modules/mps-ui-toolkit/i18n.ts'

function App() {
  const data = {
    mpsKey: '<MPS API key>'
  };
  return (
    <div>
      <MpsProvider data={data}>
        <SOL deviceId="038d0240-045c-05f4-7706-980700080009"
        mpsServer="localhost:9300"></SOL>
      </MpsProvider>
    </div>
  );
}

export default App;
```

### Add Profile Control

Open **src/App.js**, add the following code as show below:

> **Note:** Change **rpsServer** value to your RPS server address and appropriate webport.

```
import React from "react";
import { Profile, RpsProvider } from "ui-toolkit";
import '../node_modules/ui-toolkit/i18n.ts'

function App() {
  const data = {
    rpsKey: '<RPS API key>'
  };
  return (
    <div>
      <RpsProvider data={data}>
        <Profile
        rpsServer="http://localhost:8081"/>
      </RpsProvider>
    </div>
  );
}

export default App;

```

### Add CIRA configs Control

Open **src/App.js**, add the following code as show below:

> **Note:** Change **rpsServer** value to your RPS server address and appropriate webport.

```
import React from "react";
import { CiraEditor, RpsProvider } from "ui-toolkit";
import '../node_modules/ui-toolkit/i18n.ts'

function App() {
  const data = {
    rpsKey: '<RPS API key>'
  };
  return (
    <div>
      <RpsProvider data={data}>
        <CiraEditor
        rpsServer="http://localhost:8081"/>
      </RpsProvider>
    </div>
  );
}

export default App;

```

### Add Domain Control

Open **src/App.js**, add the following code as show below:

> **Note:** Change **rpsServer** value to your RPS server address and appropriate webport.

```
import React from "react";
import { DomainEditor, RpsProvider } from "ui-toolkit";
import '../node_modules/ui-toolkit/i18n.ts'

function App() {
  const data = {
    rpsKey: '<RPS API key>'
  };
  return (
    <div>
      <RpsProvider data={data}>
        <DomainEditor
        rpsServer="http://localhost:8081"/>
      </RpsProvider>
    </div>
  );
}

export default App;

```

### Test the changes

At a command prompt navigate to the root of react app, and run the web UI locally if it has been stopped:

```
npm start
```

Go to the chrome browser, ensure controls shows up correctly.

You will see the errors in the following scenario's:

- compilation errors if mps-ui-toolkit has not downloaded and installed to your react app.
- MPS server not running
- MPS server running and device not connected.
- If your browser is IE / Edge, there might be some compatibility issues.

## By-pass CORS Security for testing

### MPS

To display UI controls on local react Web UI for **testing**, make the following changes to by-pass CORS.

- Go to your local **mps** application where it is running.
- Press **ctrl+c** to exit the application.
- Edit the file **mps/src/server/webserver.ts**
- Update the code as shown below to allow any origin by MPS

Search for **X-Frame-Options** and update the code as shown below

```

//Clickjacking defence
this.app.use((req, res, next) => {
  //res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers','*');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', '*');
    return res.status(200).json({});
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
return next();

}

```

- Save the changes.

- At the command prompt, run the below command from the root of **mps** application

```
npm start
```

## Run RPS server in DEV mode

To display UI controls on local react Web UI for **testing**, make the following changes.

- Go to your local **rps** application where it is running.
- Press **ctrl+c** to exit the application.
- Edit the file **rps/.rpsrc**

Update the _xapikey_ value with below snippet

```
"xapikey": "APIKEYFORRPS123!"
```

- Save the changes.
- At the command prompt, run the below command from the root of **rps** application

```
npm run dev
```

## Customize and create bundles

- [AuditLog](uitoolkitDocs/auditLog.md)
- [KVM](uitoolkitDocs/kvm.md)
- [Device Grid](uitoolkitDocs/DeviceGrid.md)
- [Serial Over LAN](uitoolkitDocs/SerialOverLAN.md)
- [Profile Editor](uitoolkitDocs/Profiles.md)
- [CIRA Configs](uitoolkitDocs/CIRAConfigs.md)
- [Domains](uitoolkitDocs/Domains.md)

## License Note

If you are distributing the FortAwesome Icons, please provide attribution to the source per the [CC-by 4.0](https://creativecommons.org/licenses/by/4.0/deed.ast) license obligations.
