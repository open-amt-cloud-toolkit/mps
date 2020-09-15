# SetAMTFeatures

Use this AMT method to enable or disable Intel&reg; AMT features such as KVM, SOL, and IDE-R.

## Example: Request Body

>**Important Note:** More information on obtaining an AMT device's GUID can be found [here](../../Topics/guids.md).

>**Note:** The following code block is an example of what would be the data sent as part of the POST request. 

``` yaml
{  
   "method":"SetAMTFeatures",
   "payload":{  
      "guid":"038d0240-045c-05f4-7706-980700080009", //Replace with an AMT Device's GUID
      "userConsent":"all"
      "enableSOL": false,
      "enableIDER": false,
      "enableKVM": true
   }
}
```
## Example : Success ResponseBody

``` yaml

'200':
    {
      "ResponseBody":"Updated"
    }

```

Return to [MPS Methods](../indexMPS.md)