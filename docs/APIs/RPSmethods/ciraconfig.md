# Creating a CIRA Configuration

* Endpoint: */api/v1/ciraconfigs/create*

## Developer mode (Vault and DB disabled)

In developer mode, all profiles and configurations are written to the file private/data.json.

## Prod mode (With Vault and DB enabled)

In production mode, all profiles and CIRA configurations are written to the database, and secrets are stored in Vault.

The inputs below for both CIRA Config and AMT Profile creation will work in either Developer or Prod mode.

<br>

## Create a CIRA Configuration

ONLY proxyDetails is optional. 

```
{
	"payload": {
		"configName": "config1",
		"mpsServerAddress": "localhost",
		"mpsPort": 4433,
		"username": "admin",
		"password": "P@ssw0rd",
		"commonName": "localhost",
		"serverAddressFormat": 201,
		"mpsRootCertificate": "",
		"proxyDetails": "", 
		"authMethod": 2
	}
}
```

Output:

Success:

```
CIRA Config config1 successfully inserted
```

Duplicate Failure:

```
CIRA Config insertion failed for config1. CIRA Config already exists.
```

<br>

## Get all CIRA configurations

* Endpoint: */api/v1/ciraconfigs/*
* Method Type: GET
* Headers: *X-RPS-API-Key*

Sample Response:

```
[
    {
        "ConfigName": "config1",
        "MPSServerAddress": "13.64.233.163",
        "MPSPort": 4433,
        "Username": "admin",
        "Password": "P@ssw0rd",
        "CommonName": "13.64.233.163",
        "ServerAddressFormat": 201,
        "AuthMethod": 2,
        "MPSRootCertificate": "null",
        "ProxyDetails": "null"
    },
    {
        "ConfigName": "config2",
        "MPSServerAddress": "localhost",
        "MPSPort": 4433,
        "Username": "admin",
        "Password": "P@ssw0rd",
        "CommonName": "localhost",
        "ServerAddressFormat": 201,
        "AuthMethod": 2,
        "MPSRootCertificate": "",
        "ProxyDetails": ""
    }
]
```

<br>

## Get a CIRA configuration

* Endpoint: */api/v1/ciraconfigs/{ciraconfigname}*
* Method Type: GET
* Headers: *X-RPS-API-Key*

Sample Response:

```
{
    "ConfigName": "config1",
    "MPSServerAddress": "localhost",
    "MPSPort": 4433,
    "Username": "admin",
    "Password": "P@ssw0rd",
    "CommonName": "localhost",
    "ServerAddressFormat": 201,
    "AuthMethod": 2,
    "MPSRootCertificate": "",
    "ProxyDetails": ""
}
```

<br>

## Delete a CIRA configuration

* Endpoint: */api/v1/ciraconfigs/{ciraconfigname}*
* Method Type: DELETE
* Headers: *X-RPS-API-Key*

Success:

```
CIRA Config config1 successfully deleted
```

Constraint Failure (if an AMT profile is using this CIRA configuration)
```
Deletion failed for CIRA Config: config1. Profile associated with this Config.
```

<br>

Return to [RPS Methods](../indexRPS.md)