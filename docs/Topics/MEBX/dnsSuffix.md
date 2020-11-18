## Manageability Engine BIOS Extensions (MEBX)

Intel MEBX allows for configuration of the Intel Manageability Engine (ME) platform. Through this interface, you can provision AMT and customize a variety of settings manually.

### Set a DNS Suffix through MEBX
If DHCP option15 is not set, the following needs to be set manually through MEBX if you want to re-activate the device remotely at a later time.

1\. Restart or power on the device 

2\. While the device is booting up, press `Ctrl+P` to reach the MEBX login screen 

3\. Enter the AMT password
!!! NOTE
    If it is the first time entering MEBX and the device has not been provisioned previously, the defaut password is `admin`. It will prompt you to create a new password.

4\. Select ‘Remote Setup and Configuration’ 

5\. Select ‘TLS PKI’ 

6\. Select ‘PKI DNS Suffix’ 

7\. Provide a DNS suffix name and press enter 

8\. Press Esc three times to reach the main menu

9\. Select ‘MEBX Exit’, and then press 'y' to confirm the exit 

<br>