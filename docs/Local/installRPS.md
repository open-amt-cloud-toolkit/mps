The Remote Provisioning Service is a Node.js-based microservice that works with the Remote Provisioning Client (RPC) to activate Intel&reg; AMT platforms using a pre-defined profile.

The image below illustrates how RPS activates an Intel&reg; AMT device for remote management.

[![RPS](../assets/images/RPS_Overview.png)](../assets/images/RPS_Overview.png)

### Clone the Repository

1\. Open a new Command Prompt or Terminal with Administrator or elevated privileges.

2\. Clone the RPS repository to the same parent directory where the mps directory is located. Enter the following command:

```
git clone https://github.com/open-amt-cloud-toolkit/rps.git
```

3\. Checkout the ActivEdge branch

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

1\. Navigate to the RPS directory.

```
cd rps
```

2\. Run the install command to install all required dependencies. 

```
npm install
```

3\. Then, start the server. The websocket server listens on the port specified in the file app.config.dev.json. By default, this is port 8080.

```
npm run dev
```

Example Output:

[![RPS Output](../assets/images/RPS_npmrundev.png)](../assets/images/npmrundev.png)

<br>

Next up: [Configure RPS](../General/configureRPS.md)
