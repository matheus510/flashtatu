//
// INDEX - Initial file for FlashTatuAPI
// Author: Matheus de Sousa Monteiro Fonseca (https://github.com/matheus510)
//

// Dependencies
const http = require('http');
const https = require('https');
const config = require('./lib/config');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./lib/handlers');

const httpsServer = https.createServer(function(req, res){
  internalServer(req, res);
});
const httpServer = http.createServer(function(req, res){
  internalServer(req, res);
});
const internalServer = function(req, res){

  // Parse received url
  const parsedUrl = url.parse(req.url,true);

  // Obtain path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const arrayPath = path.match(/\/([a-zA-Z?%0-9=])+/g);
  const trimmedArrayPath = arrayPath.map(function(specifiedPath) {
    return specifiedPath.replace(/^\/+|\/+$/g, '');
  })

  // Get the query string as an object
  const queryStringObj = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload,if any
  const decoder = new StringDecoder('utf-8');
  var buffer = '';

  req.on('data', function(data){
    buffer += decoder.write(data);
  });

  // Check for a matching path for the handler
  req.on('end', function(){
    buffer += decoder.end();

    // Construct the data object to send to the handler
    const data = {
      'trimmedPath' : trimmedPath,
      'trimmedArrayPath': trimmedArrayPath,
      'queryStringObject' : queryStringObj,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    let chosenHandler;
    // Determine handler to be used
    // Check if route is a single path or multi-path
    if(typeof(trimmedArrayPath) == 'object' && trimmedArrayPath.length > 1) {
      // Maximum amount of subroutes is one. More than that it will return 404.
      chosenHandler = typeof(router[trimmedArrayPath[0]] !== 'undefined') && trimmedArrayPath.length <= 2 ? router[trimmedArrayPath[0]] : handlers.notFound;
    } else {
      chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    }

    chosenHandler(data, function(statusCode, payload, isPage){

      if(isPage){
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(statusCode);
        res.end(payload);
        console.log("Returning this response: ",statusCode,payload);  
      }else{
        // Convert the payload to a string
        const payloadString = JSON.stringify(payload);

        // Return the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log("Returning this response: ",statusCode,payloadString);
      }
    });
  });
};

httpServer.listen(config.httpPort, function(){
  console.log('\x1b[42m%s\x1b[0m','listening at port: '+ config.httpPort);
});
httpsServer.listen(config.httpsPort, function(){
  console.log('\x1b[42m%s\x1b[0m','listening at port: '+ config.httpsPort);
});

// Define the request router
const router = {
  'ping' : handlers.ping,
  'user' : handlers.user,
  'token' : handlers.token,
  'product' : handlers.product,
  'cart' : handlers.cart,
  'phone': handlers.phone
};
