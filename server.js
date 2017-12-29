//some basic stuff
var express = require('express');
var bodyparser = require('body-parser');
var app = express();
app.use(express.static('client'));

//array of my speakers
var speakers = [];

//discover speakers and push their basic data to array
var bonjour = require('bonjour')()
bonjour.find({ type: 'soundtouch' }, function (service) {
    console.log(service);    
    var myObj = {
        "name" : service.name,
        "ip" : service.referer.address,
        "mac" : service.txt.mac
    };
    speakers.push(myObj);
})

//to do: make function to refresh array every x minutes

//send speaker-array to client
app.get('/api/devices', function (req, res) {
  res.status(200).json(speakers);
});

app.listen(3001);