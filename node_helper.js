/*********************************

  Node Helper for MMM-AccuWeatherForecastDeluxe.

  This helper is responsible for the DarkSky-compatible data pull from AccuWeather.
  At a minimum the API key, Latitude and Longitude parameters
  must be provided.  If any of these are missing, the request
  to AccuWeather will not be executed, and instead an error
  will be output the the MagicMirror log.

  Since AccuWeather has a very limited API quota on their free plan, there is an option to specify a second apiKey to double the quota.

  The AccuWeather-compatible API request looks like this:

    http://dataservice.accuweather.com/forecasts/v1/daily/5day/{locationKey}?apikey={apiKey}&details=true&metric={units=metric}

*********************************/

var NodeHelper = require("node_helper");
var needle = require("needle");
var moment = require("moment");

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for module [" + this.name + "]");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "ACCUWEATHER_ONE_CALL_FORECAST_GET") {
            console.log("[MMM-AccuWeatherForecastDeluxe] " + notification );
            var self = this;

            if (payload.apikey == null || payload.apikey == "") {
                console.log("[MMM-AccuWeatherForecastDeluxe] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** No API key configured. Get an API key at http://accuweather.com");
            } else if (payload.locationKey == null || payload.locationKey == "" ) {
                console.log("[MMM-AccuWeatherForecastDeluxe] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** LocationKey not provided.");
            } else {

                var forecastUrl = payload.endpoint +
                    "/" + payload.locationKey +
                    "?apikey=" + payload.apikey +
                    "&lang=" + payload.language + 
                    "&metric=" +  ((payload.units == "imperial") ? "false" : "true")  +
                    "&details=true";

                var currentUrl = payload.endpointNow +
                    "/" + payload.locationKey +
                    "?apikey=" + ((payload.apikey2 == null || payload.apikey2 == "") ? payload.apikey : payload.apikey2)  +
                    "&lang=" + payload.language + 
                    "&metric=" +  ((payload.units == "imperial") ? "false" : "true")  +
                    "&details=true";

                (async () => {
                    var f = {};
                    console.log("[MMM-AccuWeatherForecastDeluxe] Getting data: " + forecastUrl);
                    const resp1 = await fetch(forecastUrl);
                    const json1 = await resp1.json();
                    //console.log("[MMM-AccuWeatherForecastDeluxe] url data: " + JSON.stringify(json1) );
                    f = json1;
                    f.instanceId = payload.instanceId;
                    console.log("[MMM-AccuWeatherForecastDeluxe] Getting data: " + currentUrl);
                    const resp2 = await fetch(currentUrl);
                    const json2 = await resp2.json();
                    //console.log("[MMM-AccuWeatherForecastDeluxe] url2 data: " + JSON.stringify(json2) );
                    f.Current = json2[0];                    
                    self.sendSocketNotification("ACCUWEATHER_ONE_CALL_FORECAST_DATA", f);
                    console.log("[MMM-AccuWeatherForecastDeluxe] " + " after sendSocketNotification");
                  })().catch(function (error) {
                    // if there's an error, log it
                    console.error("[MMM-AccuWeatherForecastDeluxe] " + " ** ERROR ** " + error);
                });
             
                console.log("[MMM-AccuWeatherForecastDeluxe] after API calls");
            }
        }
    },


});