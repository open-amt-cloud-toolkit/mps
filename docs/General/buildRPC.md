The Remote Provisioning Client (RPC) communicates with the Managability Engine Interface (MEI) and RPS interfaces. The MEI uses the ME Driver to talk to Intel AMT. By running RPC, we will activate Intel AMT into Client Control Mode (CCM), or ACM based on the created profile, as well as configure the CIRA connection of the AMT device to the MPS. After successfully running, the AMT device will be ready to be managed remotely using the web server!

!!! note "Production Environment"
        In a production environment, RPC would be built on a development device. From there, a software distribution tool, such as Microsoft\* SCCM, would distribute the thin application to the fleet of AMT devices.  After running, it does **not** have to remain on the AMT device to maintain the connection.

[![RPC](../assets/images/RPC_Overview.png)](../assets/images/RPC_Overview.png)

### Windows*

**Important: Perform the following steps on the Intel&reg; AMT device. Enter the commands in the following sections to create RPC on Windows.**

#### Clone the Repository

1\. Open the 'X64 Native Tools command prompt for VS 20XX' as Administrator.

>**Note:** You can find this command prompt in the Start Menu or in the following directory path:```./Programs/Visual Studio 2019/Visual Studio Tools/VC```

2\. Clone the RPC repository.

```
git clone https://github.com/open-amt-cloud-toolkit/rpc.git
```

3\. Change to the rpc directory.

```
cd rpc
```

4\. Checkout the ActivEdge branch

```
git checkout ActivEdge
```

#### Build VCPKG


1\. In the rpc directory, clone the Vcpkg repository. Vcpkg is a C/C++ Library Manager for Windows that was created by Microsoft.  Find out more about it [here](https://github.com/microsoft/vcpkg).

```
git clone --branch 2020.01 https://github.com/microsoft/vcpkg.git
cd vcpkg
```

2\. Build vcpkg.exe using the following command:

```
bootstrap-vcpkg.bat
```
    
3\. Set up user-wide integration in order to allow Vcpkg to work with Visual Studio. 

```
vcpkg integrate install
```

#### Build CPPRestSDK

4\. Make sure you are still in the ~/vcpkg directory.

5\. Install the C++ REST SDK package using Vcpkg. C++ REST SDK is a library for cloud-based client-server communication with modern API design.  Find out more about it [here](https://github.com/microsoft/cpprestsdk).

**Note:** This will take 15–25 minutes, depending on download speeds.

```
vcpkg install cpprestsdk:x64-windows-static
```

#### Build RPC

6\. Change to the rpc directory.

```
cd ..
```

7\. Create a new build directory within the **./rpc** directory and change to it.

```
mkdir build
cd build
```

8\. Build rpc.exe using CMake.  The toolchain file allows us to use Vcpkg with CMake outside of an IDE.

```
cmake .. -DVCPKG_TARGET_TRIPLET=x64-windows-static -DCMAKE_TOOLCHAIN_FILE=../vcpkg/scripts/buildsystems/vcpkg.cmake
cmake --build . --config Debug
```

9\. Navigate to the Release directory. In this directory, you should see rpc.exe.

```
cd Debug
```

#### Run RPC to Activate and Connect the AMT Device

1\. Run RPC with the following command to activate and configure Intel&reg; AMT.

- Replace [Development-IP-Address] with the development device's IP address, where the MPS and RPS servers are running
- Replace [profile-name] with your created profile from the Web Server.

```
rpc.exe -u wss://[Development-IP-Address]:8080 -c "-t activate --profile [profile-name]"
```

<br>

>Note: If you do not remember your created profile's name, you can navigate to the *Profiles* tab on the web server hosted at `https://[Development-IP-Address]:3000`
>
>**Default login credentials:**
>
>| Field       |  Value    |
>| :----------- | :-------------- |
>| **web_admin_user**| standalone |
>| **web_admin_password**| G@ppm0ym |


<br>

### Linux*

Follow these instructions to create RPC on Linux&ast;.

#### Clone the Repository

1\. On the Intel&reg; AMT device, open an elevated command line.

2\. Clone the RPC Repository.

```
git clone https://github.com/open-amt-cloud-toolkit/rpc.git
```

3\. Change to the rpc directory.

```
cd rpc
```

4\. Checkout the ActivEdge branch

```
git checkout ActivEdge
```

#### Build RPC

1\. Build the required dependencies; enter the following command:

```
sudo apt install git cmake build-essential libboost-system-dev libboost-thread-dev libboost-random-dev libboost-regex-dev  libboost-filesystem-dev libssl-dev zlib1g-dev
```

Build RPC with the following commands:

2\. Create a new build directory and change to it.

```
mkdir build
cd build
```

3\. Build RPC using CMake.

```
cmake -DCMAKE_BUILD_TYPE=Debug ..
cmake --build .
```

#### Run RPC to Activate and Connect the AMT Device

4\. Run RPC with the following command to activate and configure Intel&reg; AMT.

- Replace [Development-IP-Address] with the development device's IP address, where the MPS and RPS servers are running
- Replace [profile-name] with your created profile from the Web Server.

```
sudo ./rpc -u wss://[Development-IP-Address]:8080 -c "-t activate --profile [profile-name]
```

<br>

>Note: If you do not remember your created profile's name, you can navigate to the *Profiles* tab on the web server hosted at `https://[Development-IP-Address]:3000`
>
>**Default login credentials:**
>
>| Field       |  Value    |
>| :----------- | :-------------- |
>| **web_admin_user**| standalone |
>| **web_admin_password**| G@ppm0ym |


<br>

Next up: [Manage Device](../General/manageDevice.md)
