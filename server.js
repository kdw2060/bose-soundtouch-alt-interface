//some basic stuff
var express = require('express');
var bodyparser = require('body-parser');
var app = express();
app.use(express.static('client'));

//array of my speakers
var speakers = [];

//discover speakers and push their basic data to array
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
}

//repeat every minute in case new speakers are added or their ip changes
setInterval(speakerDiscovery, 60000);

//make speaker-array available to client
app.get('/api/devices', function (req, res) {
  res.status(200).json(speakers);
});

app.listen(3001);