//Functions that build the interface content (maybe turn these into angular thingies later)
function buildTiles(){
        var html = "";
        for (i=0; i<speakers.length; i++){
            html += "<div class='tile is-parent'><article class='tile is-child box' onclick='setSpeaker(&quot;" + speakers[i].name + "&quot;, this)'><img src='img/soundtouch10.png'/><p class='title'>" + speakers[i].name + "</p></article></div>";
        }
        $('#targetForTiles').html(html);
    }
    
function buildRadioList(){
        var html= "";
        for (i=0; i<options.radioFavourites.length; i++) {
            html += "<tr><td width='5%'><i class='mdi mdi-radio'></i></td><td>" + options.radioFavourites[i].channelName + "</td><td><a class='button is-small is-primary' onclick='setChannel(" + options.radioFavourites[i].favID +  ")'>Play&nbsp;<i class='mdi mdi-play'></i></a></td></tr>";
        }
        $('#favRadios').html(html);
    }

function buildMessagesList(){
        var html= "";
        for (i=0; i<options.intercomMessages.length; i++) {
            html += "<tr><td width='5%'><i class='mdi mdi-message'></i></td><td>" + options.intercomMessages[i].messageName + "</td><td><a class='button is-small is-primary' onclick='sendIntercomMessage(&#39;" + options.intercomMessages[i].url + "&#39;)'>Send</a></td></tr>";
        }
        $('#messageList').html(html);
    }

function buildBurgerMenu(){
        var html = "";
        for (i=0; i<speakers.length; i++){
            html += "<li><a onclick='setSpeaker(&quot;" + speakers[i].name + "&quot;, this)'>" + speakers[i].name + "</a></li>";
        }
        $('#navMenu .menu-list').html(html);
    }