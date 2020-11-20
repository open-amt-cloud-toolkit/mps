# Static and Dynamic IP Addresses


### Create Static IPs and Certificates

1. Open Command Prompt as an Administrator. Change directory to the `..\scripts\kubernetes` folder within the MPS repository that was downloaded and unzipped.
```
cd [path-to-MPS_MicroService-repo-folder]\scripts\kubernetes
```
   
2. In this directory, run the following .bat script to create the required IPs and Certificates for MPS and RPS. **Provide a new password of your choice for your private keys and save and/or remember it.**
```
createipsandcerts.bat [resource-group-name] [aks-cluster-name][your-private-keys-password]
```

3. **Copy and save the outputted MPS Static IP Address, RPS Static IP Address, and Node Resource Group from the script.**
```
C:\quickstart\mps\scripts\kubernetes>"MPS IP ADDRESS" 13.87.225.246

C:\quickstart\mps\scripts\kubernetes>"RPS IP ADDRESS" 13.87.226.61

C:\quickstart\mps\scripts\kubernetes>"Node Resource Group"  C_matt-rg_matt-aks_westus

Creating kubectl secrets with name "mpscerts" and keys rootCA_mps.key rootCA_mps.crt mps_cert.key mps_cert.crt secret/mpscerts created
Creating kubectl secrets with name "rpscerts" and keys rootCA_rps.key rootCA_rps.crt rps_cert.key rps_cert.crt secret/rpscerts created
```

At this point, all of your cert key names are stored in your Kubernetes secret store. When building the stack, we will pull them down.

<br><br><br>