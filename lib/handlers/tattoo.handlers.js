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
    lib._tattoo[data.method](data,callback);
  }else{
    callback(405);
  }
};

// Container for all token methods
lib._tattoo = {};

// Tattoo - post
// Required fields: name,price
lib._tattoo.post = function(data, callback){
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
          // Check if this tattoo is already registered with the same id
          _data.read('tattoos', name, function(err, data){
            if(err){
              // Create ID for this input
              var idNewTattoo = helpers.createRandomString(20);
              // Create object to persist in data files
              var newTattoo = {
                'name': name,
                'price': price,
                'id': idNewTattoo
              };
              // Persist new tattoo
              _data.create('tattoos', newTattoo.name, newTattoo, function(err){
                if(!err){
                  callback(200, 'Tattoo created successfully');
                }else{
                  callback(500, 'Could not create new tattoo');
                }
              });
            }else{
              callback(400, {'Error': 'Tattoo already exist'});
            }
          });
        }else{
          callback(400, {'Error' : 'Invalid tattoo name or price'});
        }
      }else{
        callback(400, {'Error': 'Invalid token'});
      }
    });
  }else{
    callback(400, {'Error': 'Invalid or not informed token'});
  }
};
// Tattoo - get
// Required: none
// Optional query string parameters: name
lib._tattoo.get = function(data, callback){
  // Check if name was informed
  var name = typeof(data.queryStringObject.name) == 'string' ? data.queryStringObject.name : false;
    if(name){
      _data.read('tattoos', name, function(err, data){
        if(!err && data){
          callback(200, data);
        }else{
          callback(404, {'Error' : 'No tattoo were found with the given name'});
        }
      });
    }else{
    _data.read('tattoos', false, function(err, data){
      console.log('data:'+ data)
      console.log('error:'+ err)
      if(!err && data){
        console.log(data)
        callback(200, data);
      }else{
        callback(404, {'Error' : 'No tattoos were found in this collection'});
      }
    });
  }
};
// Tattoo - put
// Required fields: name and a optional field
// Optional fields: name, price
lib._tattoo.put = function(data, callback){
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
            _data.read('tattoos', name, function(err, tattooData){
              if(!err && data){
                // Update fields as provided
                if(name){
                  tattooData.name = name;
                }
                if(price){
                  tattooData.price = price;
                }
                _data.update('tattoos', name, tattooData, function(err){
                  if(!err){
                    callback(200, tattooData);
                  }else{
                    callback(500, {'Error': 'Could not update the tattoo, something wrong occurred'});
                  }
                });
              }else{
                callback(404, {'Error': 'Could not find specified tattoo to update it'});
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
// Tattoo - delete
// Required fields: name
lib._tattoo.delete = function(data, callback){
  // Verify token
  var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
  tokenHandlers._token.verifyToken(token,false,function(tokenIsValid){
    if(tokenIsValid){
      // Parse payload
      var parsedPayload = JSON.parse(data.payload);
      // Verify if the name informed does exist
      var name = typeof(parsedPayload.name) == 'string' ? parsedPayload.name : false;

      if(name){
        _data.delete('tattoos', name, function(err){
          if(!err){
            callback(200, 'Deleted successfully');
          }else{
            callback(500, {'Error' : 'Tattoo could not be deleted'});
          }
        });
      }else{
        callback(400, {'Error' : 'Tattoo not found'});
      }
    }else{
      callback(400, {'Error' : 'Invalid token'});
    }
  });
};

module.exports = lib;
