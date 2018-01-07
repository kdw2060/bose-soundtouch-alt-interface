//Some global variables
var speakers;
var selectedSpeaker = 'SoundTouch10Kris'; //todo: save last selected speaker as a variable in a cookie/localstorage/...
var selectedSpeakerIP;
var APIkey = '';  //enter your app API key from developer.bose.com
//List of intercom messages
//List of intercom messages (to do: move to options.json)
var messages = [
    {"name":"dinner", 
    "url": "https://freesound.org/data/previews/234/234034_2631614-lq.mp3"}
]

//Interface-related functions

    //Functions that build the speaker tiles and mobile menu (maybe turn these into angular thingies later)
    function makeTiles(){
        var html = "";
        for (i=0; i<speakers.length; i++){
            html += "<div class='tile is-parent'><article class='tile is-child box' onclick='setSpeaker(&quot;" + speakers[i].name + "&quot;, this)'><img src='soundtouch10.png'/><p class='title'>" + speakers[i].name + "</p></article></div>";
        }
        $('#targetForTiles').html(html);
    }
    
    function makeBurgerMenu(){
        var html = "";
        for (i=0; i<speakers.length; i++){
            html += "<li><a onclick='setSpeaker(&quot;" + speakers[i].name + "&quot;, this)'>" + speakers[i].name + "</a></li>";
        }
        $('#navMenu .menu-list').html(html);
    }
    //End of builder functions

function setSpeaker(speaker, el){
    selectedSpeaker = speaker;
    $("article").removeClass('clicked');
    $(".menu-list li a").removeClass('clicked');
    $(el).toggleClass('clicked');
    $('#navMenu').toggleClass('is-active');
    console.log(selectedSpeaker);
    getSelectedSpeakerIP();
    console.log(selectedSpeakerIP);
    getInfo();
};

function getSelectedSpeakerIP() {
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
        setTimeout(getInfo, 1000);
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
    //debuginfo
    for (i=0; i<speakers.length; i++) {
        $.get("http://" + speakers[i].ip + ":8090/info", {})
        .done(function(xml){
            console.log(xml);
        })
    }
    //end debug
}


//Event listeners and document ready function
var volumecontroll = document.getElementById("volslider");
volumecontroll.addEventListener('mouseup', function(){
        var volume = this.value;
        setVolume(volume);
        setTimeout(getInfo, 1000);
});
volumecontroll.addEventListener('touchend', function(){
        var volume = this.value;
        setVolume(volume);
        setTimeout(getInfo, 1000);
});
var burger = document.getElementById('burger');
burger.addEventListener('click', function(){
            var target = burger.dataset.target;
            var $target = document.getElementById(target);
            burger.classList.toggle('is-active');
            $target.classList.toggle('is-active');
});

$(document).ready(function() {
    var hostname = window.location.hostname;
    $.getJSON("http://" + hostname + ":3001/api/devices", function(data) {
        speakers = data;
            if (data != "" ) {
                console.log('everything ok');
                getSelectedSpeakerIP();
                getInfo();
                makeTiles();
                makeBurgerMenu();
            }
            if (data == ""){
                alert('Your speakers could not be detected yet. Try to refresh the page in a minute.');
                //todo: replace alert with a spinner until speakers found or else show time-out message
            }
        }).fail(function(jqXHR) {
            if (jqXHR.status == 404) {
                alert("404 Not Found");
            } else {
                alert("The speaker discovery service cannot be reached.");
            }
        });;
});