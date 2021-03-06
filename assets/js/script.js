var cityEl = $('#cityList');
var nameEl = $('#cityName');
var iconEl = $('#weatherSymbol');
var tempEl = $('#currentTemp');
var humidEl = $('#currentHumidity');
var windEl = $('#currentWind');
var uvEl = $('#currentUv');
var searchEl = $('#searchButton');
var cityinputEl = $('#citySearch');



function createCityList(citySearchList) {
  cityEl.empty();

  var keys = Object.keys(citySearchList);
  for (var i = 0; i < keys.length; i++) {
    var cityListEntry = $("<button>");
    cityListEntry.addClass("list-group-item list-group-item-action");

    var splitStr = keys[i].toLowerCase().split(" ");
    for (var j = 0; j < splitStr.length; j++) {
      splitStr[j] =
        splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
    }
    var titleCasedCity = splitStr.join(" ");
    cityListEntry.text(titleCasedCity);

    cityEl.append(cityListEntry);
  }
}

function populateCityWeather(city, citySearchList) {
  createCityList(citySearchList);

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=822ef553421feedd018d9f764f368fa3&q=" +
    city;

  var queryURL2 =
    "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=822ef553421feedd018d9f764f368fa3&q=" +
    city;

  var latitude;

  var longitude;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // Store all of the retrieved data inside of an object called "weather"
    .then(function(weather) {
      // Log the queryURL
      console.log(queryURL);

      // Log the resulting object
      console.log(weather);

      var nowMoment = moment();

      var displayMoment = $("<h3>");
      nameEl.empty();
      nameEl.append(
        displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")")
      );

      var cityName = $("<h3>").text(weather.name);
      nameEl.prepend(cityName);

      var weatherIcon = $("<img>");
      weatherIcon.attr(
        "src",
        "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
      );
      iconEl.empty();
      iconEl.append(weatherIcon);

      tempEl.text("Temperature: " + weather.main.temp + " ??F");
      humidEl.text("Humidity: " + weather.main.humidity + "%");
      windEl.text("Wind Speed: " + weather.wind.speed + " MPH");

      latitude = weather.coord.lat;
      longitude = weather.coord.lon;

      var queryURL3 =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=822ef553421feedd018d9f764f368fa3&q=" +
        "&lat=" +
        latitude +
        "&lon=" +
        longitude;

      $.ajax({
        url: queryURL3,
        method: "GET"
        // Store all of the retrieved data inside of an object called "uvIndex"
      }).then(function(uvIndex) {
        console.log(uvIndex);

        var uvIndexDisplay = $("<button>");
        uvIndexDisplay.addClass("btn btn-danger");

        uvEl.text("UV Index: ");
        uvEl.append(uvIndexDisplay.text(uvIndex[0].value));
        console.log(uvIndex[0].value);

        $.ajax({
          url: queryURL2,
          method: "GET"
          // Store all of the retrieved data inside of an object called "forecast"
        }).then(function(forecast) {
          console.log(queryURL2);

          console.log(forecast);
          // Loop through the forecast list array and display a single forecast entry/time (5th entry of each day which is close to the highest temp/time of the day) from each of the 5 days
          for (var i = 6; i < forecast.list.length; i += 8) {
            // 6, 14, 22, 30, 38
            var forecastDate = $("<h5>");

            var forecastPosition = (i + 2) / 8;

            console.log("#date" + forecastPosition);

            $("#date" + forecastPosition).empty();
            $("#date" + forecastPosition).append(
              forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY"))
            );

            var forecastIcon = $("<img>");
            forecastIcon.attr(
              "src",
              "https://openweathermap.org/img/w/" +
                forecast.list[i].weather[0].icon +
                ".png"
            );

            $("#icon" + forecastPosition).empty();
            $("#icon" + forecastPosition).append(forecastIcon);

            console.log(forecast.list[i].weather[0].icon);

            $("#temp" + forecastPosition).text(
              "Temp: " + forecast.list[i].main.temp + " ??F"
            );
            $("#humidity" + forecastPosition).text(
              "Humidity: " + forecast.list[i].main.humidity + "%"
            );

            $(".forecast").attr(
              "style",
              "background-color:lightblue; color:white"
            );
          }
        });
      });
    });
}

$(document).ready(function() {
  var citySearchListStringified = localStorage.getItem("citySearchList");

  var citySearchList = JSON.parse(citySearchListStringified);

  if (citySearchList == null) {
    citySearchList = {};
  }

  createCityList(citySearchList);

  $("#current-weather").hide();
  $("#forecast-weather").hide();



  searchEl.on("click", function(event) {
    event.preventDefault();
    var city = cityinputEl
      .val()
      .trim()
      .toLowerCase();

    if (city != "") {
      //Check to see if there is any text entered
    
      citySearchList[city] = true;
    localStorage.setItem("citySearchList", JSON.stringify(citySearchList));

    populateCityWeather(city, citySearchList);

    $("#current-weather").show();
    $("#forecast-weather").show();
    }

    
  });

  cityEl.on("click", "button", function(event) {
    event.preventDefault();
    var city = $(this).text();

    populateCityWeather(city, citySearchList);

    $("#current-weather").show();
    $("#forecast-weather").show();
  });
});