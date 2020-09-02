# Get Started with ActivEdge Manually

This section outlines the setup of ActivEdge's microservices and client application. It also lists prerequisites and the expected network configuration. Follow these instructions to install MPS and RPS on a development system, with RPC installed on a managed device, as in Figure 1.

If new to the software, please perform the preparation work below. 

Return users can [**start here.**](installMPS.md)

<img src="../assets/images/HelloWorldLocal.png" alt="Hello World Local Install" style = "zoom:80%"/>

**Figure 1: Microservices deployed on a local development system.**


## Who Takes This Path

Administrators who:

- Want to try the solution on a simple LAN to learn about the modular components
- Don't want to set up a Docker account
- Are unfamiliar with cloud-based service setup

## What You'll Need

**Hardware**

At minimum, to install and utilize the ActivEdge microservices, a network configuration must include:

-  A development PC 
-  At least one Intel® AMT device

Both systems must be on the same network. Instructions assume wired connections.

**Software** 

Install additional software:

- The **development PC** hosts Management Presence Server (MPS) and Remote Provisioning Server (RPS) and requires the following software:
  - [Chrome](https://www.google.com/chrome)
  - [git](https://git-scm.com/downloads)
  - [node.js v10 or greater](https://nodejs.org/dist/latest-v10.x/)
  
- The **managed device (test client), with Intel® AMT** runs the Remote Provisioning Client (RPC) and requires the following software:
  - [Chrome](https://www.google.com/chrome)
  - [git](https://git-scm.com/downloads)
  - [Microsoft* Visual Studio](https://visualstudio.microsoft.com/), 2017 or newer version 

>Note: Microsoft* Visual Studio on a managed device is not typical for production environments. This is for demonstration purposes.
>

## What You'll Do
Follow the steps in these sections sequentially: 

- Install MPS Locally  -- [**Start here.**](installMPS.md)
- Install RPS Locally
- Configure RPS
- Build RPC on Managed Device
- Manage Device

Run instructions in these sections in Microsoft Windows* or Linux* environments. The instructions refer to the terminal window. The terminal may be A) the Windows Command Prompt in Administrator mode or B) the Linux* bash shell. 

Estimated completion time:** 30 minutes

>**Important Note:** In this guide, we will activate devices into Client Control Mode (CCM).  Certain Intel AMT features, such as Keyboard, Video, Mouse (KVM), will require User Consent (a 6-digit code on the AMT Device's display) rather than immediate control.
>
>Alternatively, you may activate devices in Admin Control Mode (ACM). ACM mode does not require User Consent.  However, activating into ACM **requires** a Provisioning Certificate from a Certificate Provider. More information on the differences between ACM and CCM and acquiring certificates can be found [here](../Tutorials/acmActivation.md).

>Additionally, these steps sometimes use generic descriptions for running command line instructions in a terminal window when used to mean either A) the Windows&ast; Command Prompt in Administrator mode or B) the Linux&ast; bash shell.  

