# Build and Deploy Microservices Locally

This section outlines the setup of ActivEdge's microservices and client application. Follow these instructions to install MPS and RPS on a development system, with RPC deployed on a managed device, as in Figure 1.

[![Local Overview](../assets/images/HelloWorldLocal.png)](../assets/images/HelloWorldLocal.png)

**Figure 1: Microservices deployed on a local development system.**


## What You'll Need

**Hardware**

At minimum, to install and utilize the ActivEdge microservices, a network configuration must include:

-  A development PC with Windows 10 or Ubuntu 18.04 or newer
-  At least one Intel® vPro device

Both systems must be on the same network. Instructions assume wired connections.

**Software** 

- The **development PC** hosts Management Presence Server (MPS) and Remote Provisioning Server (RPS) and requires the following software:
    - [Chrome* Browser](https://www.google.com/chrome)
    - [git](https://git-scm.com/downloads)
    - [node.js v10 or greater](https://nodejs.org/)
  
- The **managed device (test client), with Intel® vPro** runs the Remote Provisioning Client (RPC) and requires the following software:

    - [git](https://git-scm.com/downloads)
    - [Microsoft Visual Studio*](https://visualstudio.microsoft.com/): 2017 or newer version of Visual Studio Code or Visual Studio Community.

    >Note: Microsoft* Visual Studio on the managed devices is not typical for production environments. This is for demonstration purposes.
    >

## What You'll Do
Follow the steps in these sections sequentially: 

- Install MPS Locally
- Install RPS Locally
- Configure RPS
- Build RPC on Managed Device
- Manage Device

Run instructions in these sections can use Microsoft Windows* or Linux* environments. The terminal may be A) the Windows Command Prompt in Administrator mode or B) the Linux* shell/terminal. 

Estimated completion time:** 15 minutes

<br>

Next up: [Install MPS Locally](installMPS.md)
