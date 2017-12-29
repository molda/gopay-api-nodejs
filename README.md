# gopay-api-nodejs

### Usage
```javascript
var GoPay = require('gopay');

GoPay.init({
	clientID: 'xxxxxx'
	clientSecret: 'xxxxxxx'
}/* , true  */); // true for production, since default is debug mode

// default scope is 'payment-create'
GoPay.getToken(/*scope, */function(err, token){

	var payment = new Payment()
		.payer({contact: { email: 'test@test.cz' }})
		.target({
			type:'ACCOUNT',
			goid: gp.goid
		})
		.amount(1000)
		.currency("CZK")
		.orderNo("001")
		.orderDesc("pojisteni01")
		.items([{ name:'item01', amount:1000 }])
		.preAuth(true)
		.additional_params([{"name":"invoicenumber", "value":"2015001003"}])
		.callback({
			"return_url":"http://martin.smola/return",
			// "notification_url":"http://www.eshop.cz/notify"
		})
		.toObj();

	GoPay.createPayment(payment, token, function(err, data){

		GoPay.getStatus(data.id, token, function(err, data){
			
		});			
	});	

});
```

License: MIT