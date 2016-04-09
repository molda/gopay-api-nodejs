/*
*	Payment builder
*
*/

// var p = new Payment()
// 			.payer({contact: 'pepa'})
// 			.target({type:'ACCOUNT'})
// 			.amount("1000")
// 			.currency("CZK")
// 			.toObj();

// console.log(p);

module.eports = Payment;

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
	this.payment.amount = data;
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
Payment.prototype.params  = function (data) {
	this.payment.params = data;
	return this;
}

Payment.prototype.callback  = function (data) {
	this.payment.callback = data;
	return this;
}

Payment.prototype.toObj  = function () {
	return this.payment;
}

