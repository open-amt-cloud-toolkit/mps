# Activate AMT Device

* [Video Link](https://www.intel.com/content/www/us/en/support/articles/000026592/technologies.html)
* [Detailed Setup document](
https://software.intel.com/en-us/articles/getting-started-with-intel-active-management-technology-amt)

## Steps to Activate Intel AMT

1. Connect a device to Monitor and power up.

2.	The Intel AMT platform displays the BIOS startup screen during power up, then processes the BIOS Extensions. Entry into the Intel AMT BIOS Extension (MEBx) is BIOS vendor-dependent. If you are using an Intel AMT reference platform (SDS or SDP), the display screen prompts you to press <Ctrl+P>. Then the control passes to the Intel CSME (or MEBx) main menu.

3.	Enter the Intel CSME default password (“admin”).

4.	Change the default password (required to proceed). 

5.	Select Intel AMT Configuration.

6.	Select/Verify ‘Manageability Feature Selection’ is Enabled.

7.	Select ‘Activate Network Access’ and then, select “Y” to confirm AMT activation.

8.	Select Network Setup. Then, select Intel ME network Name Settings. Enter Host Name (Not a mandatory step).

9.	Select ‘SOL/Storage Redirection/KVM’, enable all the required features.

10.	Select User Consent, By default, this is set for KVM only; Change it to none.

11.	Save and Exit Intel CSME (or MEBx).

!!! info "Add new device"
        
	For an OEM system, it is easy to use the one-time boot menu, although entry into Intel CSME is usually an included option as part of the one-time boot menu. The exact key sequence varies by OEM, BIOS and Model.

    New password must be a strong. It should contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and be at least eight characters. 
