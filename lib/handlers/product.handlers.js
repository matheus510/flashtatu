//
// PRODUCT handlers files
//

// Dependencies
var helpers = require('../helpers');
var _data = require('../data');
var tokenHandlers = require('../handlers/token.handlers');

// Create object to be exported
var lib = {};

lib = function(data, callback){
  // List accepted http methods
  var acceptableMethods = ['post','get','put','delete'];
  
  if(acceptableMethods.indexOf(data.method) > -1){
    lib._product[data.method](data,callback);
  }else{
    callback(405);
  }
};

// Container for all token methods
lib._product = {};

// Product - post
// Required fields: name,price
lib._product.post = function(data, callback){
  // Verify token
  var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
  if(token){
    tokenHandlers._token.verifyToken(token, false, function(tokenIsValid){
      if(tokenIsValid){  
        // Parse payload
        var parsedPayload = JSON.parse(data.payload);
        console.log(typeof(parsedPayload.name) == 'string', parsedPayload.name.length > 0)
        var name = typeof(parsedPayload.name) == 'string' && parsedPayload.name.length > 0 ? parsedPayload.name.trim() : false;
        var price = typeof(parsedPayload.price) == 'number' && parsedPayload.price > 0 ? parsedPayload.price : false;
        
        if(name && price){
          // Check if this product is already registered with the same id
          _data.read('products', name, function(err, data){
            if(err){
              // Create ID for this input
              var idNewProduct = helpers.createRandomString(20);
              // Create object to persist in data files
              var newProduct = {
                'name': name,
                'price': price,
                'id': idNewProduct
              };
              // Persist new product
              _data.create('products', newProduct.name, newProduct, function(err){
                if(!err){
                  callback(200, 'Product created successfully');
                }else{
                  callback(500, 'Could not create new product');
                }
              });
            }else{
              callback(400, {'Error': 'Product already exist'});
            }
          });
        }else{
          callback(400, {'Error' : 'Invalid product name or price'});
        }
      }else{
        callback(400, {'Error': 'Invalid token'});
      }
    });
  }else{
    callback(400, {'Error': 'Invalid or not informed token'});
  }
};
// Product - get
// Required: none
// Optional query string parameters: name
lib._product.get = function(data, callback){
  // Check if name was informed
  var name = typeof(data.queryStringObject.name) == 'string' ? data.queryStringObject.name : false;
    if(name){
      _data.read('products', name, function(err, data){
        if(!err && data){
          callback(200, data);
        }else{
          callback(404, {'Error' : 'No product were found with the given name'});
        }
      });
    }else{
    _data.read('products', false, function(err, data){
      console.log('data:'+ data)
      console.log('error:'+ err)
      if(!err && data){
        console.log(data)
        callback(200, data);
      }else{
        callback(404, {'Error' : 'No products were found in this collection'});
      }
    });
  }
};
// Product - put
// Required fields: name and a optional field
// Optional fields: name, price
lib._product.put = function(data, callback){
  // Verify token
  var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
  if(token){
    tokenHandlers._token.verifyToken(token,false,function(tokenIsValid){
      if(tokenIsValid){
        // Parse payload
        var parsedPayload = JSON.parse(data.payload);
        
        // Verify if name or price were sended
        var name = typeof(parsedPayload.name) == 'string' && parsedPayload.name.trim().length > 0 ? parsedPayload.name.trim() : false;
        var price = typeof(parsedPayload.price) == 'number' && parsedPayload.price > 0 ? parsedPayload.price : false;
          if(name || price){
            _data.read('products', name, function(err, productData){
              if(!err && data){
                // Update fields as provided
                if(name){
                  productData.name = name;
                }
                if(price){
                  productData.price = price;
                }
                _data.update('products', name, productData, function(err){
                  if(!err){
                    callback(200, productData);
                  }else{
                    callback(500, {'Error': 'Could not update the product, something wrong occurred'});
                  }
                });
              }else{
                callback(404, {'Error': 'Could not find specified product to update it'});
              }
            });
          }
        }else{
          callback(400, {'Error': 'Invalid token'});
        }
      });
  }else{
    callback(400,{'Error' : 'Invalid token'});
  }
};
// Product - delete
// Required fields: name
lib._product.delete = function(data, callback){
  // Verify token
  var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
  tokenHandlers._token.verifyToken(token,false,function(tokenIsValid){
    if(tokenIsValid){
      // Parse payload
      var parsedPayload = JSON.parse(data.payload);
      // Verify if the name informed does exist
      var name = typeof(parsedPayload.name) == 'string' ? parsedPayload.name : false;

      if(name){
        _data.delete('products', name, function(err){
          if(!err){
            callback(200, 'Deleted successfully');
          }else{
            callback(500, {'Error' : 'Product could not be deleted'});
          }
        });
      }else{
        callback(400, {'Error' : 'Product not found'});
      }
    }else{
      callback(400, {'Error' : 'Invalid token'});
    }
  });
};

module.exports = lib;
