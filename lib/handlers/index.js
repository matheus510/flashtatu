//
// INDEX for handlers files
//

// Handlers imports
var tokenHandlers = require('./token.handlers');
var userHandlers = require('./user.handlers');
var tattooHandlers = require('./tattoo.handlers');
var cartHandlers = require('./cart.handlers');
var phoneHandlers = require('./phone.handlers');

// Container for all handlers
var handlers = {};

// Ping handler for testing purposes
handlers.ping = function(data, callback){
  callback(200, {'Server':'up'});
};

handlers.notFound = function(data,callback){
  callback(404);
};

handlers.user = userHandlers;
handlers.token = tokenHandlers;
handlers.tattoo = tattooHandlers;
handlers.cart = cartHandlers;
handlers.phone = phoneHandlers;


module.exports = handlers;
