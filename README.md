# MMM-AccuWeatherForecastDeluxe

Known bugs:
<ul>
	<li>Setting showWindDirection and showWindGust to <code>true</code> breaks the layout in tile mode</li>
</ul>


This is a [MagicMirror²](https://magicmirror.builders) module that displays current, hourly and daily forecast information using data from the [AccuWeather](https://www.accuweather.com).

| Tiled Layouts | Bars Layout (daily forecast only) |
| --- | --- |
| ![Tiled Layouts](/screenshots/layouts-tiled.png?raw=true "Tiled Lauouts") | ![Bars Layout (daily forecast only)](/screenshots/layout-bars-daily.png?raw=true "Bars Layout (daily forecast only)") |

## Installation

1. Navigate into your MagicMirror's `modules` folder and execute
   `git clone https://github.com/BigBot89/MMM-AccuWeatherForecastDeluxe`.
2. Enter the new `MMM-AccuWeatherForecastDeluxe` directory and execute
   `npm install`.

## Configuration

At a minimum you need to supply the following required configuration parameters:

- `apikey`
- `locationKey`

You can request an API key to access data here:
<https://developer.accuweather.com/packages>

AccuWeather free tier no longer allows 1000 requests per day but instead limits you to 50.
Free tier is fine -- by itself, a single instance of this module will not make 50 requests in one day with the default `updateInterval` of `120`. However, if the `updateInterval` is more frequent, create another Accuweather account to get a second API key and add to `apiKey2`.

Find the locationKey using the Accuweather search API
<http://dataservice.accuweather.com/locations/v1/cities/search?apikey={apiKey}&q={cityName}>

### Sample Configuration

```JavaScript
{
  module: "MMM-AccuWeatherForecastDeluxe",
  header: "Tiled Layouts",
  position: "top_right",
  classes: "default everyone",
  disabled: false,
  config: {
    apikey: "SUPER SECRET!!!",
    apikey2: "SUPER SECRET!!!",
    locationKey: "337209",
    hourlyForecastInterval: 2,
    maxDailiesToShow: 3,
    ignoreToday: true,
    showDayAsTomorrowInDailyForecast: true,
    showPrecipitationProbability: false,
    iconset: "4c",
    label_high: "",
    label_low: "",
  }
},
```

More example configurations below in [Layouts and Configs](#layouts-and-configs)

### Using Multiple Instances

Using increasingly larger `requestDelay` values can help prevent the API calls of multiple instances from being too close together, but ultimately each instance will make it's own api calls, which when combined with other modules that might use the same API, can threaten your rate limit.

You can use the `listenerOnly` option with multiple instances, so that only a primary one makes API calls, and other `listenerOnly` instances strictly do not, and instead receive notifications broadcasted with the api's payload whenever the primary instance gets its data. `listenerOnly` instances will not use/do not need the `apikey`, `latitude`, `longitude`, `endpoint`, `updateInterval` or `requestDelay` paremeters.

### Optional Parameters

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>endpoint</code></td>
      <td>The URL of the accuweather api; a free subscription with a limited quota and can be used with <code>http://dataservice.accuweather.com</code><br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>http://dataservice.accuweather.com</code></td>
    </tr>
    <tr>
      <td><code>updateInterval</code></td>
      <td>How frequently, in minutes, to poll for data. Be careful not to set this too frequent so that you don't exceed the 50 free requests per day cap. (†SEE NOTE ABOUT MULTIPLE INSTANCES)<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>10</code></td>
    </tr>
    <tr>
      <td><code>requestDelay</code></td>
      <td>In milliseconds, how long to delay the request.  If you have multiple instances of the module running, set one of them to a delay of a second or two to keep the API calls from being too close together.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>250</code></td>
    </tr>
    <tr>
      <td><code>listenerOnly</code></td>
      <td>For use with multiple instances of this module; set this to <code>true</code> on subsequent instances and they will not make any api calls. They will receive updated weather payloads when an instance of this module with the default <code>listenerOnly: false</code> value makes an api call.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>false</code></td>
    </tr>
    <tr>
      <td><code>updateFadeSpeed</code></td>
      <td>How quickly in milliseconds to fade the module out and in upon data refresh.  Set this to <code>0</code> for no fade.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>500</code> (i.e.: 1/2 second).</td>
    </tr>
    <tr>
      <td><code>units</code></td>
      <td>One of the following: <code>imperial</code>, <code>metric</code>.<br><br><strong>Type</strong> <code>String</code><br>Defaults to units set for MagicMirror².<br />See also: <a href="https://openweathermap.org/api/one-call-api#data">details on units</a>.</td>
    </tr>
    <tr>
      <td><code>language</code></td>
      <td>The language to be used for display.<br><br><strong>Type</strong> <code>String</code><br>Defaults to the language set for MagicMirror², but can be overridden with any of the available <a href="https://openweathermap.org/api/one-call-api#multi">language codes</a>.</td>
    </tr>
    <tr>
      <td><code>colored</code></td>
      <td>Whether to present module in colour or black-and-white.  Note, if set to <code>false</code>, the monochramtic version of your chosen icon set will be forced if it exist.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>highColor</code></td>
      <td>The color to use for the current and daily forecast high temperatures.<br><br><strong>Type</strong> <code>String/hex color</code><br>Defaults to <code>'#F8DD70'</code></td>
    </tr>
    <tr>
      <td><code>lowColor</code></td>
      <td>The color to use for the current and daily forecast low temperatures.<br><br><strong>Type</strong> <code>String/hex color</code><br>Defaults to <code>'#6FC4F5'</code></td>
    </tr>
    <tr>
      <td><code>relativeColors</code></td>
      <td>If set to <code>true</code>, the daily forecast high and low temps (and bars) will be colored relative to the overall high and low for the range of days.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>false</code></td>
    </tr>
    <tr>
      <td><code>showCurrentConditions</code></td>
      <td>Whether to show current temperaure and current conditions icon.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showExtraCurrentConditions</code></td>
      <td>Whether to show additional current conditions such as high/low temperatures, precipitation and wind speed.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showSummary</code></td>
      <td>Whether to show the forecast summary. See the <a href="https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2">full list</a>.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>hourlyForecastHeaderText</code></td>
      <td>Show a header above the hourly forecast display.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>""</code></td>
    </tr>
    <tr>
      <td><code>showForecastTableColumnHeaderIcons</code></td>
      <td>Whether to show icons column headers on the forecast table.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showHourlyForecast</code></td>
      <td>Whether to show hourly forecast information. when set to <code>true</code> it works with the <code>hourlyForecastInterval</code> and <code>maxHourliesToShow</code> parameters.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>hourlyForecastLayout</code></td>
      <td>Can be set to <code>table</code> or <code>tiled</code>. How to display hourly and forecast information. See below for <a href="#layouts-and-configs">screenshot examples</a> of each.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>tiled</code></td>
    </tr>
    <tr>
      <td><code>hourlyForecastInterval</code></td>
      <td>How many hours apart each listed hourly forecast is.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>3</code></td>
    </tr>
    <tr>
      <td><code>maxHourliesToShow</code></td>
      <td>How many hourly forecasts to list.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>3</code></td>
    </tr>
    <tr>
      <td><code>dailyForecastHeaderText</code></td>
      <td>Show a header above the daily forecast display.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>""</code></td>
    </tr>
    <tr>
      <td><code>showDailyForecast</code></td>
      <td>Whether to show daily forecast information. when set to <code>true</code> it works with the <code>maxDailiesToShow</code> parameter.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>dailyForecastLayout</code></td>
      <td>Can be set to <code>bars</code>, <code>table</code> or <code>tiled</code>. How to display hourly and forecast information.  See below for <a href="#layouts-and-configs">screenshot examples</a> of each.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>tiled</code></td>
    </tr>
    <tr>
      <td><code>maxDailiesToShow</code></td>
      <td>How many daily forecasts to list.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>3</code></td>
    </tr>
    <tr>
      <td><code>ignoreToday</code></td>
      <td>If set to <code>true</code>, today's weather will not be displayed in daily forecast. <br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>false</code></td>
    </tr>
    <tr>
      <td><code>showDailyLow</code></td>
      <td>Show the day's low temperature in the daily forecast and current conditions.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showDailyHiLowSeparator</code></td>
      <td>Show the <code>label_hi_lo_separator</code> between the daily forecast's high and low temperatures.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showDayAsTodayInDailyForecast</code></td>
      <td>Show today's day as <code>label_today</code> in daily forecast.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>false</code></td>
    </tr>
    <tr>
      <td><code>showDayAsTomorrowInDailyForecast</code></td>
      <td>Show tomorrow's day as <code>label_tomorrow</code> in daily forecast.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>false</code></td>
    </tr>
    <tr>
      <td><code>showFeelsLike</code></td>
      <td>Whether to show the temperature parameter that accounts for human perception of weather in the current conditions. (<a href="https://openweather.co.uk/blog/post/new-feels-temperature-openweather-apis">More info</a>)<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showPrecipitationProbability</code></td>
      <td>Whether to show precipitation probability. This affects current conditions, hourly and daily forecasts<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showPrecipitationSeparator</code></td>
      <td>Whether to show <code>label_precip_separator</code> between the probability and the amount. This affects current conditions, hourly and daily forecasts<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showPrecipitationAmount</code></td>
      <td>Whether to show precipitation accumulation. This affects current conditions, hourly and daily forecasts<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showWindSpeed</code></td>
      <td>Whether to show wind speed. This affects current conditions, hourly and daily forecasts<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showWindDirection</code></td>
      <td><strong>Setting this to <code>true</code> breaks the layout. Will fix later.</strong><p>Whether to show wind direction. This affects current conditions, hourly and daily forecasts<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showWindGust</code></td>
      <td><strong>Setting this to <code>true</code> breaks the layout. Will fix later.</strong><p>Whether to show wind gust information. This affects current conditions, hourly and daily forecasts<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>iconset</code></td>
      <td>Which icon set to use. See below for [previews of the icon sets](README.md#icon-sets).<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>1c</code></td>
    </tr>
    <tr>
      <td><code>mainIconset</code></td>
      <td>Which icon set to use for current weather. See below for [previews of the icon sets](#Icon Sets).<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>iconset value</code></td>
    </tr>
    <tr>
      <td><code>useAnimatedIcons</code></td>
      <td> ***<strong>LEGACY, please use icon set '6fa' or '6oa' for animated icons***</strong> <p>Whether to use the Dark Sky's own animated icon set.  When set to true, this will override your choice for <code>iconset</code>. However, flat icons will still be used in some instances.  For example if you set the <code>animateMainIconOnly</code> parameter to true, daily and hourly forecasts will not be animated and instead will use your choice for <code>iconset</code>.  Inline icons (i.e. used to prefix precipitation and wind information) will always be flat.  A good <code>iconset</code> match for the animated set is <code>1c</code>.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>false</code></td>
    </tr>
    <tr>
      <td><code>animateMainIconOnly</code></td>
      <td> ***<strong>LEGACY, please use icon set '6fa' or '6oa' for animated icons***</strong> <p></p>When set to <code>true</code>, only the main current conditions icon is animated. The rest use your choice for <code>iconset</code> (<code>1c</code> is a good match for the animated icon).  If you are running on a low-powered device like a Raspberry Pi, performance may suffer if you set this to <code>false</code>.  In my testing on a Pi 3b, enabling this ramped up CPU temperature by 15° - 20°, and fade transitions were not smooth.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>false</code></td>
    </tr>
    <tr>
      <td><code>showInlineIcons</code></td>
      <td>Whether to prefix wind and precipitation information with an icon.  Only affects the <code>tiled</code> layout.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>mainIconSize</code></td>
      <td>The square pixel size of the weather icon in the current conditions.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>100</code></td>
    </tr>
    <tr>
      <td><code>forecastTiledIconSize</code></td>
      <td>The square pixel size of the weather icon in the <code>tiled</code> layouts.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>70</code></td>
    </tr>
    <tr>
      <td><code>forecastTableIconSize</code></td>
      <td>The square pixel size of the weather icon in the <code>table</code> and <code>bars</code> layouts.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>30</code></td>
    </tr>
    <tr>
      <td><code>showAttribution</code></td>
      <td>Whether to include attribution at the bottom of the module for the data source (Powered by OpenWeather)<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
  </tbody>
</table>

### Units & Labels

Accuweather supports imperial and metric units. Be aware of the `unit` option above, which defaults to the units set for MagicMirror².

If you want a space before or after the label, include it here.

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>label_temp_i</code></td>
      <td>The label you wish to display following imperial/fahrenheit temperatures.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"°"</code></td>
    </tr>
    <tr>
      <td><code>label_temp_m</code></td>
      <td>The label you wish to display following metric/celcius temperatures.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"°"</code></td>
    </tr>
    <tr>
      <td><code>label_maximum</code></td>
      <td>The label you wish to display for prefixing wind gusts.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"max "</code>.</td>
    </tr>
    <tr>
      <td><code>label_high</code></td>
      <td>The label you wish to display for prefixing high temperature.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"H "</code></td>
    </tr>
    <tr>
      <td><code>label_low</code></td>
      <td>The label you wish to display for prefixing low temperature.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"L "</code></td>
    </tr>
    <tr>
      <td><code>label_hi_lo_separator</code></td>
      <td>The label between high and low temperatures.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>" / "</code></td>
    </tr>
    <tr>
      <td><code>label_feels_like</code></td>
      <td>The label that preceeds the "feels like" temperature.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"Feels like "</code></td>
    </tr>
    <tr>
      <td><code>label_timeFormat</code></td>
      <td>How you want the time formatted for hourly forecast display.  Accepts any valid <a href="https://momentjs.com/docs/#/displaying/format/">moment.js format</a>. For example, specify short 24h format with <code>"k[h]"</code> (e.g.: <code>14h</code>)<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"h a"</code> (e.g.: <code>9 am</code>)</td>
    </tr>
    <tr>
      <td><code>label_days</code></td>
      <td>How you would like the days of the week displayed for daily forecasts.  Assumes index <code>0</code> is Sunday.<br><br><strong>Type</strong> <code>Array of Strings</code><br>Defaults to <code>["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]</code></td>
    </tr>
    <tr>
      <td><code>label_today</code></td>
      <td>The label you wish to use for today in daily forecast when <code>showDayAsTodayInDailyForecast</code> is <code>true</code>.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"Today"</code></td>
    </tr>
    <tr>
      <td><code>label_tomorrow</code></td>
      <td>The label you wish to use for tomorrow in daily forecast when <code>showDayAsTomorrowInDailyForecast</code> is <code>true</code>.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"Tomorrow"</code></td>
    </tr>
    <tr>
      <td><code>label_ordinals</code></td>
      <td>How you would like wind direction to be displayed.  Assumes index <code>0</code> is North and proceeds clockwise.<br><br>Meteorological wind direction is defined as the direction from which it originates. Hence, a wind coming from the south has a wind direction of 180 degrees; one from the east is 90.<br><br><strong>Type</strong> <code>Array of Strings</code><br>Defaults to <code>["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]</code></td>
    </tr>
    <tr>
      <td><code>label_rain_i</code></td>
      <td>The imperial unit label for rain accumulation.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>" in"</code></td>
    </tr>
    <tr>
      <td><code>label_rain_m</code></td>
      <td>The metric unit label for rain accumulation.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>" mm"</code></td>
    </tr>
    <tr>
      <td><code>label_snow_i</code></td>
      <td>The imperial unit label for snow accumulation.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>" in"</code></td>
    </tr>
    <tr>
      <td><code>label_snow_m</code></td>
      <td>The metric unit label for snow accumulation.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>" mm"</code></td>
    </tr>
    <tr>
      <td><code>label_wind_i</code></td>
      <td>The imperial unit label for wind speed.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>" mph"</code></td>
    </tr>
    <tr>
      <td><code>label_wind_m</code></td>
      <td>The metric unit label for wind speed.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>" m/s"</code></td>
    </tr>
    <tr>
      <td><code>label_gust_i</code></td>
      <td>The imperial unit label for wind gust.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>" mph"</code></td>
    </tr>
    <tr>
      <td><code>label_gust_m</code></td>
      <td>The metric unit label for wind gust.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>" m/s"</code></td>
    </tr>
    <tr>
      <td><code>label_no_precip</code></td>
      <td>The value to show instead of 0% precipitation.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"—"</code></td>
    </tr>
    <tr>
      <td><code>label_no_wind</code></td>
      <td>The value to show instead of 0(wind units).<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"—"</code></td>
    </tr>
    <tr>
      <td><code>label_precip_separator</code></td>
      <td>The label to show between precipitation probability and amount.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>" "</code></td>
    </tr>
    <tr>
      <td><code>label_gust_wrapper_prefix</code></td>
      <td>The label that preceeds the wind gust.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>" ("</code></td>
    </tr>
    <tr>
      <td><code>label_gust_wrapper_suffix</code></td>
      <td>The label that follows the wind gust.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>")"</code></td>
    </tr>
  </tbody>
</table>

### Decimal Precision

Options for specifying the decimal precision for various measurements. OpenWeather's data is typically up to 2 decimal places, so the useful integer values are from <code>0</code> to <code>2</code>.

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>dp_precip_leading_zero</code></td>
      <td>Whether to include the leading zero for precipitation amount.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>false</code></td>
    </tr>
    <tr>
      <td><code>dp_wind_leading_zero</code></td>
      <td>Whether to include the leading zero for wind measurements.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>false</code></td>
    </tr>
    <tr>
      <td><code>dp_rain_i</code></td>
      <td>Decimal precision for imperial rain accumulation (in inches)<br><br><strong>Type</strong> <code>Integer</code><br>Defaults to <code>2</code></td>
    </tr>
    <tr>
      <td><code>dp_rain_m</code></td>
      <td>Decimal precision for metric rain accumulation (in millimeters) <br><br><strong>Type</strong> <code>Integer</code><br>Defaults to <code>0</code></td>
    </tr>
    <tr>
      <td><code>dp_snow_i</code></td>
      <td>Decimal precision for imperial snow accumulation (in inches)<br><br><strong>Type</strong> <code>Integer</code><br>Defaults to <code>2</code></td>
    </tr>
    <tr>
      <td><code>dp_snow_m</code></td>
      <td>Decimal precision for metric snow accumulation (in millimeters)<br><br><strong>Type</strong> <code>Integer</code><br>Defaults to <code>0</code></td>
    </tr>
    <tr>
      <td><code>dp_temp_i</code></td>
      <td>Decimal precision for imperial/fahrenheit temperatures<br><br><strong>Type</strong> <code>Integer</code><br>Defaults to <code>0</code></td>
    </tr>
    <tr>
      <td><code>dp_temp_m</code></td>
      <td>Decimal precision for metric/celcius temperatures<br><br><strong>Type</strong> <code>Integer</code><br>Defaults to <code>0</code></td>
    </tr>
    <tr>
      <td><code>dp_wind_i</code></td>
      <td>Decimal precision for imperial wind speeds (in miles per hour)<br><br><strong>Type</strong> <code>Integer</code><br>Defaults to <code>0</code></td>
    </tr>
    <tr>
      <td><code>dp_wind_m</code></td>
      <td>Decimal precision for metric wind speds (in meters per second) <br><br><strong>Type</strong> <code>Integer</code><br>Defaults to <code>0</code></td>
    </tr>
  </tbody>
</table>

## Icon Sets

![Icon Sets](icons/iconsets.gif?raw=true "Icon Sets")

## Layouts and Configs

![Table Layouts](/screenshots/layouts-table.png?raw=true "Table Layouts")

```JavaScript
{
  module: "MMM-AccuWeatherForecastDeluxe",
  header: "Table Layouts",
  position: "top_right",
  classes: "default everyone",
  disabled: false,
  config: {
    apikey: "SUPER SECRET!!!",
    apikey2: "SUPER SECRET!!!",
    locationKey: "123456",
    relativeColors: true,
    hourlyForecastLayout: "table",
    maxHourliesToShow: 5,
    dailyForecastLayout: "table",
    maxDailiesToShow: 5,
    ignoreToday: true,
    showPrecipitationProbability: false,
    showPrecipitationSeparator: false,
    iconset: "4c",
    label_ordinals: ['↓', '↙', '←', '↖', '↑', '↗', '→', '↘'],
    label_high: "",
    label_low: "",
  }
},
```

![Bars Layout (daily forecast only)](/screenshots/layout-bars-daily.png?raw=true "Bars Layout (daily forecast only)")

```JavaScript
{
  module: "MMM-AccuWeatherForecastDeluxe",
  header: "Bars Layout (daily forecast only)",
  position: "top_right",
  classes: "default everyone",
  disabled: false,
  config: {
    apikey: "SUPER SECRET!!!",
    apikey2: "SUPER SECRET!!!",
    locationKey: "123456",
    relativeColors: true,
    showCurrentConditions: false,
    showExtraCurrentConditions: false,
    showSummary: false,
    showForecastTableColumnHeaderIcons: false,
    showHourlyForecast: false,
    dailyForecastLayout: 'bars',
    maxDailiesToShow: 8,
    showPrecipitationProbability: false,
    showPrecipitationSeparator: false,
    showPrecipitationAmount: false,
    showWindSpeed: false,
    iconset: "4c",
    label_high: "",
    label_low: "",
  }
},
```

![Bars Layout (colored; false)](/screenshots/layout-bars-nocolor.png?raw=true "Bars Layout (colored: false)")

```JavaScript
{
  module: "MMM-AccuWeatherForecastDeluxe",
  header: "Bars Layout (colored: false)",
  position: "top_right",
  classes: "default everyone",
  disabled: false,
  config: {
    apikey: "SUPER SECRET!!!",
    apikey2: "SUPER SECRET!!!",
    locationKey: "123456",
    colored: false,
    showCurrentConditions: false,
    showExtraCurrentConditions: false,
    showSummary: false,
    showForecastTableColumnHeaderIcons: false,
    showHourlyForecast: false,
    dailyForecastLayout: 'bars',
    maxDailiesToShow: 8,
    showPrecipitationProbability: false,
    showPrecipitationSeparator: false,
    showPrecipitationAmount: false,
    showWindSpeed: false,
    iconset: "3m",
    label_high: "",
    label_low: "",
  }
},
```

![Tiled Layouts](/screenshots/layouts-tiled.png?raw=true "Tiled Layouts")

```JavaScript
{
  module: "MMM-AccuWeatherForecastDeluxe",
  header: "Tiled Layouts",
  position: "top_right",
  classes: "default everyone",
  disabled: false,
  config: {
    apikey: "SUPER SECRET!!!",
    apikey2: "SUPER SECRET!!!",
    locationKey: "123456",
    hourlyForecastInterval: 2,
    maxDailiesToShow: 3,
    ignoreToday: true,
    showDayAsTomorrowInDailyForecast: true,
    showPrecipitationProbability: false,
    iconset: "4c",
    label_high: "",
    label_low: "",
  }
},
```

## Styling

This module is set to be 300px wide by default. If you wish to override it, you can add the following to your `custom.css` file:

```css
.MMM-AccuWeatherForecastDeluxe .module-content {
  width: 500px; /* adjust this to taste */
}
```

Most important elements of this module have one or more class names applied. Examine the `MMM-AccuWeatherForecastDeluxe.css` or inspect elements directly with your browser of choice to determine what class you would like to override.

## For Module Developers

This module broadcasts a notification when it recieves a weather update. The notification is `ACCUWEATHER_ONE_CALL_FORECAST_DATA` and the payload contains OpenWeather's JSON weather forecast object. For details on the weather object, see <https://openweathermap.org/api/one-call-api>.

## Attributions

This module has a heritage: [learn more](https://github.com/luxiouronimo/MMM-OpenWeatherForecastDeluxe/network/members)!

**Skycons - Animated icon set by Dark Sky**<br />
<http://darkskyapp.github.io/skycons/><br />
(using the fork created by Maxime Warner
that allows individual details of the icons
to be coloured<br />
<https://github.com/maxdow/skycons>)

**Climacons by Adam Whitcroft**<br />
<http://adamwhitcroft.com/climacons/>

**Free Weather Icons by Svilen Petrov**<br />
<https://www.behance.net/gallery/12410195/Free-Weather-Icons>

**Weather Icons by Thom**<br />
(Designed for DuckDuckGo)<br />
<https://dribbble.com/shots/1832162-Weather-Icons>
	
**Fire Icon by RemixIcon<br />
<https://www.iconfinder.com/remix-icon>

Sets 4 and 5 were found on Graphberry, but I couldn't find
the original artists.<br />
<https://www.graphberry.com/item/weather-icons><br />
<https://www.graphberry.com/item/weathera-weather-forecast-icons>

Some of the icons were modified to better work with the module's
structure and aesthetic.

**Weather data provided by AccuWeather**<br />
<https://www.accuweather.com>

