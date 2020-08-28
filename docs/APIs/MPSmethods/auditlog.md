# AuditLog
 
An Admin method, AuditLog returns a requested amount or time range of Intel&reg; AMT Audit Log data for a specified guid. 

Click [here](types.md) for supported input and output types.

## Example: Request Body

``` yaml
{  
   "apiKey":"string",
   "method":"AuditLog",
   "payload":{  
      "guid":"038d0240-045c-05f4-7706-980700080009",
      "logsPerPage":10,
      "page":5,
      "startDate":"2019-04-11",
      "endDate":"2019-04-18"
   }
}
	
```

**Ed Comment:** Does this responsebody match the request?

## Example: Success ResponseBody

``` yaml

    '200':
    {  
	   "ResponseBody":{
	    [  
		  {  
			 "auditAppID":21,
			 "eventID":0,
			 "initiatorType":0,
			 "auditApp":"Network Time",
			 "event":"Intel(R) ME Time Set",
			 "initiator":"$$OsAdmin",
			 "time":"2003-12-29T05:46:37.000Z",
			 "mcLocationType":102,
			 "netAddress":"\u0000\t127.0.0.1\u0004Z-=ï¿½",
			 "ex":{  
				"type":"Buffer",
				"data":[  

				]
			 },
			 "exStr":"Invalid Date"
		  },
		  {  
			 "auditAppID":21,
			 "eventID":0,
			 "initiatorType":0,
			 "auditApp":"Network Time",
			 "event":"Intel(R) ME Time Set",
			 "initiator":"$$OsAdmin",
			 "time":"2017-12-21T17:30:39.000Z",
			 "mcLocationType":189,
			 "netAddress":"\u0000\t1",
			 "ex":{  
				"type":"Buffer",
				"data":[  
				   55,
				   46,
				   48,
				   46,
				   48,
				   46,
				   49,
				   4,
				   90,
				   59,
				   239,
				   191,
				   189,
				   62
				]
			 },
			 "exStr":"5/3/1999, 11:24:30 PM"
		  }
	   ]
	   }
}
					
					
```
