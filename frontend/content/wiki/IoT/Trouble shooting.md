## Opsie woopsi
1. Read [this](Server.md), and restart zigbee2mqtt and the application.
2. Still not working? The lights have probably disconnected. You will have to put the lights into pairing mode (read (this)[Devices & app.md]) and turn on scanning in the zigbee2mqtt webinterface.
3. If its not working at this point you will have to dig deeper. 
You can view the zigbee2mqtt logs in the webinterface to check if lights are connected or not. You can also use the webinterface manually control the lights under the dashboard tab. You can also run the app service with the ```--debug True``` flag which will tell you more about the mqtt communication between zigbee2mqtt and the app. 