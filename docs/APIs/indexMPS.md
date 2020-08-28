# API and Command Reference

This section is a reference to the MPS API methods available in the Open AMT Cloud Toolkit, and to some commands it provides.

## How to Use the REST API

TBD

## API Calls

The sections below list  methods for MPS. 

### MPS API

The MPS API includes Admin and AMT methods.

#### Admin Methods
  
   | Method       |  Description/Usage |
   | :----------- | :------------------------ |
   | **[AllDevices](./MPSmethods/alldevices.md)** | Lists all devices known to MPS, regardless of connected status |
   | **[AuditLog](./MPSmethods/auditlog.md)** | Returns a requested amount or time range of Intel® AMT Audit Log data for a specified guid |
   | **[ConnectedDevices](./MPSmethods/connecteddevices.md)** | Lists all devices currently connected to MPS |
   | **[Disconnect](./MPSmethods/disconnect.md)** | Disconnects the CIRA connection for a specified guid |
   | **[MEScript](./MPSmethods/mescript.md)** | Downloads the cira_setup.mescript from MPS |
   | **[RootCertificate](./MPSmethods/rootcertificate.md)** | Download the MPS Root Certificate |

#### AMT Methods

**Note:** These methods are 1:1 device-specific.

   | Method       |  Description/Usage |
   | :----------- | :------------------------ |   
   | **[EventLog](./MPSmethods/eventlog.md)** | Return sensor and hardware event data |
   | **[GeneralSettings](./MPSmethods/generalsettings.md)** | View general network settings |
   | **[GetAMTFeatures](./MPSmethods/getamtfeatures.md)** | View what AMT out-of-band features are enabled/disabled |
   | **[HardwareInfo](./MPSmethods/hardwareinfo.md)** | Retrieve hardware information such as processor or storage  |
   | **[PowerAction](./MPSmethods/poweraction.md)** | Perform an OOB power action. **BW Comment:** We need a mapping table for input to which power action. **Ed Comment:** Added a table [here](./MPSmethods/poweraction.md), but should we just tell them to check PowerCapabilities for the list?|
   | **[PowerCapabilities](./MPSmethods/powercapabilities.md)** | View what OOB power actions are available for that device |
   | **[PowerState](./MPSmethods/powerstate.md)** | Retrieve current state of AMT device, returns a number that maps to the [PowerActions](./MPSmethods/poweraction.md) table |
   | **[SetAMTFeatures](./MPSmethods/setamtfeatures.md)** | Enable/Disable AMT features such as KVM, SOL, and IDE-R |
   | **[Version](./MPSmethods/version.md)** | Retrieve AMT version of device |
 