# My Alternative Bose SoundTouch App

<img width="300px" align="right" src="https://github.com/kdw2060/bose-soundtouch-alt-interface/raw/master/screenshots/myAppMobileView.png"/>

This web-app doesn't feature all SoundTouch functions, I just wanted to build something with two features that I was missing in the official app:

- the ability to store more than 6 radio presets\*
- the ability to use the speakers as an intercom

_\* Since starting this project Bose has updated its app and now also supports saving more radio favourites, but it takes more time to access and use that function there than in my small one page app._

## Installation

### Method 1 - run NodeJS app locally
You need to have a computer with Node.js installed to run this webapp. I use a raspberry pi with raspbian os and the pm2 tool to serve the app on my local network.

1. Download this project
2. Only if you want to use the intercom functionality:
   - get a developer API key from http://developer.bose.com
   - enter your key on line 100 in `server.js`
3. Create yourself a `localhost.crt` and `localhost.key` fileset by following [this guide](https://gist.github.com/cecilemuller/9492b848eb8fe46d462abeb26656c4f8)
4. Copy those files to the root folder of the project
5. Follow [this guide](https://www.bounca.org/tutorials/install_root_certificate.html) to install the Root CA you created during step 3 as a trusted certificate.
6. Install with `npm install` from the node console / your terminal
7. Run `node server.js` and point your client device browser to **https**://yourserverip:3001. If step 5 didn't succeed you'll get some warnings about the https certificate not being trusted. You can also choose to just ignore these warnings.
8. On mobile devices: use the install to homescreen function of your browser to install the webapp as a progressive web app on your device.

### Method 2 - install as Docker container


## Usage

### controls

Use the tabs at the top to select a speaker. Don't see any speakers? Try to refresh the app.

In order to select a channel or use the volume controls the speaker needs to be powered on. You can power on the speaker from within the app.

![menu](https://github.com/kdw2060/bose-soundtouch-alt-interface/raw/master/screenshots/controls.png "Menu")

### favourites management

As an example I have included my options file with favourites, you can either manually edit `/client/js/options.json` or use the heart/unheart icon to remove my favs.

To add new radio favourites you need a detour via the official Bose SoundTouch app:

- select a radio station in the official app
- refresh my app (or switch speakers)
- you should see the selected station in my app, use the heart icon to add to your favourites

Favourites are saved on the server and thus shared by all speakers and users of the app.

Preset intercom messages need to be set manually by editing the `options.json` file.

### intercom

As mentioned, you can set preset messages in `options.json`.

The message recorder should be self explainatory. When prompted you should of course allow access to your device's microphone.

## Still to come

Wanna help out with this project? Here are some To Do's:

- clean up the code (properly use modern javascript)
- :white_check_mark: ~~make the client work as a progressive web app~~
- :white_check_mark: ~~add the option to record a sound clip and send this over the intercom~~
- :white_check_mark: ~~add error handling where missing~~
- :white_check_mark: ~~store array of radio-stations in options.json, then use these values in stead of hard-coding them in the html~~
- :white_check_mark: ~~in stead of hardcoding the speaker-names, use the Bose API to read out the names and make a dynamic array; also use this to dynamically build the speaker cards and mobile menu~~

## Some Credits

Learn more about the Bose Soundtouch API @ https://developer.bose.com/soundtouch-control-api/apis

I built the interface with Bulma css framework: https://bulma.io/

This nice package made it easy to discover the speakers on the local network: https://github.com/watson/bonjour

The sample sound for the intercom function was found here: https://freesound.org/people/11linda/sounds/234034/

I was inspired for the favouriting flow by this project that's similar to mine: https://github.com/jimhome1608/BoseSpeaker
