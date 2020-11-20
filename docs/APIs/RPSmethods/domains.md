# Intel AMT Domains

## Create A Domain

* Endpoint: **/api/v1/admin/domains/create*
* Method Type: POST
* Headers: *X-RPS-API-Key*

```json
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
```json
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

???+ success:
    Domain amtDomain successfully inserted

???+ failure
    Duplicate Domain. Domain already exists.

## Get a Domain

* Endpoint: **/api/v1/admin/domains/domain1*
* Method Type: GET
* Headers: *X-RPS-API-Key*

```
input domain1 provided in the URL
```

Example output:

???+ success
    ```json
    {
        "Name": "domain1",
        "DomainSuffix": "vprodemo.com",
        "ProvisioningCert": null,
        "ProvisioningCertStorageFormat": "string",
        "ProvisioningCertPassword": null
    }
    ```

???+ failure
    Domain not found

## Get ALL Domains

* Endpoint: **/api/v1/admin/domains/*
* Method Type: GET
* Headers: *X-RPS-API-Key*

```
input  provided in the URL
```

Example output:

???+ success
    ```json
    [
        {
            "Name": "domain1",
            "DomainSuffix": "vprodemo.com",
            "ProvisioningCert": null,
            "ProvisioningCertStorageFormat": "string",
            "ProvisioningCertPassword": null
        }
    ]
    ```

???+ failure
    Domains not found

## Edit A Domain

* Endpoint: **/api/v1/admin/domains/edit*
* Method Type: POST
* Headers: *X-RPS-API-Key*

```json
{
    "payload": 
    { 
        "Name":"domain1",
        "DomainSuffix":"d1.com",
        "ProvisioningCert":"[Your_ProvisioningCert_Text]", 
        "ProvisioningCertStorageFormat":"raw",
        "ProvisioningCertPassword":"[P@ssw0rd]"
    }
}
```

Example Input:
```json
{
    "payload": 
    { 
        "Name":"amtDomain",
        "DomainSuffix":"amtDomain.com",
        "ProvisioningCert":"[Your_ProvisioningCert_Text]", 
        "ProvisioningCertStorageFormat":"raw",
        "ProvisioningCertPassword":"P@ssw0rd"
    }
}
```

???+ success
    Domain amtDomain successfully updated

???+ failure
    Domain domain1 not found

# Delete a Domain

* Endpoint: **/api/v1/admin/domains/domain1*
* Method Type: DELETE
* Headers: *X-RPS-API-Key*


Example Input:

```
NA (domain to delete provided as query parameter in url 'domain1')
```
???+ success
    Domain domain1 successfully deleted

???+ failure
    Domain not found.


Return to [RPS Methods](../indexRPS.md)