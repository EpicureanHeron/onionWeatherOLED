var https = require('https');
var oledExp = require("/usr/bin/node-oled-exp");

oledExp.clear();
oledExp.init();
 
var APIkey = "<APIKEY>";

var lat = "lat=44.9778"
var  long = "lon=-93.265"

var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + lat + "&" + long + "&units=imperial&appid=" + APIkey;
https.get(queryURL, (resp) => {
  var data = '';
 
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
 
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
  var parsedBody= JSON.parse(data);
    console.log(parsedBody.dt)
    //var date = new Date(parsedBody.dt*1000);
    var sunrise = new Date(parsedBody.sys.sunrise*1000)
    var sunset = new Date(parsedBody.sys.sunset*1000)

    var sunriseString = sunrise.toString()
    var sunsetString = sunset.toString()

    var sunriseDisplay = sunriseString.substring(16,21)
    var sunsetDisplay = sunsetString.substring(16,21)

    oledExp.setCursor(0, 0)
    oledExp.write("Current weather:")
    oledExp.setCursor(1, 0)
    oledExp.write(parsedBody.weather[0].description)
    oledExp.setCursor(2, 0)
    oledExp.write("Current temp: " + parsedBody.main.temp)
    oledExp.setCursor(3, 0)
    oledExp.write("Sunrise: " + sunriseDisplay)
    oledExp.setCursor(4, 0)
    oledExp.write("Sunset: " + sunsetDisplay)
});
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});

