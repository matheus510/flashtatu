//
// Phonecalls/Telephony handlers file (using Teravoz API)
//

// Dependencies
const fs = require('fs');
const http = require('http');
const io = require('socket.io')(http);
const helpers = require('../helpers');
const _data = require('../data');
const tokenHandlers = require('../handlers/token.handlers');

// Create object to export to handlers
let lib = {};

// Create wrapper for all telephony methods
lib = function(data,callback){
  // List sub-routes here (webhooks and events)
  const subroutes = ['webhooks', 'events'];
  const acceptableMethods = ['get', 'post'];

  if(subroutes.indexOf(data.trimmedArrayPath[1]) > -1 && acceptableMethods.indexOf(data.method) > -1){
    // It exists and methods is allowed
    typeof(lib._phone[data.trimmedArrayPath[1]][data.method]) == 'function' ? lib._phone[data.trimmedArrayPath[1]][data.method](data, callback) : callback(404);
  } else {
    callback(405);
  }

};

// Container for all telephony methods
lib._phone = {};
lib._phone.events = {};
lib._phone.webhooks = {};

lib._phone.events.get = function(data, callback) {
  console.info(__dirname);
  fs.readFile(__dirname+'/../../webhook.html', function (err, content) {
    if(!err) {
      // Return HTML content
      callback(200, content, true);
    } else {
      console.log(err);
      callback(500);
    }
  });
};

lib._phone.webhooks.post = function(data, callback){
  const event = data.payload;
  const parsedEvent = JSON.parse(event);
  console.info('Reiceived event', event);
  if(parsedEvent.type === 'call.standby') {
    // Check if this user is already registered with the same phone
    _data.read('customers', parsedEvent.their_number, function(err, data){
      if(err){
        // Create object to persist in data files
        var newCustomer = {
          'phone': parsedEvent.their_number,
          'lastCall': parsedEvent.timestamp,
        };
        // Persist new user
        _data.create('customers', newCustomer.phone, newCustomer, function(err){
          if(!err){
            console.log('Customer created successfully');

            // Redirect customer to 900
            // Create payload to send to /actions (POST)
            var delegatePayload = {
              'type': 'delegate',
              'call_id': parsedEvent.call_id,
              'destination': '*2900'
            };
            
            let requestOptions = {
              'host': 'https://api.teravoz.com.br/',
              'method': 'POST',
              'body': delegatePayload,
              'headers': {
                'Authorization': 'Basic <usuario:senha>base64'
              }
            };
            // "Send" request and receive standard message {'status' : 'ok'}
            function fakeRequest(requestOptions) {
              console.log('Request done: ', delegatePayload)
            }
            fakeRequest();
            console.log('Call delegated successfully');
          }else{
            console.log('Could not create new customer');
          }
        });
      }else{
        console.log('Customer already exist');
        // Redirect customer to 900
        // Create payload to send to /actions (POST)
        var delegatePayload = {
          'type': 'delegate'
          'call_id': parsedEvent.call_id,
          'destination': '*2901'
        };
        
        let requestOptions = {
          'host': 'https://api.teravoz.com.br/',
          'method': 'POST',
          'headers': {
            'Authorization': 'Basic <usuario:senha>base64'
          }
        };
        // "Send" request and receive standard message {'status' : 'ok'}
        function fakeRequest(requestOptions) {
          console.log('Request done: ', delegatePayload)
        }
        fakeRequest();
        console.log('Call delegated successfully');
        io.emit('teravoz-event', parsedEvent);
      }
    });
  }
  // Response is always 'ok', as all operations are async
  callback(200, {'status': 'ok'});
}

module.exports = lib;
