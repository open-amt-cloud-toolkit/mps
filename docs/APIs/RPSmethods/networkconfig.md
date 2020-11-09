# Network Configuration

## Create a Network Configuration

* Endpoint: **/api/v1/admin/networkconfigs/create*
* Method Type: POST
* Headers: *X-RPS-API-Key*

```json
{
	"payload" :  
    {
        "profileName": "[network-profile-name]",
        "dhcpEnabled": "false"
    }
}
```

Example Input:

```json
{
	"payload": {
		"profileName": "profile1",
        "dhcpEnabled": "false"
	}
}
```

???+ success
    NETWORK Config profile1 successfully inserted

???+ failure
    NETWORK Config insertion failed for profile1. NETWORK Config already exists.

## Get a Network Configuration

* Endpoint: **/api/v1/admin/networkconfigs/{testnetworkconfig}*
* Method Type: GET
* Headers: *X-RPS-API-Key*

Example Input:

```
N/A (test profile to retrieve provided in URL as query parameter)
```

???+ success 
    ```json
    {
        "ProfileName": "profile1",
        "DHCPEnabled": false,
        "StaticIPShared": true,
        "IPSyncEnabled": true
    }
    ```
???+ failure
    NETWORK Config testProfile1 not found

## Get All Network Configuration

* Endpoint: **/api/v1/admin/networkconfigs/*
* Method Type: GET
* Headers: *X-RPS-API-Key*

```
NA
```

Example Input:

```
NA (no query parameter in the URL retrieves all profiles)
```

???+ success
    ```json
    [
        {
            "ProfileName": "profile1",
            "DHCPEnabled": false,
            "StaticIPShared": true,
            "IPSyncEnabled": true
        }
    ]
    ```

???+ failure
    No NETWORK Configs found.

## Edit a Profile


* Endpoint: **/api/v1/admin/networkconfigs/edit*
* Method Type: POST
* Headers: *X-RPS-API-Key*

```json
{
	"payload" :  
    {
        "profileName": "profile1",
        "dhcpEnabled": "[false]"
    }
}
```

Example Input:

```json
{
	"payload": {
		"profileName": "profile1",
        "dhcpEnabled": "true"
	}
}
```

???+ success
    UPDATE Successful for NETWORK Config: profile1

???+ failure
    NETWORK Config profile11 not found

## Delete a Network Configuration

* Endpoint: **/api/v1/admin/networkconfigs/profile1*
* Method Type: DELETE
* Headers: *X-RPS-API-Key*

```
NA
```

Example Input:

```
NA (Network Configuration to delete provided as query parameter in url 'profile1')
```

???+ success
NETWORK Config profile1 successfully deleted

???+ failure
    NETWORK Config profile11 not found


Return to [RPS Methods](../indexRPS.md)