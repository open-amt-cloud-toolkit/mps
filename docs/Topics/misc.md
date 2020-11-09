# Miscellaneous Temporary Content


## Create Certs and Build Images

**Comment:** Intro here...

### Clone the Repository

1. Go to XXX-URL-HERE-XXX and use your GitHub credentials to download a .zip file of the branch.

2. After downloading, unzip the files to your local folder.

**NOTE/COMMENT:***The following is for internal testing use for those with impcloud access. It must be modified to the released branch when code is public.

```
https://github.com/open-amt-cloud-toolkit/mps.git
cd mps
git checkout add-helm-support-changes2
```

!!! NOTE
    If you see authentication failure with git clone, make sure your git credetnials works correctly using browser. You can connect to your github account with ssh keys using these instructions: https://help.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh

### Create Static IPs and Certificates

1. Open Command Prompt as an Administrator. Change directory to the `..\scripts\kubernetes` folder within the MPS repository that was downloaded and unzipped.

   ```
   cd [path-to-MPS_MicroService-repo-folder]\scripts\kubernetes
   ```
   
2. In this directory, run the following .bat script to create the required IPs and Certificates for MPS and RPS. **Provide a new password of your choice for your private keys and save and/or remember it.**

   ```
   createipsandcerts.bat [resource-group-name] [aks-cluster-name] [your-private-keys-password]
   ```

3. **Copy and save the outputted MPS Static IP Address, RPS Static IP Address, and Node Resource Group from the script.**

   Sample output:

   ```
   C:\quickstart\MPS_MicroService-add-helm-support-changes2\scripts\kubernetes>"MPS IP ADDRESS" 13.   87.225.246

   C:\quickstart\MPS_MicroService-add-helm-support-changes2\scripts\kubernetes>"RPS IP ADDRESS" 13.   87.226.61

   C:\quickstart\MPS_MicroService-add-helm-support-changes2\scripts\kubernetes>"Node Resource   Group" MC_matt-rg_matt-aks_westus

   Creating kubectl secrets with name "mpscerts" and keys rootCA_mps.key rootCA_mps.crt mps_cert.  key mps_cert.crt 
   secret/mpscerts created
   Creating kubectl secrets with name "rpscerts" and keys rootCA_rps.key rootCA_rps.crt rps_cert.  key rps_cert.crt 
   secret/rpscerts created
   ```

At this point, all of your cert key names are stored in your Kubernetes secret store. When building the stack, we will pull them down.

<br><br><br>