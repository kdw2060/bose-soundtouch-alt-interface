# My Personal Bose SoundTouch App


WORK IN PROGRESS - [HELP WELCOME](#still-to-come)

This web-app doesn't feature all SoundTouch functions, I just wanted to build something with two features that I was missing in the official app:
- the ability to store more than 6 radio presets 
- the ability to use the speakers as an intercom

At the moment it only works if you run it locally on your pc.

![Desktop lay-out](screenshots/myAppDesktop.png)

## Installation and configuration

1. Download or fork this project
2. Edit the list of radio channels in `index.html` to your preferred stations. You can find the radiochannel codes quickly via http://vtuner.com/setupapp/guide/asp/BrowseStations/startpage.asp
3. Only if you want to use the intercom functionality: 
    - get a developer API key from http://developer.bose.com
    - enter your key on line 5 in `scripts.js`
4. Install with `npm install` from the node console
5. Run `node server.js` and point your browser to localhost:3001


## Still to come

Wanna help out with this project? Here are some To Do's:

**Make it work on any webserver**

At the moment the app only works when running it locally on your pc. I want to install it on a permanently running webserver though so I can access it form my phone. 
I want to make a Hass.io addon out of it because I already have a Raspberry Pi running Hass.io --> I could really use some help with this part. The project includes `Dockerfile`, `config.json` and `run.sh` files to this end, but I'm still figuring that stuff out and couldn't get it working so far.

**Polish**
- add error handling where missing
- make an array of radio-stations (per user), then use these values in stead of hard-coding them in the html
- :white_check_mark: ~~in stead of hardcoding the speaker-names, use the Bose API to read out the names and make a dynamic array; also use this to dynamically build the speaker cards and mobile menu~~

**Functionality**
- add the ability to search and save favorite stations from within the app
- add the option to record a sound clip and send this over the intercom


## Some Credits

Learn more about the Bose Soundtouch API @ https://developer.bose.com/soundtouch-control-api/apis

I built the lay-out with Bulma css starting from the admin template @ https://dansup.github.io/bulma-templates/

This nice package made it easy to discover the speakers on the local network: https://github.com/watson/bonjour

The sample sound for the intercom function was found here: https://freesound.org/people/11linda/sounds/234034/
