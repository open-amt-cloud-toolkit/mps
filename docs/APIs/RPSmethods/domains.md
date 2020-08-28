## Creating an AMT Domain

### Input for creating a domain REST API

**Create A Domain**

* Endpoint: **/api/v1/admin/domains/create*
* Method Type: POST
* Headers: *X-RPS-API-Key*

```
{
    "payload": 
    { 
        "Name":"domain1",
        "DomainSuffix":"d1.com",
        "ProvisioningCert":"[Your_ProvisioningCert_Text]", //Can this be a directory path for the api call or has to be flat text like DX1?
        "ProvisioningCertStorageFormat":"raw",
        "ProvisioningCertPassword":"[P@ssw0rd]"
    }
}
```

Example Input:
```
{
    "payload": 
    { 
        "Name":"amtDomain",
        "DomainSuffix":"amtDomain.com",
        "ProvisioningCert":"[Your_ProvisioningCert_Text]", //Can this be a directory path for the api call or has to be flat text like DX1?
        "ProvisioningCertStorageFormat":"raw",
        "ProvisioningCertPassword":"P@ssw0rd"
    }
}
```

On Success:

```
Domain domain2 successfully inserted
```

On Failure: (Duplicate Domain)

```
Duplicate Domain. Domain already exists.
```

**Get a Domain**

* Endpoint: **/api/v1/admin/domains/domain1*
* Method Type: GET
* Headers: *X-RPS-API-Key*

```
input domain1 provided in the URL
```

Example output:

On Success:

```
{
    "Name": "domain1",
    "DomainSuffix": "vprodemo.com",
    "ProvisioningCert": "asfasf",
    "ProvisioningCertStorageFormat": "string",
    "ProvisioningCertPassword": "PROVISIONING_CERT_PASSWORD_KEY"
}
```

On Failure: (Domain not found)

```
Domain not found
```

**Get ALL Domains**

* Endpoint: **/api/v1/admin/domains/*
* Method Type: GET
* Headers: *X-RPS-API-Key*

```
input  provided in the URL
```

Example output:

On Success:

```
[
    {
        "Name": "domain1",
        "DomainSuffix": "vprodemo.com",
        "ProvisioningCert": "asfasf",
        "ProvisioningCertStorageFormat": "string",
        "ProvisioningCertPassword": "PROVISIONING_CERT_PASSWORD_KEY"
    }
]
```

On Failure: (Domain empty)

```
Domains not found
```

**Delete a Domain**



* Endpoint: **/api/v1/admin/domains/domain1*
* Method Type: DELETE
* Headers: *X-RPS-API-Key*

```
NA
```

Example Input:

```
NA (domain to delete provided as query parameter in url 'domain1')
```

On Success:

```
Domain domain1 successfully deleted
```

On Failure: (Domain not found)

```
Domain not found.
```
