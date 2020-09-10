Estimated completion time: 15 minutes

## Log in to the Web Server

1\. Open Chrome* browser and navigate to the web server using your development device's IP address on port 3000.

```
https://[Development-IP-Address]:3000
```

>**Note:** You must use an IP Address to connect to the web server. Using *localhost* will not work.

2\. Because we are using self-signed certificates, we will be prompted by a warning screen. Click Advanced, then Proceed to continue to connect to the webserver.

3\. Log in to the web portal with the credentials below.

**Default credentials:**

| Field       |  Value    |
| :----------- | :-------------- |
| **Username**| standalone |
| **Password**| G@ppm0ym |

4\. Select Remote Provisioning Server on the web portal.

[![WebUI](../assets/images/WebUI_HomeRPS.png)](../assets/images/WebUI_HomeRPS.png)

<br>


### Create a CIRA Config

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

| Field       |  Value    |
| :----------- | :-------------- |
| **User Name**| standalone |
| **Password**| G@ppm0ym |
    

7\. Provide your Development Device's IP address as the Common Name to generate the self-signed certificate by the MPS server.

8\. Leave Mps root certificate format to the default, Auto Load.

9\. Click Load under MPS Root Certificate.

10\. Click Create.

Example CIRA Config:
    
[![RPS](../assets/images/RPS_CreateCIRAConfig.png)](../assets/images/RPS_CreateCIRAConfig.png)

<br>

### Create a Profile

Profiles provide configuration information to the AMT Firmware during the activation process with the Remote Provisioning Client (RPC).

Profiles also distinguish between activating a device in **Client Control Mode** (CCM) or **Admin Control Mode** (ACM). In this guide, we will activate into Client Control Mode. For more information on Admin Control Mode and the differences, [click here](../Tutorials/acmActivation.md).

!!! note "Production Environment"
        In a production environment, devices are typically activated in ACM mode.  ACM mode enables KVM access to devices without user consent. In most IoT use cases, edge devices such as digital signage or kiosks may not have immediate access to it or employees nearby.  ACM mode proves immensely helpful in these scenarios.

<br>

1\. Select the Profiles tab from the menu on the left.

2\. Under the Profiles tab, click New in the top-right corner to create a profile.

3\. Specify a Profile Name of your choice.

4\. Uncheck Generate Random Password.

!!! note "Production Environment"
        In a production environment, you typically generate a random password for each AMT device to create a stronger, more secure AMT environment.

5\. Provide a strong AMT Password. 
    
>**Note:** This password must meet standard, 'strong' password requirements:    
>> - 8 to 32 characters
>> - One uppercase, one lowercase, one numerical digit, one special character

6\. Select the name of the CIRA Config you created previously from the drop-down menu.

7\. Under Activation, select 'Client Control Mode' from the dropdown menu.

>**Note:** If you'd prefer to activate the device into Admin Control Mode (ACM), click [here](../Tutorials/acmActivation.md).

8\. Click Create.

Example Profile:

[![RPS](../assets/images/RPS_CreateProfile.png)](../assets/images/RPS_CreateProfile.png)

<br>

Next up: [Build RPC on a Managed Device](../General/buildRPC.md)
