var express = require('express')
var app = express()
var storage = {
};
var currentId = 2;

storage.results = [{"username":"doug","text":"i like hack reactor soooo much!","roomname":"lobby","objectId":"0"},
{"username":"jon","text":"i ate an orange","roomname":"house","objectId":"1"},
{"username":"charlie","text":"im awesome!!! I'm livin the dream.","roomname":"hr floor 8","objectId":"2"}];

var cors = require('cors')

app.use(cors());

app.get('/', function (req, res) {
  res.sendFile( __dirname +'/client/index.html')
})

app.get('/messages', function(req, res){
  res.send(JSON.stringify(storage));
})

app.post('/messages', function(req, res){
  console.log(1,req)
  req.on('data', function(chunk) {
    var tempChunk = JSON.parse(chunk);
    tempChunk["objectId"] = currentId;
    currentId++;
    storage.results.push(tempChunk);
  })
})


var server = app.listen(3000, "127.0.0.1");
