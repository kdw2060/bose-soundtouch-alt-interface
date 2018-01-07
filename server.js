//some basic stuff
var express = require('express');
var bodyparser = require('body-parser');
var app = express();
app.use(express.static('client'));
var codein = require("node-codein");

//array of my speakers
var speakers = [];

//discover speakers and push their basic data to array
function speakerDiscovery(){
    var bonjour = require('bonjour')()
    bonjour.find({ type: 'soundtouch' }, function (service) {
        console.log(service);
        var myObj = {
            "name" : service.name,
            "ip" : service.referer.address,
            "mac" : service.txt.mac
        };
//        speakers.push(myObj);
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
    console.log(speakers);
}

//repeat every minute in case new speakers are added or their ip changes
setInterval(speakerDiscovery, 60000);

//send speaker-array to client
app.get('/api/devices', function (req, res) {
  res.status(200).json(speakers);
});

app.listen(3001);