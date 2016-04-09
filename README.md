# gopay-api-nodejs



Not tested yet


### Usage
```javascript
var GoPay = require('gopay');

GoPay.init({
	clientID: 'xxxxxx'
	clientSecret: 'xxxxxxx'
});

GoPay.getToken(scope, function(err, token){

});

//See docs for data structure
var data = {}

GoPay.createPayment(data, token, function(err, data){
	
});	

GoPay.getStatus(id, token, function(err, data){
	
});	
```