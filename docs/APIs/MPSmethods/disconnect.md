# Disconnect

Use this Admin method to disconnect a CIRA connection for a specified guid.

Click [here](types.md) for supported input and output types.

## Example: Request Body

>**Important Note:** More information on obtaining an AMT device's GUID can be found [here](../../Topics/guids.md).

>**Note:** The following code block is an example of what would be the data sent as part of the POST request. 

``` yaml
//admin method

{  
   "method":"Disconnect",
   "payload":{
      "guid": "038d0240-045c-05f4-7706-980700080009"
   }
}
	
```
## Example : Success ResponseBody

``` yaml

{
	"success": 200,
	"description": "CIRA connection disconnected : 038d0240-045c-05f4-7706-980700080009"
}

```

Return to [MPS Methods](../indexMPS.md)