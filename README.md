# Management Presence Server

[![Known Vulnerabilities](https://snyk.io/test/github/open-amt-cloud-toolkit/mps/badge.svg?targetFile=package.json)](https://snyk.io/test/github/open-amt-cloud-toolkit/mps?targetFile=package.json) ![Node.js CI](https://github.com/open-amt-cloud-toolkit/mps/workflows/Node.js%20CI/badge.svg) ![codecov.io](https://codecov.io/github/open-amt-cloud-toolkit/mps/coverage.svg?branch=master)

> Disclaimer: Production viable releases are tagged and listed under 'Releases'.  All other check-ins should be considered 'in-development' and should not be used in production

The Management Presence Server (MPS) enables remote edge management of Intel vPro® Platforms featuring Intel® AMT.  MPS uses an Intel vPro® feature, Client Initiated Remote Access (CIRA), to maintain a persistent connection with managed devices. As a cloud-agnostic microservice, MPS provides out-of-band manageability features, such as power control or keyboard, video, and mouse (KVM) control.

<br><br>

**For detailed documentation** about Getting Started with MPS or other features of the Open AMT Cloud Toolkit, see the [docs](https://open-amt-cloud-toolkit.github.io/docs).

<br>

## Prerequisites

To succesfully deploy MPS, the following software must be installed on your development system:

- [Node.js* LTS 12.x.x or newer](https://nodejs.org/en/)
- [git](https://git-scm.com/downloads)


## Deploy the Management Presence Server (MPS) Microservice

To deploy the MPS on a local development system: 

1. Clone the repo and switch to the `mps` directory.
    ```
    git clone https://github.com/open-amt-cloud-toolkit/mps.git && cd mps
    ```

2. Open the `.mpsrc` file to edit.

3. Update the following 3 fields. Save and keep track of the values you choose.

    | Field Name | Required | Usage |
    | ------------- | ------------------ | ------------ |
    | web_admin_user | Username of your choice | For logging into the Sample Web UI |
    | web_admin_password | **Strong** password of your choice | For logging into the Sample Web UI |
    | jwt_secret | A strong secret of your choice | Used when generating a JSON Web Token for authentication |

    >This password must meet standard, **strong** password requirements:
    > - 8 to 32 characters
    > - One uppercase, one lowercase, one numerical digit, and one special character.

<br>

4. Save and close the file.

5. Install the dependencies from the working `mps` directory.
    ```
    npm install
    ```

6. Start the service.
    ```
    npm start
    ```

7. The MPS listens on port 4433 by default. Successful installation produces the command line message:
    
    ```
    MPS Microservice running on localhost:3000.
    Intel(R) AMT server running on localhost:4433.
    ```
    
For detailed documentation about MPS, see the [docs](https://open-amt-cloud-toolkit.github.io/docs)
