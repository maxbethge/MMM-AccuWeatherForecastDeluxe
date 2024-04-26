/*********************************

  MagicMirror² Module:
  MMM-AccuWeatherMapForecast
  https://github.com/maxbethge/MMM-AccuWeatherMapForecastDeluxe

  Icons in use by this module:

  Skycons - Animated icon set by Dark Sky
  http://darkskyapp.github.io/skycons/
  (using the fork created by Maxime Warner
  that allows individual details of the icons
  to be coloured
  https://github.com/maxdow/skycons)

  Climacons by Adam Whitcroft
  http://adamwhitcroft.com/climacons/

  Free Weather Icons by Svilen Petrov
  https://www.behance.net/gallery/12410195/Free-Weather-Icons

  Weather Icons by Thom
  (Designed for DuckDuckGo)
  https://dribbble.com/shots/1832162-Weather-Icons

  Sets 4 and 5 were found on Graphberry, but I couldn't find
  the original artists.
  https://www.graphberry.com/item/weather-icons
  https://www.graphberry.com/item/weathera-weather-forecast-icons

  Weather animated Icons by basmilius
  https://github.com/basmilius/weather-icons

  Some of the icons were modified to better work with the module's
  structure and aesthetic.

  Weather data provided by AccuWeather API

  By Jeff Clarke
  Modified by Dirk Rettschlag
  Modified by Max Bethge
  Modified by Adam Garrett
  MIT Licensed

*********************************/

Module.register("MMM-AccuWeatherForecastDeluxe", {

    /*
      This module uses the Nunjucks templating system introduced in
      version 2.2.0 of MagicMirror.  If you're seeing nothing on your
      display where you expect this module to appear, make sure your
      MagicMirror version is at least 2.2.0.
    */
    requiresVersion: "2.2.0",

    defaults: {
        apikey: "",
        apikey2: "",
        locationKey: "",
        endpoint: "http://dataservice.accuweather.com/forecasts/v1/daily/5day",
        endpointNow: "http://dataservice.accuweather.com/currentconditions/v1",
        endpointHourly: "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour",
        updateInterval: 60, // minutes
        updateFadeSpeed: 500, // milliseconds
        requestDelay: 0,
        listenerOnly: false,
        units: config.units,
        language: "en-us",
        colored: true,
        highColor: '#F8DD70',
        lowColor: '#6FC4F5',
        relativeColors: false,
        showCurrentConditions: true,
        showExtraCurrentConditions: true,
        showSummary: true,
        hourlyForecastHeaderText: "",
        showForecastTableColumnHeaderIcons: true,
        showHourlyForecast: true,
        hourlyForecastLayout: "tiled", 
        hourlyForecastInterval: 3,
        maxHourliesToShow: 3,
        dailyForecastHeaderText: "",
        showDailyForecast: true,
        dailyForecastLayout: "tiled",
        maxDailiesToShow: 5,
        ignoreToday: false,
        showDailyLow: true,
        showDailyHiLowSeparator: true,
        showDayAsTodayInDailyForecast: false,
        showDayAsTomorrowInDailyForecast: false,
        showFeelsLike: true,
        showPrecipitationProbability: true,
        showPrecipitationSeparator: true,
        showPrecipitationAmount: true,
        showWindSpeed: true,
        showWindDirection: true,
        showWindGust: true,
        iconset: "1c",
        mainIconset: defaults.iconset,
        useAnimatedIcons: true,
        animateMainIconOnly: true,
        showInlineIcons: true,
        mainIconSize: 100,
        forecastTiledIconSize: 70,
        forecastTableIconSize: 30,
        showAttribution: true,
        label_temp_i: "°",
        label_temp_m: "°",
        label_maximum: "max ",
        label_high: "H ",
        label_low: "L ",
        label_hi_lo_separator: " / ",
        label_feels_like: "Feels like ",
        label_timeFormat: "h a",
        label_days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        label_today: "Today",
        label_tomorrow: "Tomorrow",
        label_ordinals: ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
        label_rain_i: " in",
        label_rain_m: " mm",
        label_snow_i: " in",
        label_snow_m: " mm",
        label_wind_i: " mph",
        label_wind_m: " m/s",
        label_gust_i: " mph",
        label_gust_m: " m/s",
        label_no_precip: "—",
        label_no_wind: "—",
        label_precip_separator: " ",
        label_gust_wrapper_prefix: " (",
        label_gust_wrapper_suffix: ")",
        dp_precip_leading_zero: false,
        dp_wind_leading_zero: true,
        dp_rain_i: 2,
        dp_rain_m: 0,
        dp_snow_i: 2,
        dp_snow_m: 0,
        dp_temp_i: 0,
        dp_temp_m: 0,
        dp_wind_i: 0,
        dp_wind_m: 0,
        moduleTimestampIdPrefix: "ACCUWEATHER_ONE_CALL_TIMESTAMP_",
    },

    validUnits: ["imperial", "metric", ""],
    validHourlyLayouts: ["tiled", "table"],
    validDailyLayouts: ["tiled", "table", "bars"],

    getScripts: function() {
        return ["moment.js", this.file("skycons.js")];
    },

    getStyles: function() {
        return ["MMM-AccuWeatherForecastDeluxe.css"];
    },

    getTemplate: function() {
        return "MMM-AccuWeatherForecastDeluxe.njk";
    },

    /*
      Data object provided to the Nunjucks template. The template does not
      do any data minipulation; the strings provided here are displayed as-is.
      The only logic in the template are conditional blocks that determine if
      a certain section should be displayed, and simple loops for the hourly
      and daily forecast.
     */
    getTemplateData: function() {
        return {
            phrases: {
                loading: this.translate("LOADING")
            },
            loading: this.formattedWeatherData == null ? true : false,
            config: this.config,
            forecast: this.formattedWeatherData,
            inlineIcons: {
                rain: this.generateIconSrc("i-rain"),
                snow: this.generateIconSrc("i-snow"),
                wind: this.generateIconSrc("i-wind")
            },
            animatedIconSizes: {
                main: this.config.mainIconSize,
                forecast: (this.config.hourlyForecastLayout == "tiled" || this.config.dailyForecastLayout == "tiled") ? this.config.forecastTiledIconSize : this.config.forecastTableIconSize
            },
            moduleTimestampIdPrefix: this.config.moduleTimestampIdPrefix,
            identifier: this.identifier,
            timeStamp: this.dataRefreshTimeStamp
        };
    },

    start: function() {

        Log.info("Starting module: " + this.name);

        this.weatherData = null;
        this.iconIdCounter = 0;
        this.formattedWeatherData = null;
        this.animatedIconDrawTimer = null;

        /*
          Optionally, Dark Sky's Skycons animated icon
          set can be used.  If so, it is drawn to the DOM
          and animated on demand as opposed to being
          contained in animated images such as GIFs or SVGs.
          This initializes the colours for the icons to use.
         */
        if (this.config.useAnimatedIcons) {
            this.skycons = new Skycons({
                "monochrome": false,
                "colors": {
                    "main": "#FFFFFF",
                    "moon": this.config.colored ? "#FFFDC2" : "#FFFFFF",
                    "fog": "#FFFFFF",
                    "fogbank": "#FFFFFF",
                    "cloud": this.config.colored ? "#BEBEBE" : "#999999",
                    "snow": "#FFFFFF",
                    "leaf": this.config.colored ? "#98D24D" : "#FFFFFF",
                    "rain": this.config.colored ? "#7CD5FF" : "#FFFFFF",
                    "sun": this.config.colored ? "#FFD550" : "#FFFFFF"
                }
            });
        }

        //sanitize optional parameters
        if (this.validUnits.indexOf(this.config.units) == -1) {
            this.config.units = "imperial";
        }
        if (this.validHourlyLayouts.indexOf(this.config.hourlyForecastLayout) == -1) {
            this.config.hourlyForecastLayout = "tiled";
        }
        if (this.validDailyLayouts.indexOf(this.config.dailyForecastLayout) == -1) {
            this.config.dailyForecastLayout = "tiled";
        }
        if (this.iconsets[this.config.iconset] == null) {
            this.config.iconset = "1c";
        }
        if (this.iconsets[this.config.mainIconset] == null) {
            this.config.mainIconset = this.config.iconset;
        }
        this.sanitizeNumbers([
            "updateInterval",
            "requestDelay",
            "hourlyForecastInterval",
            "maxHourliesToShow",
            "maxDailiesToShow",
            "mainIconSize",
            "forecastIconSize",
            "updateFadeSpeed",
            "animatedIconPlayDelay"
        ]);

        //force icon set to mono version whern config.coloured = false
        if (this.config.colored == false) {
            this.config.iconset = this.config.iconset.replace("c", "m");
        }

        if (!this.config.socketListenerOnly) {

            //start data poll
            var self = this;
            setTimeout(function() {

                //first data pull is delayed by config
                self.getData();

                setInterval(function() {
                    self.getData();
                }, self.config.updateInterval * 60 * 1000); //convert to milliseconds

            }, this.config.requestDelay);
            
        }

        // Add formatted units value for field selection in node_helper.js; 'imperial' --> 'Imperial', 'metric' --> 'Metric'
        this.config.unitsFormatted = this.config.units.charAt(0).toUpperCase() + this.config.units.slice(1);
        Log.info("[MMM-AccuWeatherForecastDeluxe] " + "  unitsFormatted: " + this.config.unitsFormatted);

        Log.info("Done starting module: " + this.name);
    },

    getData: function() {
        this.sendSocketNotification("ACCUWEATHER_ONE_CALL_FORECAST_GET", {
            apikey: this.config.apikey,
            apikey2: this.config.apikey2,
            locationKey: this.config.locationKey,
            units: this.config.units,
            language: this.config.language,
            instanceId: this.identifier,
            requestDelay: this.config.requestDelay,
            endpoint: this.config.endpoint,
            endpointNow: this.config.endpointNow,
            endpointHourly: this.config.endpointHourly
        });

    },

    notificationReceived: function(notification, payload, sender) {
        //console.log(this.name, 'notificationReceived', notification, payload, sender);

        if (
            this.config.listenerOnly &&
            notification === "ACCUWEATHER_ONE_CALL_FORECAST_WEATHER_DATA"
        ) {
            console.log(this.name, 'in notification ===', notification, payload, sender);

            //clear animated icon cache
            if (this.config.useAnimatedIcons) {
                this.clearIcons();
            }

            //process weather data
            this.dataRefreshTimeStamp = moment().format("x");
            this.weatherData = payload;
            this.formattedWeatherData = this.processWeatherData();

            this.updateDom(this.config.updateFadeSpeed);

            if (this.config.useAnimatedIcons) {
                var self = this;
                this.animatedIconDrawTimer = setInterval(function() {
                    var elToTest = document.getElementById(self.config.moduleTimestampIdPrefix + self.identifier);
                    if (elToTest != null && elToTest.getAttribute("data-timestamp") == self.dataRefreshTimeStamp) {
                        clearInterval(self.animatedIconDrawTimer);
                        self.playIcons(self);
                    }
                }, 100);
            }

        }
    },

    socketNotificationReceived: function(notification, payload) {
        //console.log(this.name, 'socketNotificationReceived', notification, payload);

        if (notification === "ACCUWEATHER_ONE_CALL_FORECAST_DATA" && payload.instanceId === this.identifier) {
            console.log(this.name, 'in notification ===', notification, payload);

            //clear animated icon cache
            if (this.config.useAnimatedIcons) {
                this.clearIcons();
            }

            //process weather data
            this.dataRefreshTimeStamp = moment().format("x");
            this.weatherData = payload;
            this.formattedWeatherData = this.processWeatherData();

            this.updateDom(this.config.updateFadeSpeed);

            //broadcast weather update
            // this.sendNotification("ACCUWEATHER_ONE_CALL_FORECAST_WEATHER_UPDATE", payload);
            this.sendNotification("ACCUWEATHER_ONE_CALL_FORECAST_WEATHER_DATA", payload);

            /*
              Start icon playback. We need to wait until the DOM update
              is complete before drawing and starting the icons.

              The DOM object has a timestamp embedded that we will look
              for.  If the timestamp can be found then the DOM has been
              fully updated.
            */
            if (this.config.useAnimatedIcons) {
                var self = this;
                this.animatedIconDrawTimer = setInterval(function() {
                    var elToTest = document.getElementById(self.config.moduleTimestampIdPrefix + self.identifier);
                    if (elToTest != null && elToTest.getAttribute("data-timestamp") == self.dataRefreshTimeStamp) {
                        clearInterval(self.animatedIconDrawTimer);
                        self.playIcons(self);
                    }
                }, 100);
            }

        }


    },

    /*
      This prepares the data to be used by the Nunjucks template.  The template does not do any logic other
      if statements to determine if a certain section should be displayed, and a simple loop to go through
      the houly / daily forecast items.
    */
    processWeatherData: function() {
        console.log(this.name, 'processWeatherData', this.weatherData.Headline.Text);
        var summary = this.weatherData.Headline.Text;
//TODO: call hourly API
        var hourlies = [];
        if (this.config.showHourlyForecast) {

            var displayCounter = 0;
            var currentIndex = this.config.hourlyForecastInterval;
            while (displayCounter < this.config.maxHourliesToShow) {
                if (typeof this.weatherData.hourly == 'undefined' || this.weatherData.hourly[currentIndex] == null) {
                    break;
                }

                hourlies.push(this.forecastItemFactory(this.weatherData.hourly[currentIndex], "hourly"));

                currentIndex += this.config.hourlyForecastInterval;
                displayCounter++;

            }

        }
        console.log(this.name, 'about to create dailies');
        var dailies = [];
        if (this.config.showDailyForecast) {
            var i = 1;
            var maxi = this.config.maxDailiesToShow;
            var min = Number.MAX_VALUE;
            var max = -Number.MAX_VALUE;

            if (!this.config.ignoreToday) {
                i = 0;
                maxi = this.config.maxDailiesToShow - 1;
            }
            for (j = i; j <= maxi; j++) {
                console.log(this.name, 'daily',this.weatherData.DailyForecasts[j]);
                if (this.weatherData.DailyForecasts[j] == null) {
                    break;
                }
                min = Math.min(min, this.weatherData.DailyForecasts[j].Temperature.Minimum.Value);
                max = Math.max(max, this.weatherData.DailyForecasts[j].Temperature.Maximum.Value);
            }
            for (i; i <= maxi; i++) {
                if (this.weatherData.DailyForecasts[i] == null) {
                    break;
                }
                dailies.push(this.forecastItemFactory(this.weatherData.DailyForecasts[i], "daily", i, min, max));
            }

        }
        console.log("[MMM-AccuWeatherForecastDeluxe] " + moment().format("D-MMM-YY HH:mm") + "  unitsFormatted: " + this.config.unitsFormatted );

        return {
            "currently": {
                temperature: this.getUnit('temp', this.weatherData.Current.Temperature[this.config.unitsFormatted].Value),
                feelslike: this.getUnit('temp', this.weatherData.Current.RealFeelTemperature[this.config.unitsFormatted].Value),
                animatedIconId: this.config.useAnimatedIcons ? this.getAnimatedIconId() : null,
                animatedIconName: this.convertAccuWeatherIdToIcon(this.weatherData.Current.WeatherIcon, this.weatherData.Current.WeatherText),
                iconPath: this.generateIconSrc(this.convertAccuWeatherIdToIcon(this.weatherData.DailyForecasts[0].Day.Icon, this.weatherData.DailyForecasts[0].Day.IconPhrase), true),
                tempRange: this.formatHiLowTemperature(this.weatherData.DailyForecasts[0].Temperature.Maximum.Value, this.weatherData.DailyForecasts[0].Temperature.Minimum.Value),
                precipitation: this.formatPrecipitation(null, 
                    ((this.weatherData.Current.PrecipitationType === 'Rain')? 
                        this.weatherData.Current.PrecipitationSummary.Past12Hours[this.config.unitsFormatted].Value  : null), 
                    ((this.weatherData.Current.PrecipitationType === 'Snow')? 
                        this.weatherData.Current.PrecipitationSummary.Past12Hours[this.config.unitsFormatted].Value  : null)),
                wind: this.formatWind(
                    this.weatherData.Current.Wind.Speed[this.config.unitsFormatted].Value, 
                    this.weatherData.Current.Wind.Direction.Degrees, 
                    this.weatherData.Current.WindGust.Speed[this.config.unitsFormatted].Value
                ),
            },
            "summary": summary,
            "hourly": hourlies,
            "daily": dailies,
        };
    },


    /*
      Hourly and Daily forecast items are very similar.  So one routine builds the data
      objects for both.
     */
    forecastItemFactory: function(fData, type, index = null, min = null, max = null) {

        var fItem = new Object();
        console.log(this.name, 'forecastItemFactory', fData, index, min, max);

        // --------- Date / Time Display ---------
        if (type == "daily") {

            //day name (e.g.: "MON")
            if (index === 0 && this.config.showDayAsTodayInDailyForecast) fItem.day = this.config.label_today;
            else if (index === 1 && this.config.showDayAsTomorrowInDailyForecast) fItem.day = this.config.label_tomorrow;
            else fItem.day = this.config.label_days[moment(fData.EpochDate * 1000).format("d")];

        } else { //hourly

            //time (e.g.: "5 PM")
            fItem.time = moment(fData.EpochDate * 1000).format(this.config.label_timeFormat);
        }

        // --------- Icon ---------
        if (this.config.useAnimatedIcons && !this.config.animateMainIconOnly) {
            fItem.animatedIconId = this.getAnimatedIconId();
            fItem.animatedIconName = this.convertAccuWeatherIdToIcon(fData.Day.Icon, fData.Day.IconPhrase);
        }
        fItem.iconPath = this.generateIconSrc(this.convertAccuWeatherIdToIcon(fData.Day.Icon, fData.Day.IconPhrase));

        // --------- Temperature ---------
        if (type == "hourly") { //just display projected temperature for that hour
            fItem.temperature = this.getUnit('temp',fData.temp);
        } else { //display High / Low temperatures
            fItem.tempRange = this.formatHiLowTemperature(fData.Temperature.Maximum.Value, fData.Temperature.Minimum.Value);
            
            fItem.bars = {
                min: min,
                max: max,
                total: max - min,
                interval: 100 / (max - min),
            };
            fItem.bars.barWidth = Math.round(fItem.bars.interval * (fData.Temperature.Maximum.Value - fData.Temperature.Minimum.Value));
            
            fItem.bars.leftSpacerWidth = Math.round(fItem.bars.interval * (fData.Temperature.Minimum.Value - min));
            var colorStartPos = fItem.bars.interval * (fData.Temperature.Minimum.Value - min) / 100;

            fItem.bars.rightSpacerWidth = Math.round(fItem.bars.interval * (max - fData.Temperature.Maximum.Value));
            var colorEndPos = fItem.bars.interval * (fData.Temperature.Maximum.Value - min) / 100;

            var colorLo = this.config.lowColor.substring(1);
            var colorHi = this.config.highColor.substring(1);
            
            fItem.colorStart = '#' + this.interpolateColor(colorLo, colorHi, colorStartPos);
            fItem.colorEnd = '#' + this.interpolateColor(colorLo, colorHi, colorEndPos);
        }

        // --------- Precipitation ---------
//TODO: get max value from day/night
        var precipProbability = Math.max(fData.Day.PrecipitationProbability,fData.Night.PrecipitationProbability);
        precipProbability = (precipProbability > 0) ? (precipProbability / 100) : precipProbability;
        var rainValue = fData.Day.Rain.Value + fData.Night.Rain.Value;
        var snowValue = fData.Day.Snow.Value + fData.Night.Snow.Value;
        fItem.precipitation = this.formatPrecipitation(precipProbability, rainValue, snowValue);

        // --------- Wind ---------
//TODO: get max value from day/night
        fItem.wind = (this.formatWind(fData.Day.Wind.Speed.Value, fData.Day.Wind.Direction.Degrees, fData.Day.WindGust.Speed.Value));

        return fItem;
    },

    /*
      Returns a formatted data object for High / Low temperature range
     */
    formatHiLowTemperature: function(h, l) {
        return {
            high: this.config.label_high + this.getUnit('temp', h),
            low: this.config.label_low + this.getUnit('temp', l)
        };
    },

    /*
      Returns a formatted data object for precipitation
     */
    formatPrecipitation: function(percentChance, rainAccumulation, snowAccumulation) {

        var accumulation = null;
        var accumulationtype = null;
        var pop = null;

        //accumulation
        if (snowAccumulation) {
            accumulationtype = "snow";
            if (typeof snowAccumulation === "number") {
                accumulation = this.getUnit('snow', snowAccumulation);
            } else if (typeof snowAccumulation === "object" && snowAccumulation["1h"]) {
                accumulation = this.getUnit('snow', snowAccumulation["1h"]);
            }
        } else if (rainAccumulation) {
            accumulationtype = "rain";
            if (typeof rainAccumulation === "number") {
                accumulation = this.getUnit('rain', rainAccumulation);
            } else if (typeof rainAccumulation === "object" && rainAccumulation["1h"]) {
                accumulation = this.getUnit('rain', rainAccumulation["1h"]);
            }
        }

        if (percentChance) {
            pop = Math.round(percentChance * 100) + "%";
        }
        return {
            pop: pop,
            accumulation: accumulation,
            accumulationtype: accumulationtype
        };

    },

    /*
      Returns a formatted data object for wind conditions
     */
    formatWind: function(speed, bearing, gust) {
        var windSpeed = this.getUnit('wind', speed);
        var windDirection = (this.config.showWindDirection ? " " + this.getOrdinal(bearing) : "");
        var windGust = null;
        if (this.config.showWindGust && gust) {
            windGust = this.config.label_gust_wrapper_prefix + this.config.label_maximum + this.getUnit('gust', gust) + this.config.label_gust_wrapper_suffix;
        }
        var windSpeedRaw = parseFloat(speed.toFixed(this.config['dp_wind' + (this.config.units === 'metric' ? '_m' : '_i')]));
        
        return {
            windSpeedRaw: windSpeedRaw,
            windSpeed: windSpeed,
            windDirection: windDirection,
            windGust: windGust
        };
    },

    /*
      Returns the units in use for the data pull from AccuWeather
     */
    getUnit: function(metric, value) {

        var rounded = String(parseFloat(value.toFixed(
            this.config['dp_' + metric + (this.config.units === 'metric' ? '_m' : '_i')]
        )));

        switch (metric) {
            case 'rain':
                if (!this.config.dp_precip_leading_zero && rounded.indexOf("0.") === 0) rounded = rounded.substring(1);
                break;
            case 'wind': 
                if (!this.config.dp_wind_leading_zero && rounded.indexOf("0.") === 0) rounded = rounded.substring(1);
                break;
        }

        return rounded + this.config['label_' + metric + (this.config.units === 'metric' ? '_m' : '_i')];

    },

    /*
      Formats the wind direction into common ordinals (e.g.: NE, WSW, etc.)
      Wind direction is provided in degress from North in the data feed.
     */
    getOrdinal: function(bearing) {
        return this.config.label_ordinals[Math.round(bearing * this.config.label_ordinals.length / 360) % this.config.label_ordinals.length];
    },

    /*
      Icon sets can be added here.  The path is relative to
      MagicMirror/modules/MMM-AccuWeatherMapForecastDeluxe/icons, and the format
      is specified here so that you can use icons in any format
      that works for you.

      OpenWeatherMap currently specifies one of ten icons for weather
      conditions:

        clear-day
        clear-night
        cloudy
        fog
        partly-cloudy-day
        partly-cloudy-night
        rain
        sleet
        snow
        wind

      All of the icon sets below support these ten plus an
      additional three in anticipation of OpenWeatherMap enabling
      a few more:

        hail,
        thunderstorm,
        tornado

      Lastly, the icons also contain three icons for use as inline
      indicators beside precipitation and wind conditions. These
      ones look best if designed to a 24px X 24px artboard.

        i-rain
        i-snow
        i-wind

     */
    iconsets: {
        "1m":	{ path: "1m"	, format: "svg" },
        "1c":	{ path: "1c"	, format: "svg" },
        "2m":	{ path: "2m"	, format: "svg" },
        "2c":	{ path: "2c"	, format: "svg" },
        "3m":	{ path: "3m"	, format: "svg" },
        "3c":	{ path: "3c"	, format: "svg" },
        "4m":	{ path: "4m"	, format: "svg" },
        "4c":	{ path: "4c"	, format: "svg" },
        "5m":	{ path: "5m"	, format: "svg" },
        "5c":	{ path: "5c"	, format: "svg" },
        "6fa":	{ path: "6fa"	, format: "svg" },
        "6oa":	{ path: "6oa"	, format: "svg" }
    },

    /*
      This converts AccuWeather icon id to icon names
      https://developer.accuweather.com/weather-icons
    */
    convertAccuWeatherIdToIcon: function(id, accuweather_icon) {
        //console.log(this.name, 'convertAccuWeatherIdToIcon', id, accuweather_icon);
        if ([15,16,17,41,42].includes(id)) {
            // Thunderstorm
            return "thunderstorm";
        //} else if (id >= 300 && id < 400) {
        //    // Drizzle
        //    return "rain";
        //} else if (id === 511) {
       //     // Rain - freezing rain
        //    return "sleet";
        } else if ([12,13,14,18].includes(id)) {
            // Rain
            return "rain";
        } else if ([25,26,39,40].includes(id)) {
            // Snow - sleet or with rain
            return "sleet";
        } else if ([19,20,21,22,23,29,43,44].includes(id)) {
            // Snow
            return "snow";
        //} else if (id === 781) {
       //     // Atmosphere - tornado
        //    return "tornado";
        } else if (id === 11) {
            // Atmosphere
            return "fog";
        } else if ([1,2].includes(id)) {
            return "clear-day";
        } else if ([3,4,5,6].includes(id)) {
            return "partly-cloudy-day";
        } else if ([7,8].includes(id)) {
            return "cloudy";
        } else if ([33,34].includes(id)) {
            return "clear-night";
        } else if ([35,36].includes(id)) {
            return "partly-cloudy-night";
        } else if ([37,38].includes(id)) {
            return "cloudy";
       // } else if (id >= 800 && id < 810) {
        } else {
            return "";
        }
    },

    /*
      This generates a URL to the icon file
     */
    generateIconSrc: function(icon, mainIcon) {
        if (mainIcon) {
            return this.file("icons/" + this.iconsets[this.config.mainIconset].path + "/" +
                icon + "." + this.iconsets[this.config.mainIconset].format);
        }
        return this.file("icons/" + this.iconsets[this.config.iconset].path + "/" +
            icon + "." + this.iconsets[this.config.iconset].format);
    },

    /*
      When the Skycons animated set is in use, the icons need
      to be rebuilt with each data refresh.  This traverses the
      DOM to find all of the current animated icon canvas elements
      and removes them by id from the skycons object.
     */
    clearIcons: function() {
        this.skycons.pause();
        var self = this;
        var animatedIconCanvases = document.querySelectorAll(".skycon-" + this.identifier);
        animatedIconCanvases.forEach(function(icon) {
            self.skycons.remove(icon.id);
        });
        this.iconIdCounter = 0;
    },

    /*
      When the Skycons animated set is in use, the icons need
      to be rebuilt with each data refresh.  This returns a
      unique id that will be assigned the icon's canvas element.
     */
    getAnimatedIconId: function() {

        //id to use for the canvas element
        var iconId = "skycon_" + this.identifier + "_" + this.iconIdCounter;
        this.iconIdCounter++;
        return iconId;
    },

    /*
      For use with the Skycons animated icon set. Once the
      DOM is updated, the icons are built and set to animate.
      Name is a bit misleading. We needed to wait until
      the canvas elements got added to the DOM, which doesn't
      happen until after updateDom() finishes executing
      before actually drawing the icons.

      This routine traverses the DOM for all canavas elements
      prepared for an animated icon, and adds the icon to the
      skycons object.  Then the icons are played.
    */
    playIcons: function(inst) {
        var animatedIconCanvases = document.querySelectorAll(".skycon-" + inst.identifier);
        animatedIconCanvases.forEach(function(icon) {
            inst.skycons.add(icon.id, icon.getAttribute("data-animated-icon-name"));
        });
        inst.skycons.play();
    },

    /*
      For any config parameters that are expected as integers, this
      routine ensures they are numbers, and if they cannot be
      converted to integers, then the module defaults are used.
     */
    sanitizeNumbers: function(keys) {
        var self = this;
        keys.forEach(function(key) {
            if (isNaN(parseInt(self.config[key]))) {
                self.config[key] = self.defaults[key];
            } else {
                self.config[key] = parseInt(self.config[key]);
            }
        });
    },

    /*
        Calculate a color that is f% between c0 and c1
        c0 = start hex (w/o #), c1 = end hex (w/o #), f is btwn 0 and 1
    */
    interpolateColor: function(c0, c1, f){
        c0 = c0.match(/.{1,2}/g).map((oct)=>parseInt(oct, 16) * (1-f))
        c1 = c1.match(/.{1,2}/g).map((oct)=>parseInt(oct, 16) * f)
        let ci = [0,1,2].map(i => Math.min(Math.round(c0[i]+c1[i]), 255))
        return ci.reduce((a,v) => ((a << 8) + v), 0).toString(16).padStart(6, "0")
    }
});
