# Intel AMT Profiles

## Create a Profile


* Endpoint: **/api/v1/admin/profiles/create*
* Method Type: POST
* Headers: *X-RPS-API-Key*

```
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

```
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

On Success:

```
Profile testProfile1 successfully inserted
```

On Failure: (Duplicate profile)

```
Profile insertion failed for testProfile1. Profile already exists. 
```

On Failure: (CIRA Config associated doesnt exist)

```
Referenced CIRA Config testconfig58 doesn't exist.
```

<br>

## Get a Profile

* Endpoint: **/api/v1/admin/profiles/{testprofile}*
* Method Type: GET
* Headers: *X-RPS-API-Key*


Example Input:

```
N/A (test profile to retrieve provided in URL as query parameter)
```

On Success:

```
{
    "ProfileName": "testProfile1",
    "AMTPassword": "AMTpassword",
    "GenerateRandomPassword": false,
    "RandomPasswordLength": null,
    "ConfigurationScript": null,
    "Activation": "ccmactivate",
    "CIRAConfigName": "testconfig1"
}
```

On Failure: (profile doesnt exit)

```
Profile testProfile1 not found
```

<br>

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

On Success:

```
[
    {
        "ProfileName": "testProfile1",
        "AMTPassword": "AMTpassword",
        "GenerateRandomPassword": false,
        "RandomPasswordLength": null,
        "ConfigurationScript": null,
        "Activation": "ccmactivate",
        "CIRAConfigName": "testconfig1"
    }
]
```

On Failure: (profiles empty)

```
No profiles found.
```

<br>

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

On Success:

```
Profile testProfile1 successfully deleted
```

On Failure: (profiles not found)

```
Profile not found.
```

<br>

Return to [RPS Methods](../indexRPS.md)