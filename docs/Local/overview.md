# Get Started with Microservices Locally

This section lists the prerequisites and expected network configuration for installing RPS on a development system, and outlines the setup of the [Product Name]'s microservices and client application.

## What You'll Need

**Hardware**

At minimum, to install and operate the [Product Name], your network configuration must include:

-  A development PC 
-  At least one Intel® AMT device

Both systems must be on the same network. These instructions assume wired connections.

**Software** 

- The **development PC** hosts Management Presence Server (MPS) and Remote Provisioning Server (RPS) and requires the following software:
  - [Chrome](https://www.google.com/chrome)
  - [git](https://git-scm.com/downloads)
  - [node.js v10 or greater](https://nodejs.org/dist/latest-v10.x/)
  
- The **managed device (test client), with Intel<sup>®</sup> AMT** runs the Remote Provisioning Client (RPC) and requires the following software:
  - [Chrome](https://www.google.com/chrome)
  - [git](https://git-scm.com/downloads)
  - [Microsoft* Visual Studio](https://visualstudio.microsoft.com/), 2017 or newer version 

## What You'll Do

Follow the steps in these sections, sequentially: 

- Install MPS Locally  -- [Start here.](https://github.impcloud.net/Danger-Bay/OpenAMTCloudToolkit-Docs/blob/master/docs/Local/installMPS.md)
- Install RPS Locally
- Configure RPS
- Build RPC on Managed Device
- Manage Device

**Estimated completion time:** 30 minutes

>**Important Note:** This guide directs you to activate devices into Client Control Mode (CCM). In this mode, certain Intel<sup>®</sup> AMT features, such as Keyboard, Video, Mouse (KVM), require User Consent (a 6-digit code on the AMT device's display) rather than granting immediate control.
>
>As an alternate option, you can activate devices in Admin Control Mode (ACM). ACM mode does not require User Consent. However, activating ACM requires a *Provisioning Certificate* from a Certificate Provider. You can find more information on the differences between ACM and CCM and acquiring certificates [here](../Tutorials/acmActivation.md).
>
>Additionally, these steps sometimes use generic descriptions for running command line instructions in a terminal window when used to mean either A) the Windows&ast; Command Prompt in Administrator mode or B) the Linux&ast; bash shell.  

Click the **Next** link at the bottom right of the page to install MPS locally.