/*
 *  GoPay module
 *  http://www.gopay.com
 *
 *  Docs
 *  https://doc.gopay.com/cs/
 */

var path = require('path');
var request = require('request');
var Payment = require('./payment.js');

var opts = {}
var ready = false;
var apiUrl = 'https://gw.sandbox.gopay.com/api';

/**
 *  Init
 *
 *  @param clientID 
 *  @param clientSecret
 */

exports.init = function(options, isProduction) {

	if (!options) throw new Error('Cannot initialized GoPay, options required!');

	var errors = [];
	if (!options.clientID) errors.push('clientID');
	if (!options.clientSecret) errors.push('clientSecret');
	if (errors.length) throw new Error('Options "' + errors.join(', ') + '" required!');

	if (isProduction) apiUrl = 'https://gate.gopay.cz/api';

	console.log('using apiUrl:', apiUrl)

	opts = options;
	ready = true;
}

exports.getToken = getToken;
exports.createPayment = createPayment;
exports.getStatus = getStatus;
exports.Payment = Payment;

/**
 *  Get token
 *
 *  @param scope [optional] default 'payment-create', posssible values are 'payment-all' or 'payment-create'
 *  @param callback Function to call after response recieved callback(err, data);
 *  
 *  Response data object
 *    @param token_type   = bearer
 *    @param access_token = <new-token>
 *    @param expires_in   = 1800
 */

function getToken(scope, callback) {

	if (!ready) 
		throw new Error('GoPay library not initialized!');

	if (typeof scope == 'function') {
		callback = scope;
		scope = null;
	}

	var options = {
		url: apiUrl + '/oauth2/token',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + new Buffer(opts.clientID + ':' + opts.clientSecret).toString('base64')
		},
		form: {
			grant_type: 'client_credentials',
			scope: scope ? scope : 'payment-create'
		}
	};

	request.post(options, function(err, response, body) {

		if (err) 
			return callback(err);

		if (response.statusCode !== 200) 
			return statusError(response.statusCode, body, callback);

		try {
			body = JSON.parse(body);
		} catch(err) {
			return callback(err);
		}

		callback(null, body.access_token);
	});
}

/**
*   Create payment
*
*   @param data Payment object
*   @param token Authorization token that was returned by getToken method
*   @param callback Function to call after response recieved callback(err, data);
*/

function createPayment(data, token, callback) {

	if (!ready) 
		throw new Error('GoPay library not initialized!');

	if (!token) 
		return callback({ error: 'Error: Token reguired' });

	var options = {
		url: apiUrl + '/payments/payment',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token
		},
		json: data
	};

	request.post(options, function(err, response, body) {
		if (err) return callback(err);
		if (response.statusCode !== 200) return statusError(response.statusCode, body, callback);

		callback(null, body);
	});
}

/**
*   Get payment status by id
*
*   @param id Payment ID
*   @param token Auth token
*   @param callback Function to call after response recieved callback(err, data); 
*/

function getStatus(id, token, callback) {

	if (!ready) 
		throw new Error('GoPay library not initialized!');

	if (!token) 
		return callback({ error: 'Error: Token reguired' });

	if (!id) 
		return callback({ error: 'Error: Payment ID reguired' });

	var options = {
		url: apiUrl + '/payments/payment/' + id,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Bearer ' + token
		}
	};

	request.get(options, function(err, response, body) {

		if (err) return callback(err);
		if (response.statusCode !== 200) return statusError(response.statusCode, body, callback);

		try {
			body = JSON.parse(body);
		} catch(err) {
			return callback(err);
		}

		callback(null, body);
	});
}

/**
*   Error handler
*
*   @param status Response status
*   @param body Response body
*   @param callback Function to call with error
*/

function statusError(status, body, callback) {
	var err;
	switch (status) {
		case 403:
			err = 'GoPay::Unauthorized';
			break;
		case 409:
			err = 'GoPay::Validation error';
			break;
		case 500:
			err = 'GoPay::Internal server error';
			break;
		case 404:
			err = 'GoPay::Not found';
			break;
		default:
			err = 'GoPay::Error';
	}
	callback({
		message: err,
		status: status,
		body: body
	});
}
