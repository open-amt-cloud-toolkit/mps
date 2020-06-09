# Install Open AMT Cloud Toolkit Server Stack on Azure


## Pre-reqs
1.	Enable OpenSSH client - https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse 
    You only need the openssh-client (if you don’t have it already). Please check your Windows 10 compatibility. 
    ### Install the OpenSSH Client
      ``` powershell
      powershell -c Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
      ```

## Environment Variables

``` shell
set HTTP_PROXY=http://proxy-us.intel.com:912
set HTTPS_PROXY=http://proxy-us.intel.com:912
set DOCKER_LOGIN_PASSWORD=[your-docker-login-password]
```

## Steps to install
1. cd scripts/docker-compose
2. oact-stack-azure-vm.bat [your-solution-name] [region (eg: westus)]