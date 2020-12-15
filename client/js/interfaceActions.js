function setSpeaker(speaker, el){
    selectedSpeaker = speaker;
    localStorage.setItem('lastSelectedSpeaker', speaker);
    $(".is-active").removeClass('is-active');
    $(el).parent('li').addClass('is-active');
    setSelectedSpeakerIP();
    getInfo();
}

function setSelectedSpeakerIP() {
    for (i=0; i<speakers.length; i++) {
            if (speakers[i].name == selectedSpeaker) { 
                selectedSpeakerIP = speakers[i].ip;
            }
        }
}

function showAllChannels() {
    $('.channelList').removeClass('channelList');
    $('.channelList').toggleClass('channelList-all');
}


$(document).ready(function() {
const recordbutton = document.getElementById('record-btn');
const sendbutton = document.getElementById('sendButton');
    const recorder = new MicRecorder({
      bitRate: 128
    });

    recordbutton.addEventListener('click', startRecording);

    function startRecording() {
      recorder.start().then(() => {
        recordbutton.textContent = 'Stop recording';
        recordbutton.classList.toggle('is-danger');
        recordbutton.removeEventListener('click', startRecording);
        sendbutton.setAttribute("disabled", "true");
        recordbutton.addEventListener('click', stopRecording);
      }).catch((e) => {
        console.error(e);
      });
    }

    function stopRecording() {
      recorder.stop().getMp3().then(([buffer, blob]) => {
        //console.log(buffer, blob);
        const file = new File(buffer, 'message.mp3', {
          type: blob.type,
          lastModified: Date.now()
        });
        //console.log(file);
        //let soundBlob = file.getBlob();
        //console.log(soundBlob);
        let formdata = new FormData();
          formdata.append('soundBlob', file, 'message.mp3');
          uploadMessage(formdata);

        recordbutton.textContent = 'Start recording';
        recordbutton.classList.toggle('is-danger');
        recordbutton.removeEventListener('click', stopRecording);
        sendbutton.removeAttribute("disabled");
        recordbutton.addEventListener('click', startRecording);          
      }).catch((e) => {
        console.error(e);
      });
    }
});

//Functions that use the Bose-API (had to be changed to go via the backend because of Cors-hell introduced by Bose)
var currentVolume;

function getInfo() {
    var hostname = window.location.hostname;
    $('#favButton').removeClass('mdi-heart');
    $('#favButton').addClass('mdi-heart-outline');
    $.getJSON(protocol + "//" + hostname + ":" + port + "/api/getInfo?ip=" + selectedSpeakerIP, function(data) {
      // console.log(data);
        selectedSpeakerSource = data[0];
        $('.currentVolume').show();
        $(".slider").show();
        $('.volmin').show();
        $('.volplus').show();
        $(".currentSpeaker").html('Selected speaker: <span class="selectedSpeaker">' + selectedSpeaker + '</span>');
        if (data.length == 3) {channelName = data[1];}
        if (data.length == 2) {channelName = data[0];}
        $('.currentChannel').html('Now playing: <span class="nowPlaying tag is-info">' + channelName + '</span>');
        if (selectedSpeakerSource !== 'STANDBY') {
          for (var i = 0; i < options.radioFavourites.length; i++){
            if (options.radioFavourites[i].channelName === channelName) {
              $('#favButton').removeClass('mdi-heart-outline');
              $('#favButton').addClass('mdi-heart');
            }
         }          
        if (data.length == 3) {currentVolume = data[2];}
        if (data.length == 2) {currentVolume = data[1];} 
          $('.currentVolume').html('Volume: <span class="nowPlaying">' + currentVolume + '</span>');
          $(".slider").val(currentVolume);
          $('#powerButton').html("<span class='icon has-text-danger'><i class='mdi mdi-power'></i></span>&nbsp;OFF");
        }
        else {
          $('.currentVolume').hide();
          $(".slider").hide();
          $('.volmin').hide();
          $('.volplus').hide();
          $('#powerButton').html("<span class='icon has-text-danger'><i class='mdi mdi-power'></i></span>&nbsp;ON");
        }
    })
    .catch(function (jqXHR, textStatus, errorThrown){
        console.log( jqXHR.status + ': ' + textStatus + ': ' + errorThrown);
        if (jqXHR.status === 500) {
          $(".currentSpeaker").html('Selected speaker: <span class="selectedSpeaker">' + selectedSpeaker + '</span>');
        channelName = "ERROR connecting to speaker";
          $('.currentChannel').html('<span class="nowPlaying tag is-danger">' + channelName + '</span>');
          $('.currentVolume').hide();
          $(".slider").hide();
          $('.volmin').hide();
          $('.volplus').hide();
        }
        
    })
}

function powerButton() {
  var hostname = window.location.hostname;
  $.ajax({
      url: protocol + "//" + hostname + ":" + port + "/api/switchOnOff?ip=" + selectedSpeakerIP,
      type: 'POST',
      crossDomain: true,
      success: function(result){
        //console.log('powerButton function fired');
        setTimeout(getInfo, 500);
      },
      error: function(jqXHR, transStatus, errorThrown) {
        alert('Status: ' + jqXHR.status + '=' + jqXHR.statusText + '.' + 'Response: ' + jqXHR.responseText);
      }
    });
}


function setVolume(val) {
    var hostname = window.location.hostname;
    $.ajax({
        url: protocol + "//" + hostname + ":" + port + "/api/setVolume?ip=" + selectedSpeakerIP + "&vol=" + val,
        type: 'POST',
        crossDomain: true,
        success: function(result){
          //console.log('setVolume function fired');
          setTimeout(getInfo, 500);
        },
        error: function(jqXHR, transStatus, errorThrown) {
          alert('Status: ' + jqXHR.status + '=' + jqXHR.statusText + '.' + 'Response: ' + jqXHR.responseText);
        }
      });
}

function volUp() {
  var volNow = parseInt(currentVolume);
  var newVol = volNow + 1;
  setVolume(newVol);
}

function volDown() {
  var volNow = parseInt(currentVolume);
  var newVol = volNow - 1;
  setVolume(newVol);
}


function setChannel(favorite) {
    var hostname = window.location.hostname;
    $.ajax({
        url: protocol + "//" + hostname + ":" + port + "/api/setChannel?ip=" + selectedSpeakerIP + "&fav=" + favorite,
        type: 'POST',
        crossDomain: true,
        success: function(result){
            //console.log('setChannel function fired');
            setTimeout(getInfo, 1750);
        },
        error: function(jqXHR, transStatus, errorThrown) {
          alert('Status: ' + jqXHR.status + '=' + jqXHR.statusText + '.' + 'Response: ' + jqXHR.responseText);
        }
    });
}


function sendIntercomMessage(url) {
    var hostname = window.location.hostname;
    $.ajax({
        url: protocol + "//" + hostname + ":" + port + "/api/sendMessage?ip=" + selectedSpeakerIP + "&url=" + url,
        type: 'POST',
        crossDomain: true,
        success: function(result){
          //console.log("Intercom function fired");
        },
        error: function(jqXHR, transStatus, errorThrown) {
          alert('Status: ' + jqXHR.status + '=' + jqXHR.statusText + '.' + 'Response: ' + jqXHR.responseText);
        }
    }); 
}

function setFavourite() {
  getInfo();
  let hostname = window.location.hostname;
  let unfaved = false;
  if (selectedSpeakerSource !== 'STANDBY') {
    for (var i = 0; i < options.radioFavourites.length; i++){
      if (options.radioFavourites[i].channelName === channelName) {
        // console.log('unset fav function started');
        unfaved = true;
        let favId = i;
        $.ajax({
          url: protocol + "//" + hostname + ":" + port + "/api/unsetFavourite?favId=" + favId,
          type: 'POST',
          crossDomain: true,
          success: function(result){
            // console.log("unsetfav fired");
            location.reload();
          },
          error: function(jqXHR, transStatus, errorThrown) {
            alert('Status: ' + jqXHR.status + '=' + jqXHR.statusText + '.' + 'Response: ' + jqXHR.responseText);
          }
        });
      }
    }
    if (unfaved === false ) {
      console.log('set fav function started');
      $.ajax({
        url: protocol + "//" + hostname + ":" + port + "/api/setFavourite",
        type: 'POST',
        crossDomain: true,
        success: function(result){
          console.log("setfav fired");
          location.reload();
        },
        error: function(jqXHR, transStatus, errorThrown) {
        alert('Status: ' + jqXHR.status + '=' + jqXHR.statusText + '.' + 'Response: ' + jqXHR.responseText);
        }
      }); 
    }
  }
}


// function to upload message.mp3
function uploadMessage(blob) {
    $.ajax({
        url: "/api/upload",
        type: 'POST',
        crossDomain: true,
        data: blob,
        contentType: false,
        processData: false,
        success: function(result){
          console.log('message soundfile uploaded');
        },
        error: function(jqXHR, transStatus, errorThrown) {
          alert('Status: ' + jqXHR.status + '=' + jqXHR.statusText + '.' + 'Response: ' + jqXHR.responseText);
        }
      });
}