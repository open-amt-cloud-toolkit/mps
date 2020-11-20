
Not sure how to implement? View the [UI Toolkit KVM Module Tutorial](../../Tutorials/uitoolkit.md) for a step-by-step walkthrough on pre-requisites and implementing a React Control using the UI Toolkit.

## Add Profile Control

Open `src/App.js`, add the following code as show below:

!!! note
    Change `rpsServer` value to your RPS server address and appropriate port.

```javascript hl_lines="13"
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
        rpsServer="https://<192.168.1.38>:8081"/>
      </RpsProvider>
    </div>
  );
}

export default App;

```