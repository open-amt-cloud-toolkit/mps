# RPS Security Considerations

Remote Provision Service (RPS) is built to be a microservice that plays a component role in a larger set of services that makes up the device management software suite.  In this role, RPS uses and creates secrets that are required to be able to successfully activate and use Intel&reg; AMT.  There are four key assets that must be protected:

* Remote admin password for Intel&reg; AMT
* Provisioning Certificate for each supported domain
* Password used to encrypt each Provisioning Certificate
* Device configuration information sent to Intel&reg; AMT device

In addition to the above assets, there are best practices that are recommened to help secure these assets as they are used within the system.  The following sections will cover each asset and the recommended practices to use to protect the assets.

---
## Security Assets

### 1 Remote Admin Password
This password is what is configured in the Intel&reg; AMT firmware that allows a remote user to remotely control the Intel&reg; AMT device (power actions, remote desktop, remote terminal, etc).  When RPS activates an Intel&reg; AMT device, it sets this password in the Intel&reg; AMT firmware.  This password can either be statically set or can be randomly generated based on the profile defined by the user setting up RPS (covered in AMTConfigurations section).  It is highly recommended to use randomly generated passwords as this will make each Intel&reg; AMT device more secure by using unique passwords per device.
RPS will only ever save the Remote Admin Password to a configured database connection.  If a database connection is not configured, RPS will not use profiles that specify a randomly generated password.

### 2 Provisioning Certificate
This certificate is unique per owned domain that has Intel&reg; AMT devices located and RPS needs to provision.  This certificate must be derived from a root certificate whose hash matches one of the trusted provisioning root certificate hashes that is listed in the Intel&reg; AMT device firmware.  Generally, the provisioning certificate is purchased from a trusted certificate authority (VeriSign, GoDaddy, Comodo, etc).  The full list of supported CAs based on Intel&reg; AMT version are listed [here](https://software.intel.com/sites/manageability/AMT_Implementation_and_Reference_Guide/WordDocuments/rootcertificatehashes.htm).  This certificate must contain the leaf certificate, root certificate, and all of the intermediate certificates to form a complete certificate chain.  Additionally, the certificate file must also include the private key for the certificate (.pfx format).  The leaf certificate for the provisioning certificate must match the domain suffix that the Intel&reg; AMT device is connected as specified by DHCP option 15 or the Truted DNS Suffix in the Management BIOS Extentions (MEBx).  Matching this is one of the ways in which the Intel&reg; AMT firmware establishes trust with RPS.  
RPS reads the location of the Provisioning Certificate from the configuration file and will then fetch the certificate when it is needed to activate an Intel&reg; AMT device.  RPS doesn't ever save or export the Provisioning Certificate anywhere.

### 3 Password used to encrypt Provisioning Certificate
This is the password that is used to encrypt the provisioning certificate .pfx file that is discussed above.  RPS uses this password to decrypt the provisioning certificate so that it can use the certificate components and the private key to activate Intel&reg; AMT devices.  
RPS reads the password from the configuration file and will use it when it is needed to decrypt a provisioning certificate.  RPS doesn't ever save or export the Provisioning Certficiate Password anywhere.

### 4 Device configuration information sent to Intel&reg; AMT device
This data is a set of information that Intel&reg; AMT firmware will use to establish trust and then activate the Intel&reg; AMT device.  Contained in this information is the hashed remote admin password.  It is important to protect this set of information while it is being used by RPS and while in transit to the Intel&reg; AMT device.  This set of information is not replayable and is specific for a given Intel&reg; AMT device.

---
## Best Known Security Methods

### 1 Enable TLS on network connections
There are two potential places where TLS should be enable to protect the security assets:
* WebSocket connection between RPS and Intel&reg; AMT client
* Database connection between RPS and storage database

Encrypting these communication transports will help prevent network based attacks attempting to discover the Remote Admin Password for the Intel&reg; AMT device.  It is recommended that the most modern version of TLS be used to protect these connections.

### 2 Secure and isolate execution environment
RPS holds the described security assets in memory during execution.  In order to protect these assets while in memory of RPS, it is recommended that RPS be run in a secure execution environment such as a dedicated VM or container.  Deploying into a hardened execution environment eases the burden of individually securing the configuration files and provisioning certificates

### 3 Utilize a Vault implementation to encrypt passwords
Utilizing an encryption Vault to encrypt the passwords either created by or used by RPS will greatly increase the security of these assets.  By only having the hash value stored in the RPS configuration file ensures that these assets are protected while at rest.  Additionally, RPS can encrypt the static or randomly generated Remote Admin Password prior to sending this information to the database, protecting this asset while at rest in an unencrypted database.
