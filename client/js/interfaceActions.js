function setSpeaker(speaker, el){
    selectedSpeaker = speaker;
    localStorage.setItem('lastSelectedSpeaker', speaker);
//    $("article").removeClass('clicked');
//    $(".menu-list li a").removeClass('clicked');
//    $(el).toggleClass('clicked');
    $('#navMenu').toggleClass('is-active');
    getSelectedSpeakerIP();
    getInfo();
}

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
  var data = "<ContentItem source='INTERNET_RADIO' location='" + location + "'></ContentItem>";
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

function sendIntercomMessage(message) {
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

function getInfo() {
      $(".currentSpeaker").html('Selected speaker: <span class="selectedSpeaker">' + selectedSpeaker + '</span>');
      var baseURL = "http://" + selectedSpeakerIP + ":8090";
      var getURL = baseURL + "/now_playing";
      var getURL2 = baseURL + "/volume";
      $.get(getURL, {})
      .done(function(xml){
          console.log(xml);
          var channelName = $(xml).find("itemName").text();
          if (channelName == "") {channelName = "Speaker OFF or other source playing"};
          $('.currentChannel').html('Now playing: <span class="nowPlaying tag is-info">' + channelName + '</span>');
          //trying some stuff
          $("article").removeClass('clicked');
          $(".menu-list li a").removeClass('clicked');
          $(".title:contains('" + selectedSpeaker + "')").parent().toggleClass('clicked');
      });
      $.get(getURL2, {})
      .done(function(xml){
          var currentVolume = $(xml).find("actualvolume").text();
          $('.currentVolume').html('Volume: <span class="nowPlaying">' + currentVolume + '</span>');
          $(".slider").val(currentVolume);
      });
}