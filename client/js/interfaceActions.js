function setSpeaker(speaker, el){
    selectedSpeaker = speaker;
    localStorage.setItem('lastSelectedSpeaker', speaker);
    $("article").removeClass('clicked');
    $(".menu-list li a").removeClass('clicked');
    $(el).toggleClass('clicked');
    setSelectedSpeakerIP();
    getInfo();
    $('#navMenu').toggleClass('is-active');
    burger.classList.toggle('is-active');
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


// message recorder
//window.onload = function(){
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

function getInfo() {
    var hostname = window.location.hostname;
    $.getJSON("https://" + hostname + ":3001/api/getInfo?ip=" + selectedSpeakerIP, function(data) {
        selectedSpeakerSource = data[0];
        $('.currentVolume').show();
        $(".slider").show();
        $(".currentSpeaker").html('Selected speaker: <span class="selectedSpeaker">' + selectedSpeaker + '</span>');
        var channelName = data[1];
        $('.currentChannel').html('Now playing: <span class="nowPlaying tag is-info">' + channelName + '</span>');
        if (selectedSpeakerSource !== 'STANDBY') {
          var currentVolume = data[2];
          $('.currentVolume').html('Volume: <span class="nowPlaying">' + currentVolume + '</span>');
          $(".slider").val(currentVolume);
          $('#powerButton').html("<span class='icon has-text-danger'><i class='mdi mdi-power'></i></span>&nbsp;OFF");
        }
        else {
          $('.currentVolume').hide();
          $(".slider").hide();
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
        }
        
    })
}

function powerButton() {
  var hostname = window.location.hostname;
  $.ajax({
      url: "https://" + hostname + ":3001/api/switchOnOff?ip=" + selectedSpeakerIP,
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
        url: "https://" + hostname + ":3001/api/setVolume?ip=" + selectedSpeakerIP + "&vol=" + val,
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


function setChannel(favorite) {
    var hostname = window.location.hostname;
    $.ajax({
        url: "https://" + hostname + ":3001/api/setChannel?ip=" + selectedSpeakerIP + "&fav=" + favorite,
        type: 'POST',
        crossDomain: true,
        success: function(result){
            //console.log('setChannel function fired');
            setTimeout(getInfo, 1000);
        },
        error: function(jqXHR, transStatus, errorThrown) {
          alert('Status: ' + jqXHR.status + '=' + jqXHR.statusText + '.' + 'Response: ' + jqXHR.responseText);
        }
    });
}


function sendIntercomMessage(url) {
    var hostname = window.location.hostname;
    $.ajax({
        url: "https://" + hostname + ":3001/api/sendMessage?ip=" + selectedSpeakerIP + "&url=" + url,
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
