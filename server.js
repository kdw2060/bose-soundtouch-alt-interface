//some basic stuff
const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');
const rp = require('request-promise');
const parseString = require('xml2js').parseString;
const multer = require('multer');
const upload = multer();
const fs = require('fs');
const app = express();
app.use(express.static('client'));

//If you don't use Hass.io set HassEnv to false
var HassEnv = false;

if (HassEnv === true) {
    var options = require('./options');
    app.set('options', options);
}
if (HassEnv === false) {
    var options = require('./client/js/options.json');
}

// get Device ip for later in Intercom function
let deviceIP;
var os = require('os');
if (os.networkInterfaces().eth0) {
    deviceIP = os.networkInterfaces().eth0[0].address;
}
else {
    let ethernet = os.networkInterfaces().Ethernet.length;
    deviceIP = os.networkInterfaces().Ethernet[ethernet - 1].address;
}
console.log(deviceIP);

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


// interface Action functions (had to be moved to backend because of new Cors restriction in Soundtouch API)
const APIkey = ''; //enter your app API key from developer.bose.com

app.get('/api/getInfo', function (req, res, next) {
        let selectedSpeakerIP = req.query.ip;
        let speakerInfo = [];
        let channelName;
        let currentVolume;
        let source;
        let baseURL = "http://" + selectedSpeakerIP + ":8090";
        let getURL = baseURL + "/now_playing";
        let getURL2 = baseURL + "/volume";
        
        rp(getURL)
            .then(function(body){
                parseString(body, function(err, result){
                    let parsedXml = JSON.stringify(result);
                    let json = JSON.parse(parsedXml);
                    source = json.nowPlaying.$.source;
                    speakerInfo.push(source);
                    if (source === 'STANDBY') {
                        channelName = "Speaker OFF";
                    }
                    else if (source === 'RADIOPLAYER' || source === 'TUNEIN' ){
                        channelName = json.nowPlaying.ContentItem[0].itemName[0];
                    }
                    speakerInfo.push(channelName);
                    //console.log('info1: ' + speakerInfo);
                    })
                })
            .then(function(){
                rp(getURL2)
                    .then(function(body){
                        parseString(body, function(err, result){
                        let parsedXml = JSON.stringify(result);
                        let json = JSON.parse(parsedXml);
                        currentVolume = json.volume.actualvolume[0];
                        speakerInfo.push(currentVolume);   
                        //console.log('info2: ' + speakerInfo);
                        })
                    })
                    .then(function(){ 
                        res.status(200).json(speakerInfo);
                    })
            })
            .catch(function (err){
                console.log('error: ' + err);
                console.log('info3: ' + speakerInfo);
                res.status(500).json(speakerInfo);
            });   
});

app.post('/api/switchOnOff', function (req, res, next){
    let selectedSpeakerIP = req.query.ip;
    var postData = "<key state='press' sender='Gabbo'>POWER</key>";
    var postData2 = "<key state='release' sender='Gabbo'>POWER</key>";
    var options = {
        method: 'POST',
        uri: "http://" + selectedSpeakerIP + ":8090/key",
        body: postData
    };
    var options2 = {
        method: 'POST',
        uri: "http://" + selectedSpeakerIP + ":8090/key",
        body: postData2
    };
    rp(options)
     .then(function(body) {
        console.log('powerbutton press fired');
    })
     .then(function(body) {
        rp(options2)
        .then(function(body) {
            console.log('powerbutton release fired');
            res.sendStatus(200);
        });
    })
     .catch(function (err){
        console.log('error: ' + err);
    });   
})

app.post('/api/setVolume', function (req, res, next){
    let selectedSpeakerIP = req.query.ip;
    let selectedSpeakerVolume = req.query.vol;
    var postData = "<volume>" + selectedSpeakerVolume + "</volume>";
    var options = {
        method: 'POST',
        uri: "http://" + selectedSpeakerIP + ":8090/volume",
        body: postData
    };
    rp(options)
     .then(function(body) {
        console.log('setVolume function fired');
        res.sendStatus(200);
    })
     .catch(function (err){
        console.log('error: ' + err);
    });   
})


app.post('/api/setChannel', function (req, res, next){
    let selectedSpeakerIP = req.query.ip;
    let favourite = req.query.fav;
    if (HassEnv === false) {
    var options = require('./client/js/options.json');
    }
    else {var options = app.options;}
    let postData = options.radioFavourites[favourite].payload;
    var options = {
        method: 'POST',
        uri: "http://" + selectedSpeakerIP + ":8090/select",
        body: postData
    };
    rp(options)
     .then(function(body) {
        console.log('setChannel function fired');
        res.sendStatus(200);
    })
     .catch(function (err){
        console.log('error: ' + err);
    });   
})


app.post('/api/sendMessage', function (req, res, next){
    let selectedSpeakerIP = req.query.ip;
    let message = req.query.url;
    if (message === 'recording') { message = "http://" + deviceIP + ":3001/upload/message.mp3"; }
    var postData = "<play_info><app_key>" + APIkey + "</app_key><url>" + message + "</url><service>Intercom</service><volume>45</volume></play_info>";
    var options = {
        method: 'POST',
        uri: "http://" + selectedSpeakerIP + ":8090/speaker",
        body: postData
    };
    rp(options)
     .then(function(body) {
        console.log('Intercom Message sent');
        res.sendStatus(200);
    })
     .catch(function (err){
        console.log('error: ' + err);
    });   
})

//upload route for sound recording
app.post('/api/upload', upload.single('soundBlob'), function (req, res, next){
    let uploadLocation = __dirname + '/client/upload/' + req.file.originalname;
    fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer)));
    res.sendStatus(200);
})

app.listen(3001);