
Not sure how to implement? View the [UI Toolkit KVM Module Tutorial](../../Tutorials/uitoolkit.md) for a step-by-step walkthrough on pre-requisites and implementing a React Control using the UI Toolkit.


## Add Device Grid Control

The following code snippet shows how to add Device Grid control to the React application.
Open `src/App.js`, add the following code as show below:

!!! note
    Change `mpsServer` value to your MPS server address and appropriate port.

```javascript hl_lines="13"
import React from "react";
import { DeviceGrid, MpsProvider } from "ui-toolkit";
import '../node_modules/ui-toolkit/i18n.ts'

function App() {
  const data = {
    mpsKey: '<MPS API key>'
  };
  return (
    <div>
      <MpsProvider data={data}>
        <DeviceGrid
          mpsServer="<192.168.1.38>:3000"></DeviceGrid>
      </MpsProvider>
    </div>
  );
}

export default App;
```