# AMT Power action

Click [here](types.md) for supported input and output types.

## Example: Request Body

``` yaml

{  
   "apiKey":"string",
   "method":"PowerAction",
   "payload":{  
      "guid":"038d0240-045c-05f4-7706-980700080009",
      "action":2
   }
}
	
```

## Example : Success ResponseBody

``` yaml

'200':
    {
      "ResponseBody":{
		"returnValue":0,
		"returnValueStr":"SUCCESS"
	}

```