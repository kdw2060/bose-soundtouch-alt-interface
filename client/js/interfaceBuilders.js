//Functions that build the interface content (maybe turn these into angular thingies later)
function buildToggle(){
        var html = "";
        for (i=0; i<speakers.length; i++){
            html += "<li class=''><a onclick='setSpeaker(&quot;" + speakers[i].name + "&quot;, this)'><span class=''><img src='img/soundtouch10.png'/></span><span>" + speakers[i].name + "</span></a></li>";
        }
        $('#targetForToggle').html(html);
    }
    
function buildRadioList(){
        var html= "";
        for (i=0; i<options.radioFavourites.length; i++) {
            html += "<tr><td width='5%'><i class='mdi mdi-radio'></i></td><td>" + options.radioFavourites[i].channelName + "</td><td><a class='button is-small is-primary' onclick='setChannel(" + options.radioFavourites[i].favID +  ")'>Play&nbsp;<i class='mdi mdi-play'></i></a></td></tr>";
        }
        $('#favRadios').html(html);
        console.log('radio favlist built');
    }

function buildMessagesList(){
        var html= "";
        for (i=0; i<options.intercomMessages.length; i++) {
            html += "<tr><td width='5%'><i class='mdi mdi-message'></i></td><td>" + options.intercomMessages[i].messageName + "</td><td><a class='button is-small is-primary' onclick='sendIntercomMessage(&#39;" + options.intercomMessages[i].url + "&#39;)'>Send</a></td></tr>";
        }
        $('#messageList').html(html);
    }
