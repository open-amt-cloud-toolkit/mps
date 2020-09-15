# Connected Devices

The Admin method ConnectedDevices lists all devices currently connected to MPS.

Click [here](types.md) for supported input and output types.

## Example: Request Body

>**Note:** The following code block is an example of what would be the data sent as part of the POST request. 

``` yaml
{  
   "method":"ConnectedDevices",
   "payload":{}
}
	
```
## Example : Success ResponseBody

``` yaml
[
    {
        "name": "Win7-machine",
        "mpsuser": "standalone",
        "amtuser": "admin",
        "host": "8dad96cb-c3db-11e6-9c43-bc0000d20000",
        "icon": 1,
        "conn": 1
    }
]
```

Return to [MPS Methods](../indexMPS.md)