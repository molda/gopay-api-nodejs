/*
 *  GoPay module
 *  http://www.gopay.com
 *
 *  Docs
 *  https://doc.gopay.com/cs/
 */

var path = require('path');
var request = require('request');
var Payment = require('payment.js');

var opts = {}
var ready = false;
var apiUrl = 'https://gate.gopay.cz/api';

/*
 *  Init
 *
 *  @param clientID 
 *  @param clientSecret 
 *
 */

exports.init = function(options, isDebug) {

    if (!options) throw new Error('Cannot initialized GoPay, options required!');

    var errors = [];
    if (!options.clientID) errors.push('clientID');
    if (!options.clientSecret) errors.push('clientSecret');
    if (errors.length) throw new Error('Options "' + errors.join(', ') + '" required!');

    if (isDebug) apiUrl = 'https://gw.sandbox.gopay.com/api';

    console.log('using apiUrl:', apiUrl)

    opts = options;
    ready = true;

}

exports.getToken = getToken;
exports.createPayment = createPayment;
exports.getStatus = getStatus;

exports.Payment = Payment;


/*
 *  Get token
 *
 *  @param scope [optional] default 'payment-create', posssible values are 'payment-all' or 'payment-create'
 *  @param callback Function to call after response recieved callback(err, data);
 *  
 *  Response data object
 *  @param token_type   =bearer
 *  @param access_token =<new-token>
 *  @param expires_in   =1800
 *
 */

function getToken(scope, callback) {

    if (!ready) throw new Error('GoPay library not initialized!');

    if (typeof scope == 'function') {
        callback = scope;
        scope = null;
    }

    var options = {
        url: gopayApiUrl + '/oauth2/token',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            grant_type: 'client_credentials',
            scope: scope ? scope : 'payment-create'
        }
    };
    options.headers[clientID] = clientSecret;

    request.post(options, function(err, response, body) {

        if (err) return callback(err);
        if (response.statusCode !== 200) return statusError(response.statusCode, callback);

        console.log(body);

        callback(null, body);

    });
}

/*
*   Create payment
*
*   @param data Payment object
*   @param token Authorization token that was returned by getToken method
*   @param callback Function to call after response recieved callback(err, data);


    Minimal data object https://doc.gopay.com/cs/?shell#standardní-platba
    {
        "target": {
            "type":"ACCOUNT",
            "goid":"8123456789"
        ,
        "amount":"7000",
        "currency":"CZK",
        "order_number":"001",
        "order_description":"pojisteni01"
        "items":[
            {"name":"item01","amount":"3500"},
            {"name":"item02","amount":"3500"}
        ],
        "callback":{
            "return_url":"http://www.eshop.cz/return",
            "notification_url":"http://www.eshop.cz/notify"
        },
        "lang":"cs"
    }
*/

function createPayment(data, token, callback) {

    if (!ready) throw new Error('GoPay library not initialized!');

    if (!token || token === '') return callback('Error: Token reguired');

    var options = {
        url: apiUrl + '/payments/payment',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: data
    };
    options.headers['Authorization'] = 'Bearer ' + token;

    request.post(options, function(err, response, body) {

        if (err) return callback(err);
        if (response.statusCode !== 200) return statusError(response.statusCode, callback);

        console.log(body);

        callback(null, body);

    });
}

function getStatus(id, token, callback) {
    if (!token) return callback('Error: Token reguired');
    if (!id || id === '') return callback('Error: Payment ID reguired');

    var options = {
        url: apiUrl + '/payments/payment' + id,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    options.headers['Authorization'] = 'Bearer ' + token;

    request.get(options, function(err, response, body) {

        if (err) return callback(err);
        if (response.statusCode !== 200) return statusError(response.statusCode, callback);

        console.log(body);

        callback(null, body);
    });
}

function statusError(status, callback) {
    var err;
    switch (status) {
        case '403':
            err = 'GoPay::Unauthorized';
            break;
        case '409':
            err = 'GoPay::Validation error';
            break;
        case '500':
            err = 'GoPay::Internal server error';
            break;
        case '404':
            err = 'GoPay::Not found';
            break;
        default:
            err = 'GoPay::Error status->' + status;
    }
    callback('Error: Response status -> ' + err);
}
