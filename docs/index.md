# [Product Name] Overview

Intel<sup>®</sup> vPro™ Platforms offer hardware-enhanced security features and remote manageability, also known as out-of-band manageability, using Intel<sup>®</sup> Active Management Technology (Intel<sup>®</sup> AMT). With Intel<sup>®</sup> AMT, administrators manage, repair, and update network assets, such as systems and edge devices. In the event that a network asset is powered off or the operating system is unavailable, administrators can power on the asset. 

The [Product Name] provides modular microservices and libraries for integration of hardware provisioning, out-of-band manageability, and other Intel<sup>®</sup> AMT features with both new and existing management consoles, software solutions, and more. As an open source implementation, the [Product Name] makes it easier for IT departments and ISVs to adopt, integrate, and customize out-of-band management solutions for Intel<sup>®</sup> vPro™ Platforms.

Read more about Intel<sup>®</sup> AMT features and capabilities [here](https://www.intel.com/content/www/us/en/architecture-and-technology/intel-active-management-technology.html).

## Goals

By the end of this guide, you will have gained experience using these three core modules, shown in Figure 1:

1. **Management Presence Server (MPS)** - A microservice that utilizes an Intel<sup>®</sup> vPro™ feature, Client Initiated Remote Access (CIRA), for enabling edge, cloud devices to maintain a persistent connection for out-of-band manageability features such as power control or KVM control
2. **Remote Provisioning Server (RPS)** - A microservice that activates Intel<sup>®</sup> AMT-based platforms using pre-defined profiles and connects them to the MPS for manageability use cases
3. **Remote Provisioning Client (RPC)** - A thin, client application that communicates with the RPS server to activate Intel<sup>®</sup> AMT

## Integration Paths

There are two [Product name] integration paths. If new to [Product name] and unsure about which to choose, consult the sections sections below. 

For experienced or returning users, use these quick links:

- [Get Started with Microservices Locally](https://github.impcloud.net/Danger-Bay/OpenAMTCloudToolkit-Docs/blob/master/docs/Local/overview.md)
- [Deploy Microservices with Docker*](https://github.impcloud.net/Danger-Bay/OpenAMTCloudToolkit-Docs/blob/master/docs/Docker/overview.md)

### Get Started with Microservices

Take this path to install MPS and RPS on a development system, with RPC installed on a managed device, as in Figure 1.

<img src="./assets/images/HelloWorldLocal.png" alt="HelloWorldLocal" style="zoom:80%;" />

**Figure 1: Microservices deployed on a local development system.**

This path includes documentation sections: 

- Install MPS Locally
- Install RPS Locally 
- Configure RPS 
- Build RPC on Managed Device
- Manage Device

[Start here.](https://github.impcloud.net/Danger-Bay/OpenAMTCloudToolkit-Docs/blob/master/docs/Local/overview.md)

#### Who Takes This Path

Administrators who:

- Want to try the solution on a simple LAN to learn about the modular components
- Don't want to set up a Docker account
- Are unfamiliar with cloud-based service setup

### Deploy Microservices with Docker*

Take this path to install MPS and RPS as Docker images that will function as services on the cloud as in Figure 2.

<img src="./assets/images/HelloWorldDocker.png" alt="HelloWorldDocker" style="zoom:80%;" />

**Figure 2: Microservices deployed as Docker images**

This path includes documentation sections: 
- Docker Images on a Local Development System 
- Docker Images on the Cloud

In addition, complete these sections from Get Started with Microservices: 
- Configure RPS 
- Manage Device

[Start here.](https://github.impcloud.net/Danger-Bay/OpenAMTCloudToolkit-Docs/blob/master/docs/Docker/overview.md)

#### Who Takes This Path

Administrators who:

- Are familiar with Docker images, containers, and environment files
- Want a fast way to deploy cloud-based services
- Do not have a LAN on which to explore the product

## Additional Intel<sup>®</sup> AMT Resources

For additional information about Intel<sup>®</sup> AMT, see the following links:

- [Intel<sup>®</sup> vPro Overview](https://software.intel.com/content/www/us/en/develop/topics/iot/hardware/vpro-platform-retail.html)
- [Video Link](https://www.intel.com/content/www/us/en/support/articles/000026592/technologies.html)
- [Detailed Setup document](https://software.intel.com/en-us/articles/getting-started-with-intel-active-management-technology-amt)


Click the **Next** link at the bottom left of this page to continue on the "Get Started with Microservices Locally" path.

