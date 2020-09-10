The Remote Provisioning Service is a Node.js-based microservice that works with the Remote Provisioning Client (RPC) to activate Intel&reg; AMT platforms using a pre-defined profile.

The image below illustrates how RPS activates an Intel&reg; AMT device for remote management. In this section, we will see how to deploy number two, RPS.

[![RPS](../assets/images/RPS_Overview.png)](../assets/images/RPS_Overview.png)

### Clone the Repository

1\. Open a new Command Prompt as Administrator or a Terminal.

2\. Clone the RPS repository to the same parent directory where the mps directory is located. Enter the following command:

```
git clone https://github.com/open-amt-cloud-toolkit/rps.git
cd rps
```

3\. Checkout the ActivEdge branch.

```
git checkout ActivEdge
```

The directory structure should look like this:
    
```
📦parent
 ┣ 📂mps
 ┗ 📂rps
```

### Start the RPS Server

1\. In the rps directory, run the install command to install all required dependencies. 

```
npm install
```

2\. Then, start the server. By default, the RPS web port is 8080.

```
npm run dev
```

>**Note:** Warning messages are okay and expected for optional dependencies.

Example Output:

[![RPS Output](../assets/images/RPS_npmrundev.png)](../assets/images/npmrundev.png)

<br>

Next up: [Configure RPS](../General/configureRPS.md)
