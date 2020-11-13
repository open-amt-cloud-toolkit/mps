
The web portal is available for login after the deployment of Management Presence Server (MPS) and Remote Provisioning Server (RPS). Make sure both are running before attempting to login.

**To login:**

1. Open Chrome* browser and navigate to the web server using your development system's IP address on port 3000.

    ```
    https://[Development-IP-Address]:3000
    ```

    !!! important
        Use your development system's IP Address to connect to the web server.
        ** Using `localhost` will not work.**

2. Using a self-signed certificate will prompt a warning screen. Click **Advanced** and then **Proceed** to continue to connect to the webserver.

3. Log in to the web portal with the credentials below.

    **Default credentials:**

    | Field       |  Value    |
    | :----------- | :-------------- |
    | **Username**| standalone |
    | **Password**| G@ppm0ym |

4. Select **Remote Provisioning Server** on the web portal.

[![WebUI](../assets/images/WebUI_HomeRPS.png)](../assets/images/WebUI_HomeRPS.png)

**Figure 1: Choose Remote Provisioning Server.**

## Next up
[Create a CIRA Config](createCIRAConfig.md)
