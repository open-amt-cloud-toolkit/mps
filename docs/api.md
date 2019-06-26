# Server

``` yaml
url: '{protocol}://{host}:{port}'
variables:
  protocol:
    enum: 
      - http
      - https
      default: https
    host:
      default: 'localhost'
    port:
      enum: 
        - '3000'
        default: '3000'
```

#REST API


## Base path 

``` yaml

/amt/
/admin/

```

### Example:

```
url: https://localhost:3000/amt

```

## HTTP Method

``` yaml

POST

```

## Request body

Method in the request body tells the action that can be performed on the client device. Payload will vary with each method and by default contains the guid of the client details.
Click [here](methods/auditlog.md) to find the currently supported methods and examples in detail.

``` yaml
requestBody:
    content:
      application/json:
        schema:
		   type: object
			properties:
			apiKey:          
			  type: string
			method:          
			  type: string
			payload:
			   type: object
			required:
				- apiKey
				- method
				- payload
```

## Response body

Success response would vary with each method that is requested. Below is the generic pattern for the error codes.

``` yaml
response:
    content:
       application/json; charset=utf-8:
         schema:
           properties:
             status:              
               type: number
             error:
               type: string
```

Click [here](methods\types.md) for supported input and output types.

Example Value

``` yaml

'200':
    {
	  "ResponseBody": responseBody
	}
'400':
    {
	  "status": 400,
	  "error": "Request missing amt guid"
	}
'404':
    {
	  "status": 404,
	  "error": "Device not found/connected. Please connect again using CIRA"
	}
'408':
    {
	  "status": 408,
	  "error": "Timeout error"
	}
'500':
    {
	  "status": 500,
	  "error": "Internal server error"
	}
	
```

#WebSocket

## Base path 

``` yaml

/relay/
/notifications/

```

       