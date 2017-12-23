//some basic stuff
var express = require('express');
var bodyparser = require('body-parser');
var app = express();
app.use(express.static('client'));

//array of my speakers
var speakers = [
    {"name":"SoundTouch 10Keuken",
    "ip":""},
    {"name":"SoundTouch10Badkamer",
    "ip":""},
    {"name":"SoundTouch10Marieke",
    "ip":""},
    {"name":"SoundTouch10Kris",
    "ip":""}
];

//discover ip adresses of my speakers
var bonjour = require('bonjour')()
bonjour.find({ type: 'soundtouch' }, function (service) {
//    console.log(service);
    if (service.name == 'SoundTouch 10Keuken') {
        speakers[0].ip = service.referer.address;
    }
    if (service.name == 'SoundTouch10Badkamer') {
        speakers[1].ip = service.referer.address;
    }
    if (service.name == 'SoundTouch10Marieke') {
        speakers[2].ip = service.referer.address;
    }
    if (service.name == 'SoundTouch10Kris') {
        speakers[3].ip = service.referer.address;
    }
})

//send ip-adresses to client
app.get('/api/devices', function (req, res) {
  res.status(200).json(speakers);
});


app.listen(3000);