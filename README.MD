# Required Equipment

* Onion Omega2
* Onion Expansion Dock
* OLED Expansion
* USB

# Set Up

Configured Onion to boot from USB (may not be necessary) but absolutely most utilize the space on the USB. Ran into trouble with node and npm otherwise. To do so, follow this guide:

 [Booting from External Storage](https://docs.onion.io/omega2-docs/boot-from-external-storage.html)

 Then installed node and npm by following this guide:

[Installing and Using NodeJS](https://docs.onion.io/omega2-docs/installing-and-using-nodejs.html)

Ultimately, run the following:

```
opkg update
opkg install nodejs
```

Created the directory "weatheroled" on the file path /mnt/sda. So the full directory name is now
```
/mnt/sda/weatheroled
```

Navigate to that directory and create the file which will be gathering weather data and writing to the OLED screen. 
```
touch index.js
```
and initialize the directory with npm

```
npm init
```

There is a node package specifically for interacting with the Onion OLED screen. Here is the guide and documentation: [OLED Expansion Node Module](https://docs.onion.io/omega2-docs/oled-expansion-node-module.html#oled-expansion-node-module)

To install the module run 
```
opkg update
opkg install node-oled-exp
```

# index.js

Leveraging the "https" module and the API from [Open Weather Map](https://openweathermap.org/current), data is taken by passing the lat and long of Minneapolis.

 That returns a JSON object. 
 
 From there, the code parses the data and grabs the weather, temp, sunrise, and sunset. The sunrise and sunset are values in unix time which have to be parsed. 

 The data is then displayed on the OLED screen

# Cron 

Once index.js is set up, cron can be leveraged to run the script on a schedule. 

Onion's documentation on crontab is helpful for setting up a cron job: 

[Running a Command on a Schedule](https://docs.onion.io/omega2-docs/running-a-command-on-a-schedule.html)

Run 

```
crontab -e
```
Update that file with (this will run the script every 5 minutes)
```
*/5 * * * * /usr/bin/node /mnt/sda/weatheroled/index.js
```
exit crontab using vi
```
[esc] :wq [enter]
```
check to see the changes were made
```
crontab -l
```
Reset cron
```
/etc/init.d/cron restart
```

 # Issues
 * ## request module
    
    Ideally the request module would have been used rather than the https module. However, installing request via npm like so 
    ```
    npm i request
    ```
    caused the Onion to freeze up. The package and its dependencies are unable to be downloaded for some reason

* ## API Key

    Currently the APIKey is written into the file itself, ideally node would handle this information

* ## Sunrise/Sunset data

    The current converted unix time displays the day of the week, day, and time. The day and date are not necessary. These also take up a lot of space on the OLED screen, so it could be parsed down to be just the hour and minute of each event. 