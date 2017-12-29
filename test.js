var GoPay = require('./index.js');
var Payment = GoPay.Payment;

var gp = {
	clientid: 'xxxxxxx',
	clientsecret: 'xxxxxx',
	goid: 'xxxxxx'
}

GoPay.init({
	clientID: gp.clientid,
	clientSecret: gp.clientsecret
});

GoPay.getToken(function(err, token){

	if (err)
		return console.log('Error getting token', err);

	var payment = new Payment()
		.payer({contact: { email: 'test@test.cz' }})
		.target({
			type:'ACCOUNT',
			goid: gp.goid
		})
		.amount(1000)
		.currency("CZK")
		.orderNo("001")
		.orderDesc("payment description")
		.items([{ name:'item01', amount:1000 }])
		.preAuth(true)
		.additional_params([{"name":"invoicenumber", "value":"2015001003"}])
		.callback({
			"return_url":"http://www.eshop.cz/return",
			"notification_url":"http://www.eshop.cz/notify"
		})
		.toObj();


	GoPay.createPayment(payment, token, function(err, data){

		if (err)
			return console.log('Payment err', err.message, err.body);

		console.log('Payment data', data);

		// use data.gw_url to redirect user to gopay gateway to make a payment

		// when the user is redirected to return_url get status of the payment
		GoPay.getStatus(data.id, token, function(err, data){

			if (err)
				return console.log('Payment err', err.message, err.body);

			console.log('Payment status', data);
		});
	});

});