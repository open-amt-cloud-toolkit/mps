# Build and Deploy Microservices Locally

This section contains instructions for deploying the Open AMT Cloud Toolkit's [Management Presence Server (MPS)](../Glossary.md#m) and [Remote Provisioning Server (RPS)](../Glossary.md#r) on a local development system. These Hello World deployment instructions detail how to install the microservices manually on a development system and are not intended as production environment instructions. 

[![Local Overview](../assets/images/ManualDeploymentWorkflow.png)](../assets/images/ManualDeploymentWorkflow.png)

**Figure 1: Deploy microservices on a local development system.**


## What You'll Need

### Hardware

**Configure a network that includes:**

-  A development system running Windows® 10 or Ubuntu* 18.04 or newer 
-  At least one Intel vPro® device to manage
-  A flash drive or equivalent means to transfer files between


Both systems must use a wired (i.e., cable) connection on the same network.

### Development System Software

**Before MPS and RPS installation, install the following software:**

- [Chrome* Browser](https://www.google.com/chrome)
- [git](https://git-scm.com/downloads)
- [Node.js* LTS 12.x.x or newer](https://nodejs.org/)
  
### Intel vPro® Managed Device Software

**Before Remote Provisioning Client (RPC) installation, install the following software:**

- [git](https://git-scm.com/downloads)
- [Microsoft Visual Studio*](https://visualstudio.microsoft.com/): 2019 or newer version of Visual Studio Community/Professional

!!! note
    Running Microsoft Visual Studio* on a managed device to build the RPC is for demo purposes. This is not typical for production environments.



## What You'll Do

**To complete a Hello World microservice deployment:**

- Install MPS Locally
- Install RPS Locally
- Login and Configure RPS
- Build RPC
- Copy RPC to a Managed Device


**To connect the managed device:**

- Run RPC on a Managed Device
- Manage the Device with MPS


These sections include instructions for Windows and Linux environments. Run instructions in a terminal window, the Windows Command Prompt in Administrator mode or the Linux shell/terminal.

Estimated completion time: **15 minutes**

## Next up
**[Install MPS Locally](installMPS.md)**
