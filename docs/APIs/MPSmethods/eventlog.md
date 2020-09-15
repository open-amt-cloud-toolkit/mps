# EventLog

This AMT method returns sensor and hardware event data for a specific guid.

Click [here](types.md) for supported input and output types.

## Example: Request Body

>**Important Note:** More information on obtaining an AMT device's GUID can be found [here](../../Topics/guids.md).

>**Note:** The following code block is an example of what would be the data sent as part of the POST request. 

``` yaml
{  
   "method":"EventLog",
   "payload":{  
      "guid":"038d0240-045c-05f4-7706-980700080009", //Replace with an AMT Device's GUID
      "logsPerPage":10,
      "page":5,
      "startDate":"2019-04-11",
      "endDate":"2019-04-18"
   }
}
	
```
## Example : Success ResponseBody

``` yaml

    '200':
    {
      "ResponseBody":{
		[  
		   {  
			  "deviceAddress":255,
			  "eventSensorType":15,
			  "eventType":111,
			  "eventOffset":2,
			  "eventSourceType":104,
			  "eventSeverity":1,
			  "sensorNumber":255,
			  "entity":11,
			  "entityInstance":0,
			  "eventData":[  
				 64,
				 8,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0
			  ],
			  "time":"2019-04-11T17:57:40.000Z",
			  "entityStr":"Add in card",
			  "desc":"Option ROM initialization"
		   },
		   {  
			  "deviceAddress":255,
			  "eventSensorType":15,
			  "eventType":111,
			  "eventOffset":2,
			  "eventSourceType":104,
			  "eventSeverity":1,
			  "sensorNumber":255,
			  "entity":34,
			  "entityInstance":0,
			  "eventData":[  
				 64,
				 6,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0
			  ],
			  "time":"2019-04-11T17:57:39.000Z",
			  "entityStr":"BIOS",
			  "desc":"USB resource configuration"
		   }
		]	
	    }
	}
```

Return to [MPS Methods](../indexMPS.md)