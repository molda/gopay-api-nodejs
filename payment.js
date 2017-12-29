/*
*	Payment builder
*
*/

// var payment = new Payment()
// 	.payer({contact: { email: 'test@test.cz' }})
// 	.target({
// 		type:'ACCOUNT',
// 		goid: gp.goid
// 	})
// 	.amount(1000)
// 	.currency("CZK")
// 	.orderNo("001")
// 	.orderDesc("payment description")
// 	.items([{ name:'item01', amount:1000 }])
// 	.preAuth(true)
// 	.additional_params([{"name":"invoicenumber", "value":"2015001003"}])
// 	.callback({
// 		"return_url":"http://www.eshop.cz/return",
// 		"notification_url":"http://www.eshop.cz/notify"
// 	})
// 	.toObj();

// console.log(payment);

function Payment () {
	this.payment = {};
	return this;
}

Payment.prototype.payer  = function (data) {
	this.payment.payer = data;
	return this;
}
Payment.prototype.target  = function (data) {
	this.payment.target = data;
	return this;
}
Payment.prototype.amount  = function (data) {
	this.payment.amount = data.toString();
	return this;
}
Payment.prototype.currency  = function (data) {
	this.payment.currency = data;
	return this;
}
Payment.prototype.orderNo  = function (data) {
	this.payment.order_number = data;
	return this;
}
Payment.prototype.orderDesc  = function (data) {
	this.payment.order_description = data;
	return this;
}
Payment.prototype.items  = function (data) {
	this.payment.items = data;
	return this;
}
Payment.prototype.preAuth  = function (data) {
	this.payment.preauthorization = data;
	return this;
}
Payment.prototype.additional_params  = function (data) {
	this.payment.additional_params = data;
	return this;
}
Payment.prototype.lang  = function (data) {
	this.payment.lang = data;
	return this;
}

Payment.prototype.callback  = function (data) {
	this.payment.callback = data;
	return this;
}

Payment.prototype.toObj  = function () {
	return this.payment;
}

module.exports = Payment;