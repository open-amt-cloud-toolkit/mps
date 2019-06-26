# AMT Power state

Click [here](types.md) for supported input and output types.

## Example: Request Body

``` yaml
{  
   "apiKey":"string",
   "method":"PowerState",
   "payload":{  
      "guid":"038d0240-045c-05f4-7706-980700080009"
   }
}
```
## Example : Success ResponseBody

``` yaml

'200':
    {
      "ResponseBody":{
		"powerState" : 2
	}

```