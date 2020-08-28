# Install RPS Locally

The Remote Provisioning Service is a node-based microservice that works with the Remote Provisioning Client (RPC) to activate Intel<sup>®</sup> AMT-based platforms using a pre-defined profile.

The image below is a representation of how RPS activates an Intel<sup>®</sup> AMT device.

[![RPS](../assets/images/RPS_Overview.png)](../assets/images/RPS_Overview.png)

## Clone the Repository

1\. Open a new Command Prompt or Terminal session with Administrator or elevated privileges.

2\. Clone the RPS repository to the same parent directory where the mps directory is located. Enter the following command:

```
git clone https://github.com/open-amt-cloud-toolkit/rps.git
```
    
**For Internal:**

```
git clone https://github.impcloud.net/Danger-Bay/RCS_MicroService.git rps
cd rps
```

The directory structure should look like this:
    
```
📦parent
 ┣ 📂mps
 ┗ 📂rps
```

## Start the RPS Server

1\. Navigate to the RPS directory.

```
cd rps
```

**For Internal:**
Verify or Update certification paths
    
```
nodepad .rpsrc
"web_tls_cert": "../../mps/private/mpsserver-cert-public.crt",
"web_tls_cert_key": "../../mps/private/mpsserver-cert-private.key",
"root_ca_cert": "../../mps/private/root-cert-public.crt",
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

Click the **Next** link at the bottom right of the page to configure RPS.