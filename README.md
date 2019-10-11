# My Personal Bose SoundTouch App


<img width="300px" align="right" src="https://github.com/kdw2060/bose-soundtouch-alt-interface/raw/master/screenshots/myAppMobileView.png"/>

This web-app doesn't feature all SoundTouch functions, I just wanted to build something with two features that I was missing in the official app: 
- the ability to store more than 6 radio presets* 
- the ability to use the speakers as an intercom

_* Since starting this project Bose has updated its app and now also supports saving more radio favourites, but it takes more time to access and use that function there than in my small one page app._


## Installation and configuration

1. Download this project
2. Only if you want to use the intercom functionality: 
    - get a developer API key from http://developer.bose.com
    - enter your key on line 92 in `server.js`
3. Create yourself a `server.cert` and `server.key` fileset by following [this guide](https://flaviocopes.com/express-https-self-signed-certificate/)
4. Copy those files to the root folder of the project
    
**install on a local nodeJS webserver**

5. Set the variable `HassEnv` to false on line 22 of `server.js`
6. Edit `options.json` inside the client\js folder to edit the list of your preferred radio channels and intercom messages. As Bose has moved away from vtuner to either TuneIn or Radioplayer you can no longer just set a station number but have to set a complete `<ContentItem>` object. To get this object you need to use the `/nowplaying` API function after having selected the station through the official Bose Soundtouch app. See [api-reference](https://developer.bose.com/guides/bose-soundtouch-api/bose-soundtouch-api-reference). I suggest you use a tool like the excellent [Postman](https://www.getpostman.com/) to execute the ``/nowplaying`` call.
7. Install with `npm install` from the node console
8. Run `node server.js` and point your client device browser to *https*://yourserverip:3001. You'll get some warnings about the https certificate not being trusted, just ignore/trust the site.

**OR install on Hass.io**

> WARNING : the app will probably not work anymore on Hass.io now that it was adapted to run over https (which is necessary for the soundrecording to work). I haven't tested it. Might have a look in the future, but won't be treating it as a high priority

5. Copy all project files to a folder within the Hass.io addon folder ([see intro of this tutorial](https://home-assistant.io/developers/hassio/addon_tutorial/))
6. Navigate to the Hass.io store and hit refresh
7. Click on the 'MyBoseApp' addon and hit install
8. Use the options-panel to define your personal list of preferred radio channels and intercom messages. As Bose has moved away from vtuner to either TuneIn or Radioplayer you can no longer just set a station number but have to set a complete `<ContentItem>` object. To get this object you need to use the `/nowplaying` API function after having selected the station through the official Bose Soundtouch app. See [api-reference](https://developer.bose.com/guides/bose-soundtouch-api/bose-soundtouch-api-reference). I suggest you use a tool like the excellent [Postman](https://www.getpostman.com/) to execute the ``/nowplaying`` call.
9. When installation has finished hit start and wait a minute or so (at least on a raspberry pi)
10. Click the 'open web ui' button

## Still to come

Wanna help out with this project? Here are some To Do's:

- make the client work as a progressive web app
- clean up the code (properly use modern async Javascript)
- :white_check_mark: ~~add the option to record a sound clip and send this over the intercom~~
- :white_check_mark: ~~add error handling where missing~~
- :white_check_mark: ~~store array of radio-stations (per user) in options.json, then use these values in stead of hard-coding them in the html~~
- :white_check_mark: ~~in stead of hardcoding the speaker-names, use the Bose API to read out the names and make a dynamic array; also use this to dynamically build the speaker cards and mobile menu~~


## Some Credits

Learn more about the Bose Soundtouch API @ https://developer.bose.com/soundtouch-control-api/apis

I built the lay-out with Bulma css starting from the admin template @ https://dansup.github.io/bulma-templates/

This nice package made it easy to discover the speakers on the local network: https://github.com/watson/bonjour

The sample sound for the intercom function was found here: https://freesound.org/people/11linda/sounds/234034/
