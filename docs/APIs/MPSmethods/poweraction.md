# PowerAction

This AMT method lets you perform an out-of-band power action.

Actions are specified by number. Use the [PowerCapabilities](powercapabilities.md) method to return the actions availabl for a specific device.

Possible actions are listed in the following table:

   | Action #       |  Resulting Action |
   | :----------- | :------------------------ |   
   | **2** | Power up/on |
   | **4** | Sleep | 
   | **5** | Power cycle |
   | **7** | Hibernate |
   | **8** | Power down/off |
   | **10** | Reset |
   | **12** | Soft power down/off |
   | **14** | Soft reset |
   | **100** | Power up to BIOS settings |
   | **101** | Reset to BIOS settings |
   | **104** | Reset to secure erase |
   | **200** | Reset to IDE-R floppy disc |
   | **201** | Power on to IDE-R floppy disc |
   | **202** | Reset to IDE-R CD-ROM |
   | **203** | Power on to IDE-R CD-ROM |
   | **400** | Reset to PXE |
   | **401** | Power on to PXE |



## Example: Request Body

``` yaml

{  
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

Return to [MPS Methods](../indexMPS.md)