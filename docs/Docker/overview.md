# Get Started with ActivEdge Using Local Docker* Images
This section outlines the setup of the ActivEdge's microservices and client application. It also lists prerequisites and the expected network configuration. Take this path to install MPS and RPS as Docker images that will function as services on a local system or the cloud as in Figure 1.

If new to the software, please perform the preparation work below.

Return users can start [here.](dockerLocal.md)

<img src="../assets/images/HelloWorldDocker.png" alt="Hello World Docker" style="zoom:80%;" />

**Figure 1: Microservices deployed as Docker images**

## Who Takes This Path

Administrators who:

- Are familiar with Docker images, containers, and environment files
- Want a fast way to deploy cloud-based services

## What You'll Need

**Hardware**

At minimum, to install and use the ActivEdge, a network configuration must include:

-  A development PC 
-  At least one Intel® AMT device

Both systems must be on the same network. Instructions assume wired connections.

**Software for Local Deployment**

Install additional software on the **development PC** for a local Docker deployment:

- [Docker Desktop on Windows*](https://docs.docker.com/docker-for-windows/install/)

- [Docker Desktop on Linux*](https://docs.docker.com/docker-for-mac/install/)

  Docker Configuration Details

  - The Docker for Windows installer defaults to enabling and running all the required settings necessary for this tutorial.
  - Install before attempting the tutorial.
  - After successful installation, the Docker icon (whale), appears on the task bar.
  - To troubleshoot the installation, [see the troubleshooting guide](https://docs.docker.com/docker-for-windows/troubleshoot/).

- [Chrome](https://www.google.com/chrome)

- [git](https://git-scm.com/downloads)

Install additional software on the **managed device**: 

- [git](https://git-scm.com/downloads)

- [Microsoft* Visual Studio](https://visualstudio.microsoft.com/), 2017 or newer version 

>**Important Note:** This software is required to build the software in the Get Started Guides but would not be installed in a production environment. 

## What You'll Do for Local Installation

Follow the steps in these sections sequentially to deploy Docker* images on a local development system: 

- Build and Deploy Docker* Images MPS and RPS Locally -- [**Start here.**](dockerLocal.md)
- Configure RPS
- Build RPC on Managed Device
- Manage Device

Run instructions in these sections in Microsoft Windows* or Linux* environments. The instructions refer to the terminal window. The terminal may be A) the Windows Command Prompt in Administrator mode or B) the Linux* bash shell. 

Estimated completion time:** 30 minutes

>**Important Note:** In this guide, we will activate devices into Client Control Mode (CCM).  Certain Intel AMT features, such as Keyboard, Video, Mouse (KVM), will require User Consent (a 6-digit code on the AMT Device's display) rather than immediate control.
>
>Alternatively, you may activate devices in Admin Control Mode (ACM). ACM mode does not require User Consent.  However, activating into ACM **requires** a Provisioning Certificate from a Certificate Provider. More information on the differences between ACM and CCM and acquiring certificates can be found [here](../Tutorials/acmActivation.md).

<br><br>

