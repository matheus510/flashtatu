//
// File for mocking API HTTP Requests, for /phone/webhooks (Teravoz api)
//

// Dependencies
var http = require('http');


// Mocks for calls 

// First, call.standby
var newCallEvent = {
  "type": "call.standby",
  "call_id": "1463669263.30033",
  "code": "123456",
  "direction": "inbound",
  "our_number": "0800000000",
  "their_number": "11991910000",
  "timestamp": "2017-01-01T00:00:00Z"
}

let requestOptions = {
  'host': 'localhost',
  'port': '5000',
  'path': '/phone/webhooks',
  'method': 'POST',
  'headers': {
    'Authorization': 'Basic <usuario:senha>base64'
  }
};

var req = http.request(requestOptions, function(res){
  console.log('foi')
  res.on('end', () => {
    console.log('End test request');
  });
})

req.write(JSON.stringify(newCallEvent));
req.end();
