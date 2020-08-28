# Deploy Microservices with Docker*

This section lists prerequisites and the expected network configuration. In addition, it outlines the setup of the [Product Name]'s microservices and client application.

## Deployment Paths

There are two [Product name] deployment paths using Docker:

For experienced or returning users, use these quick links: 

- [Docker Images on a Local Development System](https://github.impcloud.net/Danger-Bay/OpenAMTCloudToolkit-Docs/blob/kimberlyx-davis-home-page-revamp/docs/Docker/dockerLocal.md) 
- [Docker Images on the Cloud](https://github.impcloud.net/Danger-Bay/OpenAMTCloudToolkit-Docs/blob/kimberlyx-davis-home-page-revamp/docs/Docker/dockerCloud.md)

## What You'll Need for Local Installation

**Hardware**

At minimum, to install and operate the [Product Name], a network configuration must include:

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

## What You'll Do for Local Installation

Follow the steps in these sections sequentially to deploy Docker* images on a local development system: 

- Build and Deploy Docker* Images MPS and RPS Locally -- [Start here.](https://github.impcloud.net/Danger-Bay/OpenAMTCloudToolkit-Docs/blob/kimberlyx-davis-home-page-revamp/docs/Docker/dockerLocal.md)
- Configure RPS
- Build RPC on Managed Device
- Manage Device

Estimated completion time:** 30 minutes

>**Important Note:** In this guide, we will activate devices into Client Control Mode (CCM).  Certain Intel AMT features, such as Keyboard, Video, Mouse (KVM), will require User Consent (a 6-digit code on the AMT Device's display) rather than immediate control.
>
>Alternatively, you may activate devices in Admin Control Mode (ACM). ACM mode does not require User Consent.  However, activating into ACM **requires** a Provisioning Certificate from a Certificate Provider. More information on the differences between ACM and CCM and acquiring certificates can be found [here](../Tutorials/acmActivation.md).

<br><br>

## What You'll Need for Cloud Installation

**Hardware**

At minimum, to install and operate the [Product Name], a network configuration must include:

-  A development PC 
-  At least one Intel® AMT device

Both systems must be on the same network. Instructions assume wired connections.

**Software**

Install additional software on the **development PC** for a Docker cloud deployment:

- [Microsoft Azure Subscription and Login](https://azure.microsoft.com/en-us/free/search/?&ef_id=EAIaIQobChMIwNTKptLm6gIVAxLnCh3ESwcQEAAYASAAEgL8uPD_BwE:G:s&OCID=AID2100131_SEM_EAIaIQobChMIwNTKptLm6gIVAxLnCh3ESwcQEAAYASAAEgL8uPD_BwE:G:s&gclid=EAIaIQobChMIwNTKptLm6gIVAxLnCh3ESwcQEAAYASAAEgL8uPD_BwE)

  **Microsoft Azure Configuration Details**

  - Create a subscription for Microsoft Azure.
  - Download [Microsoft Azure Command Line Interface (CLI)](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?view=azure-cli-latest).
  - Test the Microsoft Azure [CLI login](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli?view=azure-cli-latest).
  - [BW: Do you have anything to add?]

- [Docker Hub Account](https://hub.docker.com/signup/)

  **Docker Hub Account Configuration Details**

  - Creating an account on Docker Hub requires the creation of a **unique Docker ID** consisting of 4 to 30 lowercase letters and digits. This ID becomes the **user namespace** for hosted services. The password and Docker ID will be used in the deployment instructions.
  - A Docker Hub account enables user access to Docker Hub repositories, forums, support and more.
  - See detailed instructions for creating an account [here](https://docs.docker.com/docker-id/).

- [Docker Desktop on Windows](https://docs.docker.com/docker-for-windows/install/)

- [Docker Desktop on Linux*](https://docs.docker.com/docker-for-mac/install/)

  **Docker Configuration Details**

  - The Docker for Windows installer defaults to enabling and running all the required settings necessary for this tutorial.
  - After successful installation, the Docker icon (whale), appears on the task bar.
  - To troubleshoot the installation, [see the troubleshooting guide](https://docs.docker.com/docker-for-windows/troubleshoot/).

Install additional software on the **managed device**: 

- [git](https://git-scm.com/downloads)

- [Microsoft* Visual Studio](https://visualstudio.microsoft.com/), 2017 or newer version 

## What You'll Do for Cloud Installation

Follow the steps in these sections sequentially to deploy Docker* images on the cloud: 

- Build and Deploy Docker* Images MPS and RPS Locally -- [Start here.](https://github.impcloud.net/Danger-Bay/OpenAMTCloudToolkit-Docs/blob/kimberlyx-davis-home-page-revamp/docs/Docker/dockerCloud.md)
- Configure RPS
- Create and Build RPC on Managed Device
- Manage Devices


Estimated completion time:** 30 minutes

>**Important Note:** In this guide, we will activate devices into Client Control Mode (CCM).  Certain Intel AMT features, such as Keyboard, Video, Mouse (KVM), will require User Consent (a 6-digit code on the AMT Device's display) rather than immediate control.
>
>Alternatively, you may activate devices in Admin Control Mode (ACM). ACM mode does not require User Consent.  However, activating into ACM **requires** a Provisioning Certificate from a Certificate Provider. More information on the differences between ACM and CCM and acquiring certificates can be found [here](../Tutorials/acmActivation.md).