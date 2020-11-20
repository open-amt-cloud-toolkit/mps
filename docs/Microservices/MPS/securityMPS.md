# MPS Security Considerations

Management Presence Server (MPS) is a cloud agnostic micro-service that enables Intel&reg; AMT-based platforms connecting over the internet to connect securely to manageability consoles. In order for a client to securely perform actions on Intel&reg AMT devices using REST APIs, MPS uses secrets. There are six key assets that must be protected:

* Intel&reg; AMT credentials
* Intel&reg; MPS credentials
* Device Allowlisting (List of UUIDs)
* APIKey
* Server Configuration
* Web User Credentials

In addition to the above assets, there are best practices that are recommened to help secure these assets as they are used within the system.  The following sections will cover each asset and the recommended practices to use to protect the assets.


## Security Assets

### 1. Intel&reg; AMT credentials
AMT credentials allows a user to remotely control Intel&reg; AMT device and these credentials are configured in AMT Firmware. When user performs an action on the device using REST API, MPS then fetches corresponding credentials of that device from Vault/Database and uses it as part of digest authentication. It is highly recommended to use strong password (as per AMT password requirements) and also, unique passwords per device to make it more secure.

### 2. Intel&reg; MPS credentials
Every Intel&reg; device needs to be authenticated prior to successful connection to MPS. MPS credentials are used to authenticate every Intel&reg; device. After establishing TLS connection with MPS, device sends it's username and password, which will then be used to authenticate. It is highly recommended that every device use a unique username and password.

### 3. Device Allowlisting (List of UUIDs)
Each Intel&reg; AMT device has a unique identifier (UUID) assigned to it and this UUID is assigned by Original Equipment Manufacturer (OEM). As discussed above, devices are authenticated by MPS using MPS credentials. But even before validating credentials, only allowlisted Intel&reg; AMT devices can be allowed to connect to make it more secure and this is being done using the allowlisted UUID.

### 4. APIKey
Every client/user needs to be authenticated before allowing them to perform an action using REST API call. APIKey will be used by MPS to authenticate a client/user.

### 5. Server Configuration
In order for MPS to use secure protocols, we will have to configure certificates, and the keys for these certificates need to be securely stored. If the keys are compromised then the attacker will be able to decrypt all the messages.

### 6. Web User Credentials
Primary way of authenticating a user who intends to perform an action is using APIKey but MPS also provides a sample Web-based User Interface. This Web Interface shows how to make REST API calls using AJAX. Only authenticated users should be allowed to make REST API calls using Web UI and the authentication will be done using Web user credentials.


## Best Known Security Methods

### 1. Enable TLS on network connections
There are three potential places where TLS should be enabled to protect the security assets:

* HTTP/WS connection between client and MPS
* Connection between MPS and Vault/Database
* Connection between MPS and Intel&reg; AMT device

Encrypting these communication will help prevent network based attacks attempting to control Intel&reg; AMT device. It is recommended that the most modern version of TLS be used to protect these connections.

### 2. Secure and isolate execution environment
MPS holds the described security assets in memory during execution.  In order to protect these assets while in memory of MPS, it is recommended that MPS be run in a secure execution environment such as a dedicated VM or container. Deploying into a hardened execution environment eases the burden of individually securing the assets.

### 3. Utilize Vault for storing Credentials
Vault is a tool used to secure, store and tightly control access to secrets. Utilizing Vault to store passwords used by MPS will greatly increase the security of these assets.

### 4. Utilize Kubernetes Secrets for storing dynamic configuration values (like environment variables)
Kubernetes Secrets help you to store and manage sensitive information like Tokens. Use Kubernetes secrets for storing environment variables required for configuring MPS rather than putting them in the image/pod. Vault token, Session secret key, and Server configuration assets required for MPS should be stored in Kubernetes secrets.

<br>