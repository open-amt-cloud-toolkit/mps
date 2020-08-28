# Disconnect

Use this Admin method to disconnect a CIRA connection for a specified guid.

Click [here](types.md) for supported input and output types.

## Example: Request Body

``` yaml
{  
   "apiKey":"string",
   "method":"Disconnect",
   "payload":{"guid": "038d0240-045c-05f4-7706-980700080009"}
}
	
```
## Example : Success ResponseBody

``` yaml

{
	"success": 200,
	"description": "CIRA connection disconnected : 038d0240-045c-05f4-7706-980700080009"
}

```
