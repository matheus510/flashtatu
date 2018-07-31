//
// HELPERS File
//

// Dependencies
var crypto = require('crypto');
var config = require('./config');
var fs = require('fs');

// Create a container for all helpers
var helpers = {};

helpers.scaffolding = function(){
  // List needed folders for app to run
  var neededFolders = ['.data/', '.data/customers/', '.data/products/', '.data/tokens/', '.data/users/']
  neededFolders.forEach(function(folder){
    // Check if directory exists
    fs.readdir(folder, 'utf8', function(err, files){
      if(err){
        // Create if directory do not exist
        fs.mkdir(folder, function(err){
          if(!err){
            console.log(folder+' folder created');
          }else{
            // Console error
            console.log(err, {'Error' : 'Could not create essencial folder'})    
            console.log('Second try')
            fs.mkdir(folder, function(err){
              if(!err){
                console.log(folder+'created successfully (on second try)')
              }else{
                console.warn({'Error' : 'Essential folder could not be created, please restar the app'})
              }
            })    
          }
        });
      }else{
        console.log('Folder already exists')
      }
    })
  })
}


helpers.validateEmail = function(str){
  var emailValidationExp = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailValidationExp.test(String(str).toLowerCase());
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  }else{
    return false;
  }
};
// Create random strings
helpers.createRandomString = function(length){
  if(length){
    // Initialize the string
    var str = '';
    // Set the characters
    var allowedCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++){
      str+=allowedCharacters.charAt(Math.floor(Math.random() * allowedCharacters.length));
    }
    return str;
  }else{
    return false;
  }
};

module.exports = helpers;
