#Admin Methods

## All Devices

Click [here](types.md) for supported input and output types.

### Example: Request Body

``` yaml
{  
   "apiKey":"string",
   "method":"AllDevices",
   "payload":{}
}
	
```
### Example: Success ResponseBody

``` yaml
[
    {
        "name": "ubuntu",
        "mpsuser": "standalone",
        "mpspass": "P@ssw0rd",
        "amtuser": "admin",
        "amtpass": "P@ssw0rd",
        "host": "aa745e97-6416-4495-9b34-54b2030b1193",
        "icon": 1,
        "conn": 0
    },
    {
        "name": "Windows",
        "mpsuser": "standalone",
        "mpspass": "P@ssw0rd",
        "amtuser": "admin",
        "amtpass": "P@ssw0rd",
        "host": "4bac9510-04a6-4321-bae2-d45ddf07b684",
        "icon": 1,
        "conn": 0
    }
]
```
