My Alternative for Bose's SoundTouch App
======

WORK IN PROGRESS - NOT FINISHED - HELP WELCOME

This web-app doesn't feature all SoundTouch functions, I just wanted to build something with two features missing from the official app:
- store more than 6 radio presets 
- the ability to use the speakers as an intercom



#Installation and configuration
==
1 Download or fork this project

Install with

`npm install`


#Still to come
==
Wanna help out with this project? Here are some TO Do's:

Polish
- add error handling where missing

Functionality
- make an array of radio-stations (per user), then use these values in stead of hard-coding them in the html
- add the ability to search and add stations from within the app
- in stead of hardcoding the speaker-names, use the Bose API to read out the names and make a dynamic array; also use this to dynamically build the speaker cards and select box

##Some Credits
I built the lay-out with Bulma css starting from the admin template @ https://dansup.github.io/bulma-templates/

This nice package made it easy to discover the speakers on the local network: https://github.com/watson/bonjour

The sample sound for the intercom function was found here: https://freesound.org/people/11linda/sounds/234034/