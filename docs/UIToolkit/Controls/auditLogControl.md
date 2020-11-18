
Not sure how to implement? View the [UI Toolkit KVM Module Tutorial](../../Tutorials/uitoolkit.md) for a step-by-step walkthrough on pre-requisites and implementing a React Control using the UI Toolkit.

## Add Audit Log Control

The following code snippet shows how to add Audit Log control to the React application.
Open `src/App.js`, add the following code as show below:

!!! note
    Change `deviceId` value to your device GUID `mpsServer` value to your MPS server address and appropriate port.

``` javascript hl_lines="14 15"
import React from "react";
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
        mpsServer="<192.168.1.38>:3000"></AuditLog>
      </MpsProvider>
    </div>
  );
}

export default App;
```