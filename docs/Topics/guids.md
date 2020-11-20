## GUIDs in Intel&reg; AMT

Each Intel&reg; AMT device has a Global Unique Identifier (GUID) assigned to it by default. This GUID will be used as the reference to each device record. Typically, device GUIDs are required to perform power actions and other device-specific manageability features.

There are a number of ways to obtain the GUID on the Intel&reg; AMT device:

- WebUI of the Management Presence Server within the Open AMT Cloud Toolkit 
- [ConnectedDevices API Method](../APIs/MPSmethods/connecteddevices.md)



## Via WebUI

1\. Login to your Management Presence Server through the WebUI.

2\. Navigate to the Devices tab.

3\. Your AMT device's GUID is listed in the 2nd column.

[![GUID](../assets/images/GUID_WebUI.png)](../assets/images/GUID_WebUI.png)



## Via API Method

A device's GUID can also be found via the AllDevices or ConnectedDevices MPS methods. Users can follow the [Construct a Rest API Call](../Tutorials/apiTutorial.md) tutorial on constructing and running the ConnectedDevices method as an example.

Example ConnectedDevices Output:
``` json hl_lines="2"
[{
    "host": "d12428be-9fa1-4226-9784-54b2038beab6",
    "amtuser": "admin",
    "mpsuser": "standalone",
    "icon": 1,
    "conn": 1,
    "name": "d12428be-9fa1-4226-9784-54b2038beab6"
}]
```