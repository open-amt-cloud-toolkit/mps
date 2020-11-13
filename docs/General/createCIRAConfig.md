Client Initiated Remote Access (CIRA) enables a CIRA-capable edge device to initiate and establish a persistent connection to the MPS rather than the MPS initiating contact with the edge device.  This enables access to edge devices that might be harder to reach behind a firewall or a firewall process, such as network address translation (NAT).

A CIRA Configuration provides the Remote Provisioning Client (RPC) the required information to establish the edge device's CIRA connection to the MPS Server during the activation process. 

**To create a CIRA Config:**

1. Select the **CIRA Configs** tab from the left-hand menu.

2. In the top-right corner, click **New.**
    [![RPS](../assets/images/RPS_NewCIRAConfig.png)](../assets/images/RPS_NewCIRAConfig.png)
    **Figure 1: Create a new CIRA Config.**

3. Specify a **Config Name** of your choice.

4. Select **IPV4**, and provide your developement system's IP Address.

5. Set **Port** to the default, 4433.

6. Set **User Name** and **Password** to the following:

    | Field         | Value      |
    | :------------ | :--------- |
    | **User Name** | standalone |
    | **Password**  | G@ppm0ym   |


7. Provide your developement system's IP address as the **Common Name** to generate the self-signed certificate by the MPS server.

8. Do not modify the default value of **Auto Load** for the **Mps root certificate format.**

9. Click **Load** under MPS Root Certificate.

10. Click **Create.**
    
    !!! example
        Example CIRA Config:
            
        [![RPS](../assets/images/RPS_CreateCIRAConfig.png)](../assets/images/RPS_CreateCIRAConfig.png)
        **Figure 2: Load MPS Root Certificate.** 

## Next up

Profiles provide configuration information to the AMT Firmware during the activation process with the Remote Provisioning Client (RPC). Profiles also distinguish between activating in: 

**[Create a Profile in Client Control Mode (CCM):](createProfileCCM.md)** This mode offers nearly all manageability features. However, it does not currently support Keyboard, Video, Mouse Control. For other features, such as Serial-Over-LAN or Storage Redirection (IDE-R, USB-R), **user consent is required**.

**[Create a Profile in Admin Control Mode (ACM):](createProfileACM.md)** ACM mode supports the same CCM features in addition to Keyboard, Video, Mouse (KVM) or Redirection **without user consent**. This means it is **not necessary** to have a person on-site to remote in and manage an edge device. In most IoT use cases, edge devices such as digital signage or kiosks may not be easily accessible or have available employees nearby. ACM mode proves immensely helpful in these scenarios.
