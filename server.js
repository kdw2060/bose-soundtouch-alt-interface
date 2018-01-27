//some basic stuff
var express = require('express');
var bodyparser = require('body-parser');
var app = express();
app.use(express.static('client'));

//If you don't use Hass.io set HassEnv to false
var HassEnv = true;

if (HassEnv === true) {
    var options = require('./options');
    app.set('options', options);
}
if (HassEnv === false) {
    var options = require('./client/js/options.json');
}

//array of my speakers
var speakers = [];

//discover speakers and push their basic data to array
var counter = 0;
function speakerDiscovery(){
    var bonjour = require('bonjour')()
    bonjour.find({ type: 'soundtouch' }, function (service) {
        var myObj = {
            "name" : service.name,
            "ip" : service.referer.address,
            "mac" : service.txt.mac
        };
        //fill or update array only when necessary    
        var objIndex = speakers.findIndex(x => x.name == myObj.name);
        if (objIndex === -1 ){speakers.push(myObj); console.log('new speaker added');}
        if (objIndex !== -1) {
            if (speakers[objIndex].ip != myObj.ip){
                speakers[objIndex].ip = myObj.ip;
                console.log('existing speaker ip updated');
            }
        }
    })
    //initially run bonjour find function every 5 seconds
    if (counter < 10) {
        setTimeout(speakerDiscovery, 5000);
        counter++;
    }
    //after that repeat every 15 minutes in case new speakers are added or their ip changes
    if (counter === 10) {
        setInterval(speakerDiscovery, 900000);
        counter++;
    }
}
speakerDiscovery();

//make speaker-array available to client
app.get('/api/devices', function (req, res) {
  res.status(200).json(speakers);
});

// make user's options available to client
app.get('/api/options', function (req, res) {
  res.status(200).json(options);
});

app.listen(3001);