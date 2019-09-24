# Activate the Device with Intel&reg; Active Management Technology or Intel&reg; AMT

* [Video Link](https://www.intel.com/content/www/us/en/support/articles/000026592/technologies.html)
* [Detailed Setup document](https://software.intel.com/en-us/articles/getting-started-with-intel-active-management-technology-amt)

## Steps to Activate Intel&reg; Active Management Technology or Intel&reg; AMT
1.      Connect a device to a Monitor and power up.

2.      The Intel&reg; AMT platform displays the **BIOS startup screen** during power up, then processes the BIOS Extensions.

Entry into the Intel&reg; AMT BIOS Extension (MEBx) is BIOS vendor-dependent.
If you are using an Intel&reg; AMT reference platform (SDS or SDP), the display screen prompts you to press **Ctrl+P**. Then, the control passes to the Intel&reg; Converged Security and Management Engine (Intel&reg; CSME) or MEBx main menu.

3.      Enter the Intel&reg; CSME default password **admin**.

4.      Change the default password (required to proceed).

5.      From the **Main Menu**, select **Intel&reg; AMT Configuration**.

6.      **Manageability Feature Selection**: Select/Verify this is set to - **Enabled**.

7.      **Activate Network Access**: Select this option. Then, select **Y** to confirm AMT activation.

8.      **Network Setup**. Select this option. Then, select **Intel ME Network Name Settings**. Enter **Host Name** (Not a mandatory step).

9.      **SOL/Storage Redirection/KVM**: Select this option. Enable all the required features - Username and Password, SOL, Storage Redirection and KVM Feature Selection.

10.     **User Consent**: By default, this is set for **KVM only**; Change this to **NONE**.

11.     Save and Exit Intel&reg; CSME (or MEBx).

12.     When the AMT device platform or operating system opens, connect to the internet, via an ethernet cable (wifi support not available). 

13.     Download the MeshCMD suitable to your device platform from the [Meshcommander.com site](https://www.meshcommander.com/meshcommander/meshcmd).

[![mps](assets/images/MPS_MeshCommander.PNG)](assets/images/MPS_MeshCommander.PNG)

**Note**: Document or remember the download location of meshcmd.exe as you will need to run this later to get the GUID.

!!! info "Add new device"

For an OEM system, it is easy to use the one-time boot menu, although entry into Intel&reg; CSME is usually an included option as part of the one-time boot menu. The exact key sequence varies by OEM, BIOS and Model.

New passwords must be a strong. These should contain a minimum of the following:

- 8 characters
- one Uppercase letter
- one lowercase letter
- one digit
- one special character

