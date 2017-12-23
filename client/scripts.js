//Some global variables
var speakers;
var selectedSpeaker = 'SoundTouch10Kris'; //todo: save last selected speaker as a variable in a cookie/localstorage/...
var selectedSpeakerIP;
var APIkey = '';  //enter your app API key from developer.bose.com
//List of intercom messages
var messages = [
    {"name":"dinner", 
    "url": "https://freesound.org/data/previews/234/234034_2631614-lq.mp3"}
]

//Interface-related functions
function setSpeaker(speaker, el){
    selectedSpeaker = speaker;
    $("article").removeClass('clicked');
    $(el).toggleClass('clicked');
    console.log(selectedSpeaker);
    setSpeakerIP();
    console.log(selectedSpeakerIP);
    getInfo();
};

function setSpeakerViaSelect(event){
    var selectElement = event.target;
    var value = selectElement.value;
    selectedSpeaker = value;
    console.log(selectedSpeaker);
    setSpeakerIP();
    console.log(selectedSpeakerIP);
    getInfo();
};

function setSpeakerIP() {
    for (i=0; i<4; i++) {
            if (speakers[i].name == selectedSpeaker) { 
                selectedSpeakerIP = speakers[i].ip;
            }
        }
}

function showAllChannels() {
    $('.channelList').removeClass('channelList');
    $('.channelList').toggleClass('channelList-all');
    console.log('view all clicked');
}

//Functions that use the Bose-API
function setChannel(location) {
  var postURL = "http://" + selectedSpeakerIP + ":8090";
  var data = "<ContentItem source='INTERNET_RADIO' location='"+ location + "'></ContentItem>";
  $.ajax({
    url: postURL + "/select",
    type: 'POST',
    crossDomain: true,
    data: data,
    dataType: 'text',
    success: function(result){
        console.log('setChannel function fired');
        setTimeout(getInfo, 500);
    },
    error: function(jqXHR, transStatus, errorThrown) {
      alert('Status: ' + jqXHR.status + '=' + jqXHR.statusText + '.' + 'Response: ' + jqXHR.responseText);
    }
  });
}

function setVolume(val) {
    var postURL = "http://" + selectedSpeakerIP + ":8090";
    var data = "<volume>" + val + "</volume>";
    $.ajax({
        url: postURL + "/volume",
        type: 'POST',
        crossDomain: true,
        data: data,
        dataType: 'text',
        success: function(result){
          console.log('setVolume function fired');
        },
        error: function(jqXHR, transStatus, errorThrown) {
          alert('Status: ' + jqXHR.status + '=' + jqXHR.statusText + '.' + 'Response: ' + jqXHR.responseText);
        }
      });
}

function sendIntercomMessage (message) {
    var postURL = "http://" + selectedSpeakerIP + ":8090";
    var data = "<play_info><app_key>" + APIkey + "</app_key><url>" + message + "</url><service>Intercom</service><volume>45</volume></play_info>";
    $.ajax({
        url: postURL + "/speaker",
        type: 'POST',
        crossDomain: true,
        data: data,
        dataType: 'text',
        success: function(result){
          console.log("Intercom function fired");
        },
        error: function(jqXHR, transStatus, errorThrown) {
          alert('Status: ' + jqXHR.status + '=' + jqXHR.statusText + '.' + 'Response: ' + jqXHR.responseText);
        }
    }); 
}

function getInfo() {
      $(".currentSpeaker").html('Selected speaker: <span class="selectedSpeaker">' + selectedSpeaker + '</span>');
      var baseURL = "http://" + selectedSpeakerIP + ":8090";
      var getURL = baseURL + "/now_playing";
      var getURL2 = baseURL + "/volume";
      $.get(getURL, {})
      .done(function(xml){
          var channelName = $(xml).find("itemName").text();
          $('.currentChannel').html('Now playing: <span class="nowPlaying tag is-info">' + channelName + '</span>');
      });
      $.get(getURL2, {})
      .done(function(xml){
          var currentVolume = $(xml).find("actualvolume").text();
          $('.currentVolume').html('Volume: <span class="nowPlaying">' + currentVolume + '</span>');
          $(".slider").val(currentVolume);
      });
}


//Event listeners and document ready function
$(document).ready(function() {
    $.getJSON("http://localhost:3000/api/devices", function(data) {
        speakers = data;
        setSpeakerIP();
        getInfo();
        });
    
    var volumecontroll = document.getElementById("volslider");
    volumecontroll.addEventListener('mouseup', function(){
        var volume = this.value;
        console.log(volume);
        setVolume(volume);
        setTimeout(getInfo, 500);
    });
    volumecontroll.addEventListener('touchend', function(){
        var volume = this.value;
        console.log(volume);
        setVolume(volume);
        setTimeout(getInfo, 500);
    });
    
    var burger = document.getElementById('burger');
    burger.addEventListener('click', function(){
            // Get the target from the "data-target" attribute
            var target = burger.dataset.target;
            var $target = document.getElementById(target);
            burger.classList.toggle('is-active');
            $target.classList.toggle('is-active');
            console.log('hamburger event');
    });
});