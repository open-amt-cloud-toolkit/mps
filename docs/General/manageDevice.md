Estimated completion time: 5 minutes

## Manage the Intel&reg; AMT Device using MPS

1\. On your development system, browse to the web server using the development system's IP Address.
	
**Example URL:** https://[Development-IP-Address]:3000

2\. Log in with the default credentials below.

**Default credentials:**

| Field       |  Value    |
| :----------- | :-------------- |
| **Username**| standalone |
| **Password**| G@ppm0ym |

3\. After logging in, click on Management Presence Server. If already logged in, click the Home icon in the top left corner.

[![WebUI](../assets/images/WebUI_HomeMPS.png)](../assets/images/WebUI_HomeMPS.png)

<br>

4\. Click the devices tab from the menu on the left, or click *Connected* in the default homepage.

>**Note:** If the activated device is not listed or if it is listed as unconnected, unplug and then plug back in the power of the AMT device. After succesfully restarting the device, refresh the WebUI to see if the *Status* changes to *Connected* and turns green.

[![mps](../assets/images/MPS_ConnectedDevice.png)](../assets/images/MPS_ConnectedDevice.png)

5\. Select the checkbox by the connected device you want to manage.

6\. Select an action to perform from the options on the right.

>**Note:** Since the device was activated in Client Control Mode(CCM), the KVM feature will not function in this current release. To use KVM, follow the [ACM Activation Tutorial](../Tutorials/acmActivation.md) to see how to configure a device into Admin Control Mode.

>**Note:** Activated in Admin Control Mode already? Try out the Keyboard, Video, Mouse (KVM) feature to remotely view and control the AMT device.  Issue a Reset to BIOS command and be able to view and make live changes to BIOS settings.

[![mps](../assets/images/MPS_ManageDevice.png)](../assets/images/MPS_ManageDevice.png)

<br>

## Next steps

After successfully deploying the Active Edge microservices and client, explore other tools and topics in the Active Edge architecture:

### REST API Calls
Use the REST API tutorial to construct an Admin method API call to connected devices using node.js. Then modify the template to create other MPS REST API calls. 

[Get Started with REST API Calls](../Tutorials/apiTutorial.md){: .md-button .md-button--primary }

### UI Toolkit
Explore the Active Edge reference implementation console by adding manageability features with prebuilt React components, such as Keyboard, Video, and Mouse (KVM).

[Get Started with the UI Toolkit](../Tutorials/uitoolkit.md){: .md-button .md-button--primary }

### Security
Learn how to use Active Edge architecture to secure assets. Topics include credentials, allowlisting, best known security methods, and more.

[Learn More about Security and Hardening](../security.md){: .md-button .md-button--primary }


