//Some global variables
var speakers;
var selectedSpeaker;
var selectedSpeakerIP;
var selectedSpeakerSource;
var options;

//Interface-related functions moved to seperate js files


$(document).ready(function() {
    var hostname = window.location.hostname;
    //fill speaker array
    $.getJSON("https://" + hostname + ":3001/api/devices", function(data) {
        speakers = data;
            if (data != "" ) {
                setSelectedSpeakerIP();
                getInfo();
                buildTiles();
                buildBurgerMenu();
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
        });
    //fill radiochannel and intercom arrays
    $.getJSON("https://" + hostname + ":3001/api/options", function(data) {
        options = data;
            if (data != "" ) {
                buildRadioList();
                buildMessagesList();
            }
            if (data == ""){
                alert('Your radio channels and messages could not be loaded. Try to refresh the page.');
            }
        }).fail(function(jqXHR) {
            if (jqXHR.status == 404) {
                alert("404 Not Found");
            } else {
                alert("The addon options file could not be read.");
            }
        });
    //autoset speaker to last selected
    if (localStorage.lastSelectedSpeaker) {
        selectedSpeaker = localStorage.getItem('lastSelectedSpeaker');
        }
    
    //Event listeners
    var volumecontroll = document.getElementById("volslider");
    volumecontroll.addEventListener('mouseup', function(){
            var volume = this.value;
            //console.log('volume set to: ' + volume);
            setVolume(volume);
            setTimeout(getInfo, 500);
    });
    volumecontroll.addEventListener('touchend', function(){
            var volume = this.value;
            setVolume(volume);
            setTimeout(getInfo, 500);
    });
    var burger = document.getElementById('burger');
    burger.addEventListener('click', function(){
                //console.log('burger clicked');
                var target = burger.dataset.target;
                var $target = document.getElementById(target);
                burger.classList.toggle('is-active');
                $target.classList.toggle('is-active');
    });    
   var powerBtn = document.getElementById("powerButton");
   powerBtn.addEventListener('mouseup', function(){
        powerButton();
   });
});

