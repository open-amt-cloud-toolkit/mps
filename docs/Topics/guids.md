## GUIDs in Intel&reg; AMT

Each Intel&reg; AMT device has a unique identifier (GUID) assigned to it by default. This GUID will be used as the 
reference to each device record. To obtain the GUID on the Intel&reg; AMT device: 

1. On the Intel&reg; AMT device, download [MeshCmd](https://www.meshcommander.com/meshcommander/meshcmd).
2. Open a CLI with elevated privileges on the AMT device.
3. Navigate to the directory where meshcmd.exe was downloaded.
4. Run ```meshcmd amtuuid```. MeshCmd will return the GUID.

