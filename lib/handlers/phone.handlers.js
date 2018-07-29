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
const TERAVOZ_CREDENTIALS = require('../../credentials/teravoz.credentials');

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
    if (err) {
      console.log(err);
      console.log(content)
      callback(500);
    } else {
      // Return HTML content
      callback(200, content, true);
    }
  });
};

lib._phone.webhooks.post = function(data, callback){
  const event = data.payload;
  console.info('Recebeu o evento', event);
  io.emit(`teravoz-event`, require('util').inspect(event));
  // Response is always "ok", as all operations are async
  callback(200, {'status': 'ok'});
}

module.exports = lib;
