// ++++VARIABLES++++
var queryURL;
var cityStr;
var cities = [];
var uvIndex; // Prevents the page from being loaded if the UV hasn't been grabbed
// var currentWeatherObj;
// var lat;
// var lon;

// TARGETS
var cityInput = $("#cityInput");
var citiesField = $(".citiesField");
var citiesList = $(".citiesList")
var searchBtn = $("#searchBtn");
var clearBtn = $("#clearBtn");
// OpenWeather
var APIKey = "8b1406f6dfd91995f05edf59eb9d8b9c";

// ++++BUTTONS++++
// Click Search: Calls getCity() and getWeatherAPIs()
searchBtn.on("click", function(event){
    event.preventDefault();
    var medium = "form";
    // getCity Returns the form's input as ["City Title Case", "CC"]
    var location = getCity(cityInput, medium);
    getWeatherAPIs(location);
})
// Clears input
clearBtn.on("click", function(event){
    event.preventDefault();
    cityInput.val("");
})
// ++++EVENTS++++
// Submit Functionality: Calls getCity() and getWeatherAPIs()
$(".cityForm").on("submit", function(event){
    event.preventDefault();
    var medium = "form";
    // getCity Returns the form's input as ["City Title Case", "CC"]
    var location = getCity(cityInput, medium);
    getWeatherAPIs(location);
});
// POSSIBLY ADD: Clear btn btn event delegation. Prevent bubbling
// Event Delegation for all the city buttons: Calls getWeatherAPIs() if current city doesn't equal button pushed
$(".citiesList").on("click", "button", function( event ){
    event.preventDefault();
    var city = $(this).text();
    var medium = "button";
    if ($(`#cityBoy`).attr("data-city") === city){
        return;
    } else {
        var location = getCity(city, medium);
        getWeatherAPIs(location);
    }

})


// ++++FUNCTIONS++++
// Calls getLocalStorage() and renderButtons()
function init(){
    // alert("Search only cities");
    // Local Storage
    getLocalStorage();
    renderButtons(cities);
    var location = getCity(cities[cities.length-1], "init");
    getWeatherAPIs(location);
};  
function failCallback(){
    console.log("loading");
};
// Data Storage
function getLocalStorage(){
    var fetchedCities = JSON.parse(localStorage.getItem("cities"));
    if(fetchedCities){
        cities = fetchedCities;
    };
};
// A function to put an element in local storage
function setLocalStorage(key, obj){
    var objStr = JSON.stringify(obj)
    localStorage.setItem("cities", JSON.stringify(cities));
    localStorage.setItem(key, objStr);
};
//FIX Add a button that will delete stored buttons
function renderButtons(arr){
    citiesList.empty();
    arr.forEach(function(city){
        // if ($(`.cityBtn`)) // Grab the data name
        // Make a button inside this button to erase the local storage and the button from the html. Prevent bubbling
        var cityBtn = $(`<button type="button" class="btn btn-outline-success cityBtn mb-1" data-name="${city}">${city}</button>`);
        citiesList.prepend(cityBtn);
    });   
};
// Given an input location, the function will call getCurrentWeather and getForecast
function getWeatherAPIs(location){
    var city = location[0];
    var countryCode = location[1];
    getCurrentWeather(city, countryCode);
    getForecast(city, countryCode);
};
// Makes an array title cased
function toTitleCase(wordsArr){
    var wordsTC = [];
    wordsArr.forEach(function(word){
        let wordTC = word.toLowerCase().split("");
        wordTC[0] = wordTC[0].toUpperCase();
        wordsTC.push(wordTC.join(""));
    })
    return wordsTC.join(" ");
}
// Takes the input from the form, returns the result 
function getCity(cityInput, medium){
    if (medium === "form"){
        var location = cityInput.val().trim().split(", ");    
        cityInput.val("");
    // I COULD ADD AN ELSE IF HERE, AND MAKE A CASE IF i WANT TO DELETE A STORAGE
    } else {
        var location = cityInput.trim().split(", ");
    }
    var city = location[0].split(" ");
    var cityTitleCase = toTitleCase(city)
    // Assumes US if no ", " provided
    if ( location[1] !== undefined){
        var country = location[1].toUpperCase();
    } else var country = "US";
    var result = [cityTitleCase, country]
    return result;
}
// AJAX openWeatherAPI call for weather and uv-index, and then createCard()
function getCurrentWeather(city, countryCode){
    // api.openweathermap.org/data/2.5/forecast?q={city name},{country code}
    // United States (get the proper country code)(search cities api)
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&APPID=${APIKey}&units=Imperial`;
    // console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){
        // console.log(response);
        currentWeatherObj = weatherObj(response);
        // Lat and Lon Var to get the UV Index
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var countryCode = response.sys.country;
        var city = response.name;
        var id = response.id;
        var cityFormatted = `${city}, ${countryCode}`;
        // Getting the UV index
        var uvIndex = getUVIndex(lat, lon);
        // Modifying the weather object
        currentWeatherObj.weatherData.uvIndex = uvIndex;
        currentWeatherObj.html = {
            width : 100,
            type : "focus",
            appendTo : ".focusDay",
        };
        currentWeatherObj.location = {
            lon: lon,
            lat: lat,
            country: countryCode,
            city: city,
            id: id,
        };
        // Changing the header
        // Local Storage
        // I shouldn't PUSH UNTIL I KNOW THIS GETS A PROPER LOCATION, but I'm going to do it for now
        if (!cities.includes(cityFormatted)){
            cities.push(cityFormatted);
            renderButtons(cities);
        } else {
            var movingCity = cities.splice(cities.indexOf(cityFormatted), 1);
            cities.push(...movingCity);
            renderButtons(cities);
        };
        setLocalStorage(cityFormatted, currentWeatherObj.location);
        $(".focusDay").empty();
        createCard(currentWeatherObj);
      }, failCallback());
}
//! REFACTOR ME PLEASE
// AJAX openWeatherAPI call for forecast, and parses the the information into day objects with 3-hourly weather data
// Loops through the days and hours to:
// Finds the average temperature/humidity
// Then calls createCard()
function getForecast(city, countryCode){
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&APPID=${APIKey}&units=Imperial`;
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){
        // Initialize
        var timeArr = ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"];
        var days = {};
        var foreCastArr = response.list; 
        // Push dayObj to the days object. Days acquire data for each 3hr increment
        // Have a console.log(inside)
        foreCastArr.forEach(function(hourlyReport){
            var hourlyInfo = weatherObj(hourlyReport);
            var day = hourlyInfo.timeData.day;
            var hour = hourlyInfo.timeData.hour;
            if ( days[day] ){
                // Push information to the day
                days[day][hour] = hourlyInfo
            } else {
                // Create the day
                days[day] = {};
                days[day][hour] = hourlyInfo;
            }
        });
        $(".remaining5Days").empty();
        for (let day in days){
            // Removes the current day from the forecast
            if (day === $(`.w-100`).attr("data-day")){
                continue;
            }
            // Removes day 6 from the forecast
            if (day === moment().add(6, 'days').format("dddd")){
                continue;
            }
            if(days.hasOwnProperty(day)){
                var tempAvg = 0;
                var humidityAvg = 0;
                var iconImageMode = 0;
                var count = 0;
                var iconImageObj = {};
                var currentDay = days[day];
                
                timeArr.forEach(function(hour){
                    if (currentDay[hour] !== undefined){
                        currentDay.useableTime = hour;
                        tempAvg += currentDay[hour].weatherData.temp;
                        humidityAvg += currentDay[hour].weatherData.humidity;
                        //!Under construction. Need to make sure weather.data.weatherDescription is a thing
                        // if (iconImageObj.hasOwnProperty(currentDay[hour].weatherData.weatherDescription)){
                        //     iconImageObj[currentDay[hour].weatherData.weatherDescription] += 1;
                        // } else {
                        //     iconImageObj[currentDay[hour].weatherData.weatherDescription] = 0;
                        // };
                        count++;
                    }
                });

                // After
                tempAvg /= count;
                humidityAvg /= count;
                
                var remaining5Card = currentDay[currentDay.useableTime];
                remaining5Card.weatherData.temp = Math.round(tempAvg);
                remaining5Card.weatherData.humidity = Math.round(humidityAvg);
                
                //!Under Construction
                                // iconImageMode = Object.values(iconImageObj).reduce((a, b) => a > b ? a : b);
                                // var iconKey = findKeyFromValue(iconImageObj, iconImageMode); // This name sucks but I can't think of a better one    
                                // That is a angry bald bearded man, which adequately represent my frustration------------------->   ( >:( ]}
                                // console.log("Icon Key: " + iconKey);
                                // console.log(foreCastArr);
                                // var dailyInfo = weatherObj(foreCastArr[]); // index of the proper days
                                // console.log(currentDay[currentDay.useableTime]);
                                // remaining5Card.weatherData.weatherIcon = iconKey;
                                // console.log("weatherData.icon" + remaining5Card.weatherData.icon); UNDEFINED

                // // remaining5Card.weatherData. = Avg;
                createCard(remaining5Card);
            };
        };
        // days.keys.forEach(function(day){
        //     console.log(day);
        //     // createCard(currentWeatherObj);
        // })
        // Get rid of current day's forecast
        // This is where I need to create cards with the days

      }, failCallback());
}
// AJAX openWeatherAPI call for UVIndex
function getUVIndex(lat, lon){
    var queryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${lat}&lon=${lon}`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        uvIndex = response.value;
        $(`.uvIndexDisp`).text("UV Index: " + uvIndex); 

    }, failCallback());
    return uvIndex;
}
// Confirm this works before resolving the forecast iconImage
function findKeyFromValue(obj, value){
    Object.keys(obj).forEach(function(key){
        if (parseInt(obj[key]) === parseInt(value)){
            return key;
        };
    });
    var result = "No key corresponds to that value."
    return result;
};
// Creates either a focus card or 5 day forecast card
function createCard(object){
    // console.log(`CreateCard Object:`);
    // console.log(object);
    // I'm concerned of having two ids the same
    var column = $(`<div class="col mb-2"></div>`);
    var cardWrapper = $(`<div class="card w-${object.html.width}" data-day="${object.timeData.day}"></div>`);
    var cardBody = $(`<div class="card-body" data-day="${object.timeData.day}"></div>`);
    if (object.html.type === "focus"){
        var row0 = $(`<h3 id="cityBoy" data-city="${object.location.city}, ${object.location.country}">Today in ${object.location.city}, ${object.location.country}</h3>\n<h3>${object.timeData.fullDate}</h3>`);
        var row1 = $(`<h5 class="card-title tempDisp" data-day="${object.timeData.day}">${object.weatherData.weatherIcon}${Math.round(object.weatherData.temp)}°F</h5>`);
        var row2 = $(`<p class="card-text humidityDisp" data-day="${object.timeData.day}">Humidity: ${object.weatherData.humidity}%</p>`);
        var row3 = $(`<p class="card-text windDisp" data-day="${object.timeData.day}">Wind Speed: ${object.weatherData.windSpeed}m/h</p>`);
        var row4 = $(`<p class="card-text uvIndexDisp" data-day="${object.timeData.day}">UV Index: ${object.weatherData.uvIndex}</p>`); // This doesn't always arrive in time
    } else if (object.html.type === "forecast") {
        var row0 = $(`<h5 class="card-text text-center date mb-0" data-day="${object.timeData.day}">Date:</h5>`);
        var row1 = $(`<p class="card-text text-center dateDisp mb-0" data-day="${object.timeData.day}">${object.timeData.shortday} ${object.timeData.dayOfMonth}</p>`);
        var row2 = $(`<p class="card-title text-center iconDisp mb-0" data-day="${object.timeData.day}">${object.weatherData.weatherIcon}</p>`);
        var row3 = $(`<p class="card-text text-center tempDisp mb-0" data-day="${object.timeData.day}">Temp: ${object.weatherData.temp}°F</p>`);
        var row4 = $(`<p class="card-text text-center humidityDisp mb-0" data-day="${object.timeData.day}">RH: ${object.weatherData.humidity}%</p>`);
    };
    // Appending to page
    // $(object.html.appendTo).empty();
    $(column).append(cardWrapper);
    $(cardWrapper).append(cardBody);
    $(cardBody).append(row0);
    $(cardBody).append(row1);
    $(cardBody).append(row2);
    $(cardBody).append(row3);
    $(cardBody).append(row4);
    $(object.html.appendTo).append(column);
}
// Makes a weatherObj with all the information I want from the AJAX call
function weatherObj(reportObj){
    var fcMoment = moment(reportObj.dt_txt);
    // Object with 2 nested objects containing time and weather data
    forecastData = {
        timeData : {
            fullDate: fcMoment.format("LLLL"),
            month: fcMoment.format("MMM"),
            dayOfMonth : fcMoment.format("DD"),
            shortday : fcMoment.format("ddd"),
            day : fcMoment.format("dddd"),
            hour : fcMoment.format("hA"),
        },
        weatherData : {
            temp : reportObj.main.temp,
            temp_min : reportObj.main.temp_min,
            temp_max : reportObj.main.temp_max,
            humidity : reportObj.main.humidity,
            weatherIcon : `<img src="https://openweathermap.org/img/wn/${reportObj.weather[0].icon}@2x.png" />`,
            weatherDescription: reportObj.weather.description,
            windSpeed : reportObj.wind.speed,
        },
        html : {
            appendTo: ".remaining5Days",
            type: "forecast",
            width : 20,
        },
    };
    return forecastData;
}



init();

