# Release Notes

## Key Feature Changes for 1.0
This section outlines key features changes between versions .9 and 1.0 for [Open Active Management Technology (Open AMT) Cloud Toolkit.](Glossary.md#o) 

### Additions

#### [RPS](Glossary.md#r)
- **Configuration of CIRA on Intel® AMT managed devices:** Enables managed devices to connect to the MPS.
- **Un-configuration Intel® AMT devices:** Removes all Intel® AMT configuration settings and resets Intel AMT to an [*nprovisioned](Glossary.md#p) state.
- **REST APIs:** Includes Create, Read, Update, Delete AMT Profiles, Domain Profiles, and CIRA Profiles.

#### [RPC](Glossary.md#r)
- **microLMS in the RPC executable:** Eliminates the need to run a separate LMS when trying to configure Intel® AMT.
- **CentOS*:** Enables CentOS on RPC. Linux build environment is still Ubuntu* 18.04.
- **Intel® AMT information commands:**  Provide feedback to the local command prompt showing status information of the Intel® AMT device.
  
#### [MPS](Glossary.md#m)
- **REST APIs:** Enables Intel® AMT Audit Log, Serial-Over-LAN features as well as functionality to toggle Intel® AMT Redirection Port, KVM Enable, and User Consent settings.

#### [UI Toolkit](Glossary.md#u)
- **Profile Creator REACT module:** Enables new RPS Profile APIs.
- **Audit Log REACT module:** Enables MPS Audit Log APIs.
- **Serial-Over-LAN REACT module:**  Enables MPS Serial-Over-LAN APIs.
- **KVM REACT module checkbox:** Enables KVM. Checking this also enables Redirection Port. User Consent will be disabled if the Intel® AMT device is in Admin Control Mode (ACM).

### Modifications and Removals
#### [MPS](Glossary.md#m)
- **Migration to Typescript* from node.js*:**  Modifies all REST APIs. Currently there are four end points which are categorized based on the functionality:

    **/admin -** for all the admin user operations like downloading mescript, root certificate, disconnected device, etc.

    **/amt -** for all AMT operations.

    **/relay -** for KVM operations.

    **/notifications -** for updating the device connections.

## Resolved Issues

### MPS

- **Modified handling of APF protocol:** Resolves issue in which multiple WS-Man* commands sent to Intel® AMT device in rapid succession cause a time-out error to be issued by Intel® AMT.
- **Periodic power polling calls during KVM and SOL sessions:** Resolves issue in which rapid keyboard inputs to Intel® AMT cause a hang on Intel® AMT 11 devices. Hangs can still occur, but system will become responsive again after the power poll (every 10 seconds).

## Known Defects in 1.0
- **Vault Deployment:** Current docker build scripts deploy Vault in developer mode. When the Vault container is brought down in this mode, all data stored in Vault is lost. For production deployments, deploy Vault in production mode and follow best security practices for unsealing Vault and handling access to Vault. For details, see [Hashicorp* Vault Deployment Guide](https://learn.hashicorp.com/tutorials/vault/deployment-guide). With Vault running in production mode, the data that RPS stores in Vault is retained when the container is brought down.
- **Intel® AMT Connecting to MPS:** After a successful configuration, Intel® AMT device will occasionally fail to connect to the MPS. In this situation there are two ways to prompt Intel® AMT to attempt to re-connect to MPS:
    1.	Unplug and re-plug the network cable
    2.	Reboot the Intel® AMT device
- **Intel® AMT device fails to re-connect to MPS after MPS is not available for an extended period of time:** If the MPS goes down for more than 2 days, Intel® AMT devices will no longer attempt to connect to MPS. If this happens, there are two ways to prompt Intel® AMT to attempt to re-connect to MPS:
    1.	Unplug and re-plug the network cable
    2.	Reboot the Intel® AMT device
