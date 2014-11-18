/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require("fs");
var exports = module.exports = {};

var serverPath = __dirname.split("/");
serverPath.pop();
var clientPath = serverPath.join("/");

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var currentId = 3;

var storage = {
};

storage.results = [{"username":"doug","text":"i like hack reactor soooo much!","roomname":"lobby","objectId":"0"},
{"username":"jon","text":"i ate an orange","roomname":"house","objectId":"1"},
{"username":"charlie","text":"im awesome!!!","roomname":"hr floor 8","objectId":"2"}];

var router = {
  messages: {
    GET: getMessages,
    POST: postMessages
  },
  users: {
    GET: getUsers
  }
  // rooms:
};

function getMessages(request, response){
  //response.write();
  //console.log(response.write());
  // response.write(messages);
  //response[LOL] = storage;
  response.end(JSON.stringify(storage));
  console.log("hi");
};

function postMessages(request, response){
  request.on('data', function(datum) {
    var tempDatum = JSON.parse(datum);
    tempDatum["objectId"] = currentId;
    currentId++;
    storage.results.push(tempDatum);
  })
  //console.log(request);
  // console.log(request.method);
  // console.log("postMessages");
  response.end("ended post messages");
};

function getUsers(request, response){
  // console.log(request.method);
  // console.log("hello to users");
  response.end("this is users")
};

var requestHandler = function(request, response) {
  var url = request.url.split("/")[1];
  // console.log(url);

  // console.log(router[url]);
  // console.log(request.method);
  // console.log(router[url][request.method]);
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);
  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // response.write();
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  if(request.url === "/"){
    headers['Content-Type'] = "text/html";
    console.log("i got in 1!")
    var html = fs.readFileSync(clientPath + "/client/index.html");
    response.write(html);
    response.end();
  } else if (router[url]) {
    if (request.method !== "OPTIONS") {
      headers['Content-Type'] = "application/JSON";
      router[url][request.method](request, response);
    }
    // console.log(request.method);
    // console.log(url);
      // console.log(router[url]);
  } else if (request.url === "/?username=jon"){

  }else{
    headers['Content-Type'] = "text/html";
    console.log("i got in 3!")
    console.log(request.url)
    var html = fs.readFileSync(clientPath + "/client" + request.url);
    response.end(html);
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

exports.requestHandler = requestHandler;
