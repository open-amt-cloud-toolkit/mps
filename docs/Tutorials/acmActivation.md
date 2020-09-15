## ACM Activation

Intel AMT&reg; devices are capable of being activated into two modes:

- Client Control Mode: This mode limits some of Intel AMT functionality, reflecting the lower level of trust.

    Features requiring User Consent:
    
      - Keyboard, Video, Mouse (KVM) Control
      - IDE-Redirection for sharing and mounting images remotely

- Admin Control Mode: In this mode, there are no limitations to Intel AMT functionality. This reflects the higher level of trust associated with these setup methods.

### What You'll Need

- Provisioning Certificate

    By purchasing a certificate, you'll be able to remotely activate an Intel AMT device in Admin Control Mode (ACM). This feature enables you to disable User Consent. Provisioning Certificates are available from four different Certificate Authorities:

    - [Comodo](https://www.intel.com/content/www/us/en/architecture-and-technology/intel-active-management-technology/how-to-install-comodo-certificates.html)
    - [DigiCert](https://www.intel.com/content/www/us/en/support/articles/000055009/technologies.html)
    - [Entrust](https://www.intel.com/content/www/us/en/support/articles/000055010/technologies/intel-active-management-technology-intel-amt.html)
    - [GoDaddy](https://www.intel.com/content/dam/support/us/en/documents/software/software-applications/how_to_purchase_and_install_godaddy_certificates_for_setup_and_configuration.pdf)

- Set the Domain Suffix

    Ways to set the domain suffix of the AMT device:

    - Manually on the AMT device through MEBX, find instructions on how to do it [here](../Topics/mebx.md)
    - Set DHCP Option 15 to DNS Suffix within the Router settings

<br>

### Create a Domain

>**Important Note:** This tutorial assumes both the MPS and RPS servers were successfully set up and running. If not, please refer to [Get Started with Microservices Locally](../Local/overview.md) to begin.

In addition to creating a CIRA Config and a Profile. A Domain **must** be created.

1\. Select the Domains tab from the left-hand menu.

2\. In the top-right corner, click New.

[![RPS New Domain](../assets/images/RPS_NewDomain.png)](../assets/images/RPS_NewDomain.png)

<br>

3\. Specify a Domain Name of your choice.

4\. Provide your Domain Suffix. This is the actual DNS Suffix of the network domain that is set in DHCP Option 15 or manually on the AMT device through MEBX.

5\. Click Browse and select your purchased Provisioning Certificate.  This certificate must contain the private key.

6\. Provide the Password of the Provisioning Certificate used to encrypt the .pfx file.

7\. Click Create.

After successfully creating the domain, continue with the activation process by building and running the Remote Provisioning Client. For information and steps on how to build and run RPC, [continue here](../General/buildRPC.md).

Example Domain:
    
[![RPS Domain Creation](../assets/images/RPS_CreateDomain.png)](../assets/images/RPS_CreateDomain.png)
