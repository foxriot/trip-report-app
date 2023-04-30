# Trip Report v 1.0.0 (Beta)

Electron-based fancy VRChat log parser. Provides automatic ingestion, a nice interface and photo/gallery managment.  
Provided free of charge, but if you find it useful [please encourage me](https://pay.feralresearch.org/tip)!

Download latest binary from [tripreport.foxriot.com](https://tripreport.foxriot.com).

Report issues [here](https://github.com/foxriot/trip-report-app/issues).

## Requirements

- This app auto-monitors the VRChat process. Since VRChat only runs on Windows, Windows remains a requirement for automatically ingesting logs. It is possible to install and run a MacOS compatible version which will allow you to manage and explore your logs and images, but obviously will not be able to import new logs from VRChat.

## Known Issues

- ASAR is disabled for now which makes installation extremely S L O W. With ASAR on, the WQL monitor throws errors. Possibly related to: https://github.com/node-ffi-napi/node-ffi-napi. As soon as I sort this I will re-enable ASAR, for now please be patient with the installer.
