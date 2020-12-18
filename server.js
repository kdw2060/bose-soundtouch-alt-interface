//some basic stuff
const express = require("express");
const rp = require("request-promise");
const parseString = require("xml2js").parseString;
const xml2js = require("xml2js");
const multer = require("multer");
const upload = multer();
const fs = require("fs");
const http = require("http");
const https = require("https");
const privateKey = fs.readFileSync("localhost.key", "utf8");
const certificate = fs.readFileSync("localhost.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };

const app = express();
http.createServer(app).listen(3002);
https.createServer(credentials, app).listen(3001);
app.use(express.static("client"));

//If you don't use Hass.io set HassEnv to false
var HassEnv = false;

if (HassEnv === true) {
  var options = require("./options");
  app.set("options", options);
}
if (HassEnv === false) {
  var options = require("./client/js/options.json");
}

// Globals
let speakers = [];
let channelName;
let currentVolume;
let source;
let ContentItem;

// get Device ip for later in Intercom function
let deviceIP;
var os = require("os");
// console.log(os.networkInterfaces());
if (os.networkInterfaces().eth0) {
  deviceIP = os.networkInterfaces().eth0[0].address;
}
if (os.networkInterfaces()["Wi-Fi"]) {
  let wifi = os.networkInterfaces()["Wi-Fi"].length;
  deviceIP = os.networkInterfaces()["Wi-Fi"][wifi - 1].address;
} 
if (os.networkInterfaces().enp3s0) {deviceIP = os.networkInterfaces().enp3s0[0].address;
} 
if (os.networkInterfaces().enp6s0) {deviceIP = os.networkInterfaces().enp6s0[0].address;
}
if (os.networkInterfaces().Ethernet) {
  let ethernet = os.networkInterfaces().Ethernet.length;
  deviceIP = os.networkInterfaces().Ethernet[ethernet - 1].address;
}
console.log(deviceIP);

//discover speakers and push their basic data to array
var counter = 0;
function speakerDiscovery() {
  var bonjour = require("bonjour")();
  bonjour.find({ type: "soundtouch" }, function(service) {
    var myObj = {
      name: service.name,
      ip: service.referer.address,
      mac: service.txt.mac
    };
    //fill or update array only when necessary
    var objIndex = speakers.findIndex(x => x.name == myObj.name);
    if (objIndex === -1) {
      speakers.push(myObj);
      console.log("new speaker added");
    }
    if (objIndex !== -1) {
      if (speakers[objIndex].ip != myObj.ip) {
        speakers[objIndex].ip = myObj.ip;
        console.log("existing speaker ip updated");
      }
    }
  });
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
app.get("/api/devices", function(req, res) {
  res.status(200).json(speakers);
});

// make user's options available to client
app.get("/api/options", function(req, res) {
  res.status(200).json(options);
});

// interface Action functions (had to be moved to backend because of new Cors restriction in Soundtouch API)
const APIkey = ""; //enter your app API key from developer.bose.com

app.get("/api/getInfo", function(req, res, next) {
  let selectedSpeakerIP = req.query.ip;
  let speakerInfo = [];
  let baseURL = "http://" + selectedSpeakerIP + ":8090";
  let getURL = baseURL + "/now_playing";
  let getURL2 = baseURL + "/volume";

  rp(getURL)
    .then(function(body) {
      parseString(body, function(err, result) {
        source = result.nowPlaying.$.source;
        speakerInfo.push(source);
        if (source === "STANDBY") {
          channelName = "Speaker OFF";
          speakerInfo.push(channelName);
        } else if (source === "RADIOPLAYER" || source === "TUNEIN") {
          channelName = result.nowPlaying.ContentItem[0].itemName[0];
          ContentItem = result.nowPlaying.ContentItem[0];
          var builder = new xml2js.Builder();
          let obj = { ContentItem };
          ContentItem = builder.buildObject(obj);
          ContentItem = ContentItem.slice(56);
          //console.log(ContentItem);
          speakerInfo.push(channelName);
        }
      });
    })
    .then(function() {
      rp(getURL2)
        .then(function(body) {
          parseString(body, function(err, result) {
            currentVolume = result.volume.actualvolume[0];
            speakerInfo.push(currentVolume);
            //console.log(speakerInfo);
          });
        })
        .then(function() {
          res.status(200).json(speakerInfo);
        });
    })
    .catch(function(err) {
      console.log("error: " + err);
      //console.log(speakerInfo);
      res.status(500).json(speakerInfo);
    });
});

app.post("/api/switchOnOff", function(req, res, next) {
  let selectedSpeakerIP = req.query.ip;
  var postData = "<key state='press' sender='Gabbo'>POWER</key>";
  var postData2 = "<key state='release' sender='Gabbo'>POWER</key>";
  var options = {
    method: "POST",
    uri: "http://" + selectedSpeakerIP + ":8090/key",
    body: postData
  };
  var options2 = {
    method: "POST",
    uri: "http://" + selectedSpeakerIP + ":8090/key",
    body: postData2
  };
  rp(options)
    .then(function(body) {
      console.log("powerbutton press fired");
    })
    .then(function(body) {
      rp(options2).then(function(body) {
        console.log("powerbutton release fired");
        res.sendStatus(200);
      });
    })
    .catch(function(err) {
      console.log("error: " + err);
    });
});

app.post("/api/setVolume", function(req, res, next) {
  let selectedSpeakerIP = req.query.ip;
  let selectedSpeakerVolume = req.query.vol;
  var postData = "<volume>" + selectedSpeakerVolume + "</volume>";
  var options = {
    method: "POST",
    uri: "http://" + selectedSpeakerIP + ":8090/volume",
    body: postData
  };
  rp(options)
    .then(function(body) {
      console.log("setVolume function fired");
      res.sendStatus(200);
    })
    .catch(function(err) {
      console.log("error: " + err);
    });
});

app.post("/api/setChannel", function(req, res, next) {
  let selectedSpeakerIP = req.query.ip;
  let favourite = req.query.fav;
  if (HassEnv === false) {
    var options = require("./client/js/options.json");
  } else {
    var options = app.options;
  }
  let postData = options.radioFavourites[favourite].payload;
  var options = {
    method: "POST",
    uri: "http://" + selectedSpeakerIP + ":8090/select",
    body: postData
  };
  rp(options)
    .then(function(body) {
      console.log("setChannel function fired");
      function ok() {
        res.sendStatus(200);
      }
      setTimeout(ok, 800);
    })
    .catch(function(err) {
      console.log("error: " + err);
    });
});

app.post("/api/sendMessage", function(req, res, next) {
  let selectedSpeakerIP = req.query.ip;
  let message = req.query.url;
  if (message === "recording") {
    message = "http://" + deviceIP + ":3002/upload/message.mp3";
  }
  var postData =
    "<play_info><app_key>" +
    APIkey +
    "</app_key><url>" +
    message +
    "</url><service>Intercom</service><volume>45</volume></play_info>";
  var options = {
    method: "POST",
    uri: "http://" + selectedSpeakerIP + ":8090/speaker",
    body: postData
  };
  rp(options)
    .then(function(body) {
      console.log("Intercom Message sent");
      res.sendStatus(200);
    })
    .catch(function(err) {
      console.log("error: " + err);
    });
});

app.post("/api/setFavourite", function(req, res, next) {
  let newFav = {
    favID: options.radioFavourites.length,
    channelName: channelName,
    payload: ContentItem
  };
  options.radioFavourites.push(newFav);
  let optionsString = JSON.stringify(options);
  fs.writeFile("./client/js/options.json", optionsString, "utf-8", err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Options file has been updated");
    res.sendStatus(200);
  });
});

app.post("/api/unsetFavourite", function(req, res, next) {
  let id = req.query.favId;
  console.log(id);
  options.radioFavourites.splice(id, 1);
  for (i = 0; i < options.radioFavourites.length; i++) {
    if (options.radioFavourites[i].favID > id) {
      options.radioFavourites[i].favID = options.radioFavourites[i].favID - 1;
    }
  }
  let optionsString = JSON.stringify(options);
  fs.writeFile("./client/js/options.json", optionsString, "utf-8", err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Options file has been updated");
    res.sendStatus(200);
  });
});

//upload route for sound recording
app.post("/api/upload", upload.single("soundBlob"), function(req, res, next) {
  let uploadLocation = __dirname + "/client/upload/" + req.file.originalname;
  fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer)));
  res.sendStatus(200);
});
