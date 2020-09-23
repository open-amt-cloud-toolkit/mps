## Create a CIRA Config

CIRA stands for Client Initiated Remote Access.  It allows a CIRA-capable edge device to reach out and establish a persistent connection to the MPS server rather than the MPS server reaching to the edge device.  This enables access to edge devices that might be harder to reach behind things such as firewalls/NATs/etc.

A CIRA Configuration provides the Remote Provisioning Client (RPC) the required info to establish the edge device's CIRA connection to the MPS Server during the activation process.  

<br>

1\. Select the CIRA Configs tab from the left-hand menu.

2\. In the top-right corner, click New.

[![RPS](../assets/images/RPS_NewCIRAConfig.png)](../assets/images/RPS_NewCIRAConfig.png)

3\. Specify a Config Name of your choice.

4\. Select IPV4, and provide your Development Device's IP Address.

5\. Set Port to the default, 4433.

6\. Set User Name and Password to the following:

| Field         | Value      |
| :------------ | :--------- |
| **User Name** | standalone |
| **Password**  | G@ppm0ym   |


7\. Provide your Development Device's IP address as the Common Name to generate the self-signed certificate by the MPS server.

8\. Leave Mps root certificate format to the default, Auto Load.

9\. Click Load under MPS Root Certificate.

10\. Click Create.

Example CIRA Config:
    
[![RPS](../assets/images/RPS_CreateCIRAConfig.png)](../assets/images/RPS_CreateCIRAConfig.png)

## Next up

Profiles provide configuration information to the AMT Firmware during the activation process with the Remote Provisioning Client (RPC). Profiles also distinguish between activating in: 

**[Create a Profile in Client Control Mode (CCM):](createProfileCCM.md)** This mode offers nearly all manageability features. However, it does not currently support Keyboard, Video, Mouse Control. For other features, such as Serial-Over-LAN or Storage Redirection (IDE-R, USB-R), user consent is required.

**[Create a Profile in Admin Control Mode (ACM):](createProfileACM.md)** In a production environment, devices are typically activated in ACM mode. ACM mode enables KVM access to devices without user consent. In most IoT use cases, edge devices such as digital signage or kiosks may not have immediate access to it or employees nearby. ACM mode proves immensely helpful in these scenarios.
