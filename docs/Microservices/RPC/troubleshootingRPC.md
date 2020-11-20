
The table below details possible errors that may occur when activating or de-activating managed devices along with some potential solutions.

| Error Message | Possible Solutions |
| ------------- | ------------------ |
|  "Decrypting provisioning certificate failed"| Double check the password is correct on the certificate loaded into the "domains" on the UI | 
|   "Exception reading from device"  | If MPS and RPS are running in Docker, check to ensure Vault has been unsealed. |
| "Unable to connect to Local Management Service (LMS). Please ensure LMS is running" | Check to ensure no application has bound to port 16992 |
| "Unable to launch MicroLMS." Check that Intel ME is present, MEI Driver installed and run this executable as administrator | Check to ensure no application has bound to port 16992 |
|   "Device xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx activation failed. Error while adding the certificates to AMT."  | Unplug the device, from both network and power, let it sit for a while. If that doesn't work, file a github issue | 
| Device xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx activation failed. Missing DNS Suffix. | Run `./rpc --amtinfo all` and ensure there is a DNS suffix. If it is blank, double check your router settings for DHCP. Alternatively, you can override the DNS suffix with `--dns mycompany.com` | 
| Error: amt password DOES NOT match stored version for Device 6c4243ba-334d-11ea-94b5-caba2a773d00 | Ensure you have provided the `--password` flag for the `--cmd/-c` you are trying to execute, and that it is the password you used when provisioning the device. |
| Unable to connect to websocket server. Please check url. | After ensuring you can reach your server. Ensure that the certificate common name on the server matches the FQDN/IP of your host address. |

