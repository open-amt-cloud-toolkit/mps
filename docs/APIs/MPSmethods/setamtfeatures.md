# SetAMTFeatures

Use this AMT method to enable or disable Intel&reg; AMT features such as KVM, SOL, and IDE-R.

## Example: Request Body

``` yaml
{  
   "apiKey":"string",
   "method":"SetAMTFeatures",
   "payload":{  
      "guid":"038d0240-045c-05f4-7706-980700080009",
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