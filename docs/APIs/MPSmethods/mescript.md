# MEScript

This Admin method downloads the cira_setup.mescript from MPS. 

Click [here](types.md) for supported input and output types.

## Example: Request Body

>**Note:** The following code block is an example of what would be the data sent as part of the POST request. 

``` yaml
{  
   "method":"MEScript",
   "payload":{}
}
	
```
## ResponseBody

Downloads ME Script file.

``` yaml
Sample JavaScript code: 

$.ajax({
url: '/admin',
method: 'POST',
data: JSON.stringify(postdata),
contentType: "application/json",
success: function (data) {
	var blob = new Blob([data], {type: "application/octet-stream"});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement('a');
	a.setAttribute('hidden', '');
	a.setAttribute('href', url);
	a.setAttribute('download', fileName);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	window.URL.revokeObjectURL(url);
},
error: function(error){
  console.log(error);
}       


```

Return to [MPS Methods](../indexMPS.md)