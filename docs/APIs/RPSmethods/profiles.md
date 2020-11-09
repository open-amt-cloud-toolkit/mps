# Intel AMT Profiles

## Create a Profile


* Endpoint: **/api/v1/admin/profiles/create*
* Method Type: POST
* Headers: *X-RPS-API-Key*

```json
{
	"payload" :  
    {
        "profileName": "[amt-profile-name]",
        "amtPassword":"[strong-AMT-password]",
        "generateRandomPassword": "false",
        "passwordLength": 8,
        "ciraConfigName": "testconfig",
        "activation": "[acmactivate/ccmactivate]"
    }
}
```

Example Input:

```json
{
    "payload":
    {
        "profileName":"testProfile1",
        "amtPassword":"STRONGPASSWORD",
        "generateRandomPassword":false,
        "passwordLength":null,
        "ciraConfigName": "testconfig",
        "activation":"ccmactivate"
    }
}
```

???+ success
    Profile testProfile1 successfully inserted

???+ failure
    Profile insertion failed for testProfile1. Profile already exists. 

???+ failure 
    Referenced CIRA Config testconfig58 doesn't exist.

## Get a Profile

* Endpoint: **/api/v1/admin/profiles/{testprofile}*
* Method Type: GET
* Headers: *X-RPS-API-Key*


Example Input:

```
N/A (test profile to retrieve provided in URL as query parameter)
```

???+ success
    ```json
    {
        "ProfileName": "testProfile1",
        "AMTPassword": null,
        "GenerateRandomPassword": false,
        "RandomPasswordLength": null,
        "ConfigurationScript": null,
        "Activation": "ccmactivate",
        "CIRAConfigName": "testconfig1"
    }
    ```

???+ failure
    Profile testProfile1 not found

## Get All Profiles

* Endpoint: **/api/v1/admin/profiles/*
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
            "ProfileName": "testProfile1",
            "AMTPassword": null,
            "GenerateRandomPassword": false,
            "RandomPasswordLength": null,
            "ConfigurationScript": null,
            "Activation": "ccmactivate",
            "CIRAConfigName": "testconfig1"
        }
    ]
    ```

???+ failure 
    No profiles found.


## Edit a Profile


* Endpoint: **/api/v1/admin/profiles/edit*
* Method Type: POST
* Headers: *X-RPS-API-Key*

```json
{
	"payload" :  
    {
        "profileName": "[amt-profile-name]",
        "amtPassword":"[strong-AMT-password]",
        "generateRandomPassword": "false",
        "passwordLength": 8,
        "ciraConfigName": "testconfig",
        "activation": "[acmactivate/ccmactivate]"
    }
}
```

Example Input:

```json
{
    "payload":
    {
        "profileName":"testProfile1",
        "amtPassword":"STRONGPASSWORD",
        "generateRandomPassword":false,
        "passwordLength":null,
        "ciraConfigName": "testconfig",
        "activation":"ccmactivate"
    }
}
```

???+ success
    Profile testProfile1 successfully updated.

???+ failure
    Referenced CIRA Config testconfig58 not found.

???+ failure
    Profile testProfile11 not found

## Delete a Profile

* Endpoint: **/api/v1/admin/profiles/profile1*
* Method Type: DELETE
* Headers: *X-RPS-API-Key*

```
NA
```

Example Input:

```
NA (profile to delete provided as query parameter in url 'profile1')
```

???+ success
    Profile testProfile1 successfully deleted

???+ failure
    Profile not found.

Return to [RPS Methods](../indexRPS.md)