//
// CART handlers file
//

// Dependencies
var helpers = require('../helpers');
var _data = require('../data');

// Create object to export to handlers
var lib = {};

// Create wrapper for all user methods
lib = function(data,callback){
  // List accepted http methods
  var acceptableMethods = ['get', 'post','put', 'delete'];

  if(acceptableMethods.indexOf(data.method) > -1){
    lib._cart[data.method](data,callback);
  }else{
    callback(405);
  }
};

// Container for all user methods
lib._cart = {};

// Cart - Post
// Required fields: emailAddress, tattooList
// Optional: checkOutReady (defaults to false, if not sent)
lib._cart.post = function(data, callback){
  // Validate token
  var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
  var emailAddress = typeof(data.queryStringObject.email) == 'string' && helpers.validateEmail(data.queryStringObject.email) ? data.queryStringObject.email : false;
  var tattooList = Array.isArray(parsedPayload.tattooList) ? parsedPayload.tattooList : false;
  var checkOutReady = typeof(parsedPayload.checkOutReady) == 'boolean' ? parsedPayload.checkOutReady : false;

  if(emailAddress){
    handlers._token.verifyToken(token, emailAddress, function(tokenIsValid){
      if(tokenIsValid){
        // Create object to be sent
        var newCart = {
          'emailAddress': emailAddress,
          'tattooList': tattooList,
          'checkOutReady': checkOutReady
        };
        // Check if the cart already exists
        _data.read('carts', emailAddress, function(err, data){
          if(err){
            // Save new cart
            data.update('carts', emailAddress, newCart, function(err){
              if(!err){
                callback(200, 'Cart updated successfully');
              }else{
                callback(500, {'Error' : 'Could not create new cart'});
              }
            });
          }else{
            // In case of not existing a cart for that email, create one
            _data.create('carts', emailAddress, newCart, function(err){
              if(!err){
                callback(200, 'Cart created successfully');
              }else{
                callback(500, {'Error' : 'Could not create new cart'});
              }
            });
          }
        });
      }else{
        callback(400, {'Error' : 'Invalid token'});
      }
    });
  }else{
    callback(404, {'Error' : 'Given email was not found.'});
  }
};
// Cart - get
// Required fields: emailAddress
lib._cart.get = function(data, callback){
  // Validate token
  var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

  handlers._token.verifyToken(token, emailAddress, function(tokenIsValid){
    if(tokenIsValid){
      // Validate email
      var emailAddress = typeof(data.queryStringObject.email) == 'string' && helpers.validateEmail(data.queryStringObject.email) ? data.queryStringObject.email : false;

      if(emailAddress){
        // Read carts
        _data.read('carts', emailAddress, function(err, data){
          // Return data or err
          if(!err && data){
            callback(200, data);
          }else{
            callback(500, {'Error' : 'Error whire reading data'});
          }
        });
      }else{
        callback(404, {'Error' : 'User not found'});
      }
    }else{
      callback(400, {'Error' : 'Invalid token'});
    }
  });
};

// Cart - put
// Required fields: tattooList
// Optional: checkOutReady (defaults to false, if not sent)
lib._cart.put = function(data, callback){
  // Parse payload
  var parsedPayload = JSON.parse(data.payload);
  
  var emailAddress = typeof(parsedPayload.emailAddress) == 'string' && helpers.validateEmail(parsedPayload.emailAddress) ? parsedPayload.emailAddress : false;
  var tattooList = Array.isArray(parsedPayload.tattooList) ? parsedPayload.tattooList : false;
  var checkOutReady = typeof(parsedPayload.checkOutReady) == 'boolean' ? parsedPayload.checkOutReady : false;

  // Verify token
  var token = typeof(data.header.token) == 'string' ? data.headers.token : false;
  handlers._token.verifyToken(token, emailAddress, function(tokenIsValid){
    if(tokenIsValid && emailAddress){
      if(tattooList){
        var updateObject = {
          'tattooList': tattooList,
          'checkOutReady': checkOutReady
        };
        _data.update('carts', emailAddress, updateObject, function(err){
          if(!err){
            callback(200, updateObject);
          }else{
            callback(500, {'Error' : 'Could not update shopping cart'});
          }
        });
      }else{
        callback(400, {'Error' : 'Tattoo list not valid'});
      }
    }else{
      callback(400, {'Error' : 'Token or email address invalid'});
    }
  });
};
// Cart - Delete
// Required fields: emailAddress
lib._cart.delete = function(data, callback){
  //Parse payload
  var parsedPayload = JSON.parse(data.payload);
  // Verify if the email informed does exist
  var emailAddress = typeof(parsedPayload.emailAddress) == 'string' && helpers.validateEmail(parsedPayload.emailAddress) ? parsedPayload.emailAddress : false;

  if(emailAddress){
    // Verify token
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    handlers._token.verifyToken(token,phone,function(tokenIsValid){
    if(tokenIsValid){
      _data.delete('users', emailAddress, function(err){
        if(!err){
          callback(200, 'User deleted successfully');
        }else{
          callback(500, {'Error' : 'User could not be deleted'});
        }
      });
    }else{
    callback(400, {'Error' : 'Invalid token'});
    }
  });
  }else{
    callback(400, {'Error' : 'User not found'});
  }
};

module.exports = lib;
