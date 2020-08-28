# Build and Deploy Docker* Images for MPS and RPS Locally

Management Presence Server (MPS) and Remote Provisioning Server (RPS)  provide support for deploying the services as Docker* images, standardized packages containing an application's source code, libraries, environment, and dependencies. 

A Docker container is the instantiation of a Docker image as a virtualized unit that separates the application from the environment. Docker* containers start and run reliably, securely, and portably inside different environments, eliminating some of the usual problems that occur with software deployment on varying platforms. 

For more information about Docker images and containers, [start here](https://www.docker.com/resources/what-container).

## What You'll Do

This tutorial describes how to deploy MPS and RPS as Docker* images on the development system:

1. Clone the repositories.
2. Build the images.
3. Set the environment variables.
4. Run the [docker-compose](https://docs.docker.com/compose/) tool on a sample configuration file to define and enable a multi-container environment. 

See the [Getting Started Guide](https://github.impcloud.net/Danger-Bay/OpenAMTCloudToolkit-Docs/blob/master/GettingStarted.md) for information about MPS and RPS.

## What You'll Need
**Hardware**

- A development box 
- At least one Intel® AMT device 

**Software**

- Configuration as described in [Getting Started RPS/MPS/RPC](https://github.impcloud.net/Danger-Bay/OpenAMTCloudToolkit-Docs/blob/master/GettingStarted.md).

  - Before attempting this tutorial, follow the instructions in the Getting Started guide for setting up communication between the development system and the Intel® AMT device.

- [Docker Desktop on Windows*](https://docs.docker.com/docker-for-windows/install/)

- [Docker Desktop on Mac*](https://docs.docker.com/docker-for-mac/install/)

  Docker Configuration Details

  - The Docker for Windows installer defaults to enabling and running all the required settings necessary for this tutorial. 
  - Install before attempting the tutorial.
  - After successful installation, the Docker icon (whale), appears on the task bar.
  - To troubleshoot the installation, [see the troubleshooting guide](https://docs.docker.com/docker-for-windows/troubleshoot/).

## Clone the MPS and RPS Repositories

Clone the MPS and RPS repositories if they are not already on the development system. 

### Clone MPS

Clone the MPS repository.

```
git clone https://github.com/open-amt-cloud-toolkit/mps.git mps
```

**8/24 Internal:**
```
git clone https://github.impcloud.net/Danger-Bay/MPS_MicroService.git mps
cd mps
git checkout merge-all-branches
```

**8/24 Internal:**
```
cd webui
notepad package.json


Copy and replace the following line in the package.json. Update the access token with your Github Personal Access Token:

"mps-ui-toolkit": "git+https://[your-access-token]@github.impcloud.net/Danger-Bay/MPS_UI_ToolKit.git" //Update your access token 
```


### Clone RPS

Clone the RPS repository.

```
git clone https://github.com/open-amt-cloud-toolkit/rps.git rps
```

**8/24 Internal:**
```
git clone https://github.impcloud.net/Danger-Bay/RCS_MicroService.git rps
cd rps
```

**8/24 Internal:**
```
1. Open .rpsrc
2. Change MPS_MicroService to mps in the file paths in the following 4 fields:
   - credentials_path
   - web_tls_cert
   - web_tls_cert_key
   - root_ca_cert
```

After the **git clone** commands complete, the parent directory will contain an MPS and RPS folder.

```
📦parent
 ┣ 📂mps
 ┗ 📂rps
```

<br>

## Build the Docker Images
Build the MPS and RPS Docker images from their respective directories with the **build -t** command, giving the image a name and tag:

[docker build . -t [name:tag]](https://docs.docker.com/engine/reference/commandline/build/)  

- Create a name and tag with lowercase letters, digits, and separators (i.e., underscores, periods, and dashes).
- Do not end a name or tag with a separator.
- Tags contain up to 128 characters.

> **NOTE: Building a fresh Docker image may take several minutes.** 

### Build MPS

1\. Navigate to MPS folder and build the Docker image. 

```
cd mps
docker build . -t mps:v1
```
![Image of MPS Build Completion](../assets/images/MPSBuild.png) 

### Build RPS

2\. Navigate to the RPS folder and build the Docker image.

```
cd ..
cd rps
docker build . -t rps:v1
```
![Image of RPS Build Completion](../assets/images/RPSBuild.png) 
   
### Set the Environment Variables  
3\. After building the new MPS and RPS images, navigate to mps\scripts\docker-compose folder and copy the .env.template file to .env. 

```
cd ..
cd mps\scripts\docker-compose
```

Windows Command:
```
copy .env.template .env
```

Linux Command:
```
cp .env.template .env
```

> **Note: Preserve the .env.template file.**
>
> This file is very important to maintain. Always copy to a new file. 

4\. Open the .env file in a text editor. Set the image-related environment variables within the .env file.

Change the following fields:

| Field      |  Change to    |
| :----------- | :-------------- |
| **RPS_IMAGE** | rps:v1 | 
| **MPS_IMAGE** | mps:v1 | 
| **MPS_COMMON_NAME** | Your development device's IP address |

> **Note: Forgot the name and tag from the build?**
>
> The **docker images** command lists repository names, tags, image IDs, and sizes. 
>
> ```
> docker images
> ```
>
> ![Image of docker images command](/assets/images/DICommands.png)

<!-- 5. Set the proper proxy values if behind a proxy.

   HTTP_PROXY=http://[your-proxy-server]:[your-proxy-server-port]
   HTTPS_PROXY=http://[your-proxy-server]:[your-proxy-server-port]

   ```
   HTTP_PROXY=http://10.16.01.01:3030
   HTTPS_PROXY=http://10.16.01.01:3030
   ```

   > **NOTE: Behind a Corporate Proxy?**
   >
   > To download images and install npm packages inside a container on start, modify settings in ~/docker/config.json to reflect the correct proxy address. 
   >
   > For more information about how to modify the proxy settings, see [Configure Docker Client](https://docs.docker.com/network/proxy/#configure-the-docker-client).
   > -->

## Run docker-compose

The environment file .env now contains the MPS and RPS environment variables to pass to the Docker engine. 

1\. Navigate to the the `mps\scripts\docker-compose` directory. 

2\. Run the `docker-compose up` command, which starts the containers.  This will take approximately 2-3 minutes to start the containers.

```
docker-compose up
```

**BW Comment:** Example Image Here?

<br><br>

## Temp Link: Continue Configuration Here: https://github.impcloud.net/Danger-Bay/OpenAMTCloudToolkit-Docs/blob/master/GettingStarted.md
## Begin at section titled: 'Configuring the RPS Server'

<!-- ## Check Logs
Check the logs to ensure the MPS and RPS services are properly handling the traffic from end devices. 

1. Open a new command line windows see the log files for mps and rps to enable the services already started to continue running.

2. Navigate to the docker-compose folder

3. Use the **docker-compose logs** command.

   docker-compose logs [name of service]

   ```
   docker-compose logs mps
   ```
   ![Image of Docker Log Output](../assets/images/DockerLogFile.png) 
   A log file may provide information for troubleshooting these problems:

[BW, what are some of these problems?] -->
