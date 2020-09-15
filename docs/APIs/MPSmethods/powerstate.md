# PowerState

This AMT method retrieves the current state of the Intel&reg; AMT device, and returns a number that that maps to [PowerActions](poweraction.md) table.

Click [here](types.md) for supported input and output types.

## Example: Request Body

>**Note:** The following code block is an example of what would be the data sent as part of the POST request. 

``` yaml
{  
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

Return to [MPS Methods](../indexMPS.md)