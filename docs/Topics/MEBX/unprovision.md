## Manageability Engine BIOS Extensions (MEBX)

Intel MEBX allows for configuration of the Intel Manageability Engine (ME) platform. Through this interface, you can provision AMT and customize a variety of settings manually.

### Unprovision an AMT Device Through MEBX

1\. Restart or power on the device 

2\. While the device is booting up, press `Ctrl+P` to reach the MEBX login screen 

3\. Enter the AMT password
!!! NOTE
    If it is the first time entering MEBX, the defaut password is `admin`. It will prompt you to create a new password.

4\. Select ‘Intel AMT configuration’ 

5\. Select ‘Unconfigure Network access’ 

6\. Select ‘Full unprovision’, and then press 'y' to continue 

7\. It takes 30 seconds to a minute to unprovision the device. While it is unprovisioning, the up/down arrow keys will not work.