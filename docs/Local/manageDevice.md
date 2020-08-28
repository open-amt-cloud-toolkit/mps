# Manage the Intel<sup>®</sup> AMT Device Using MPS

1\. On your development device, browse to the web server using the development device's IP address.
	
**Example URL:** https://[Development-IP-Address]:3000

2\. Log in with the *web_admin_user* and *web_admin_password* values set in the .mpsrc file. If you changed these fields, enter your customized login, or use the default values below.

**Default credentials:**

| Field       |  Value    |
| :----------- | :-------------- |
| **web_admin_user**| standalone |
| **web_admin_password**| G@ppm0ym |

3\. After logging in, click on Management Presence Server.

4\. Click the devices tab from the menu on the left, or click *Connected* in the default homepage.

[![mps](../assets/images/MPS_ConnectedDevice.png)](../assets/images/MPS_ConnectedDevice.png)

5\. Select the connected device you want to manage.

6\. Select an action to perform from the options on the right.

>**Note:** The KVM feature will not function at this point, since the device was activated  in Client Control Mode (CCM). To use KVM, follow the [ACM Activation Tutorial](../Tutorials/acmActivation.md) to see how to configure a device into Admin Control Mode and remotely KVM using out-of-band capabilities.

[![mps](../assets/images/MPS_ManageDevice.png)](../assets/images/MPS_ManageDevice.png)

Click the **Next** link at the bottom right of the page to deploy microservices with Docker&ast;.