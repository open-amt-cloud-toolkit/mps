# Build Docker* Images for MPS and RPS and Deploy to the Cloud

Management Presence Server (MPS) and Remote Provisioning Server (RPS)  provide support for deploying the services as Docker* images to the cloud.

## What You'll Do
This tutorial explains the steps to deploy Management Presence Server (MPS) and Remote Provisioning Server (RPS) as Docker* images to the cloud using Microsoft Azure*:

1. Create a Microsoft Azure subscription. 
2. Create a Docker Hub account. Supply it with a Docker ID which will be used later.
3. Login to the accounts.
4. Build and deploy to the cloud.

## What You'll Need
**Hardware**

- A development box 
- At least one Intel® AMT device 

**Software**

- [Microsoft Azure Subscription and Login](https://azure.microsoft.com/en-us/free/search/?&ef_id=EAIaIQobChMIwNTKptLm6gIVAxLnCh3ESwcQEAAYASAAEgL8uPD_BwE:G:s&OCID=AID2100131_SEM_EAIaIQobChMIwNTKptLm6gIVAxLnCh3ESwcQEAAYASAAEgL8uPD_BwE:G:s&gclid=EAIaIQobChMIwNTKptLm6gIVAxLnCh3ESwcQEAAYASAAEgL8uPD_BwE)

  **Microsoft Azure Configuration Details** 

  - Create a subscription for Microsoft Azure. 
  - Download [Microsoft Azure Command Line Interface (CLI)](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?view=azure-cli-latest).
  - Test the Microsoft Azure [CLI login](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli?view=azure-cli-latest).
  - [BW: Do you have anything to add?]

- [Docker Hub Account](https://hub.docker.com/signup/)

  **Docker Hub Account Configuration Details**

  - Creating an account on Docker Hub requires the creation of a **unique Docker ID** consisting of 4 to 30 lowercase letters and digits. This ID becomes the **user namespace** for hosted services. The password and Docker ID will be used in the deployment instructions. 
  - A Docker Hub account enables user access to Docker Hub repositories, forums, support and more. 
  - See detailed instructions for creating an account [here](https://docs.docker.com/docker-id/).

- [Docker Desktop on Windows](https://docs.docker.com/docker-for-windows/install/)

  **Docker Configuration Details**

  - The Docker for Windows installer defaults to enabling and running all the required settings necessary for this tutorial.
  - After successful installation, the Docker icon (whale), appears on the task bar.
  - To troubleshoot the installation, [see the troubleshooting guide](https://docs.docker.com/docker-for-windows/troubleshoot/).

## Build Docker Images

1. Login to Microsoft Azure with the Azure CLI using the **az** command. Type the command in a Windows Command Prompt or Azure PowerShell.

   ```
   az login
   ```

   This command will invoke the default browser, which displays a login screen.

2. Login to the Docker hub account with the Docker ID and password. [KD: Please place pix here.]

   ```
   docker login --username [your Docker ID] --password [your Docker Hub Password]
   ```

### Build MPS
Build the MPS and RPS Docker images from their respective directories with the **build -t** command, giving the image a name and tag:

 [docker build -t [name:tag]](https://docs.docker.com/engine/reference/commandline/build/)  

- Create a name and tag with lowercase letters, digits, and separators (i.e., underscores, periods, and dashes).
- Do not end a name or tag with a separator.
- Tags contain up to 128 characters.

3. Navigate to the MPS folder and build the Docker image. Execute a build and push for MPS. 

   The **docker push** command with the -t or --tag option enables the naming and tagging of a build: 

   [docker push -t [docker-id][name:tag]](**https://docs.docker.com/engine/reference/commandline/push/**)

   ```
   cd parent directory\mps
   docker build . -t  f30911230045\mps-microservice:v1
   docker push f30911230045\mps-microservice:v1
   ```

### Build RPS

4. Navigate to the RPS folder and build the Docker image. Execute a build and push for RPS. 

   ```
   cd ..\rps
   docker build . -t  f30911230032\rps-microservice:v1
   docker push f30911230032\rps-microservice:v1
   ```

## Deploy 
1. After building the new MPS and RPS images, navigate to mps\scripts\docker-compose folder and use **xcopy** to copy the .env.template file to .env. 

   The environment file .env.template contains the MPS and RPS environment variables to pass to the Docker engine.

   ```
   cd mps\scripts\docker-compose
   xcopy /Y .env.template .env
   ```

   > **NOTE: Preserve the .env.template file.**
   >
   > This file is very important to maintain. Always copy to a new file. 

2. Set the image-related environment variables within the .env file:

   MPS_IMAGE=[name:tag from the build step]

   RPS_IMAGE=[name:tag from the build step]

   ```
   MPS_IMAGE=mps-microservice:v1
   RPS_IMAGE=rps-microservice:v2
   ```

3. Set the proper proxy values if behind a proxy.

   set HTTP_PROXY=http://[your-proxy-server]:[your-proxy-server-port]
   set HTTPS_PROXY=http://[your-proxy-server]:[your-proxy-server-port]

   ```
   set HTTP_PROXY=http://10.3.4.52:8080
   set HTTPS_PROXY=http://10.3.4.52:8080
   ```

   > **NOTE:**  If using a private Docker hub, set the password variable.
   >
   > DOCKER_LOGIN_PASSWORD=[your-docker-login-password

4. Run the oact-stack-azure-vm.bat file. This file: 

   - Installs the Docker on the Microsoft Azure VM

   - Runs the **docker-compose** up command. 

   - Copies the .env-template file to .env.


     oact-stack-azure-vm.bat [your-solution-name] [region (e.g.,: westus)] [MPS-IMAGE] [RPS-IMAGE]
    
     ```
     cd scripts\docker-compose
     oact-stack-azure-vm.bat vprodemo westus
     ```
