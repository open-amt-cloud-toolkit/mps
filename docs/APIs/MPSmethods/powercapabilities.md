# PowerCapabilities

This AMT method returns a list of out-of-band power actions are available for the specified device. You can invoke these actions with the [PowerAction](./APImethods/MPSmethods/poweraction.md) method.

Click [here](types.md) for supported input and output types.

## Example: Request Body

``` yaml
{  
   "method":"PowerCapabilities",
   "payload":{  
      "guid":"038d0240-045c-05f4-7706-980700080009"
   }
}

```
## Example : Success ResponseBody

``` yaml

'200':
    {
      "ResponseBody": {
		"powerUp":2,
		"powerCycle":5,
		"powerDown":8,
		"reset":10,
		"softOff":12,
		"softReset":14,
		"sleep":4,
		"hibernate":7,
		"powerUpToBIOS":100,
		"resetToBIOS":101,
		"resetToSecureErase":104,
		"resetToIDE-RFloppy":200,
		"powerOnToIDE-RFloppy":201,
		"resetToIDE-RCDROM":202,
		"powerOnToIDE-RCDROM":203,
		"resetToPXE":400,
		"powerOnToPXE":401
	}

```

Return to [MPS Methods](../indexMPS.md)