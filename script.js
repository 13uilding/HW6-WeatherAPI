// ++++VARIABLES++++
var queryURL;
var cityStr;
var cities = [];
var uvIndex;
var currentWeatherObj;
var lat;
var lon;

// TARGETS
var currentlyDisplayingHeader = $("h3.currentlyDisplaying");
// City
var cityInput = $("#cityInput");
var citiesField = $(".citiesField");
var citiesList = $(".citiesList")
var searchBtn = $("#searchBtn");
var clearBtn = $("#clearBtn");
// OpenWeather
var APIKey = "8b1406f6dfd91995f05edf59eb9d8b9c";

// ++++BUTTONS++++
//FIX
searchBtn.on("click", function(event){
    event.preventDefault();
    console.log("fix me: Make a single function to handle this and submit event")


})
clearBtn.on("click", function(event){
    event.preventDefault();
    cityInput.val("");
})

// ++++EVENTS++++
//FIX
$(".cityForm").on("submit", function(event){
    event.preventDefault();
    var location = cityUpdate();
    var city = location[0];
    var countryCode = location[1];
    getCurrentWeather(city, countryCode);
    getForecast(city, countryCode);
    renderButtons(cities); // Will move this out of here. Want to make sure the call was a success first

});
//FIX
$(".citiesList").on("click", "button", function( event ){
    event.preventDefault();
    var city = $(this).text();
    console.log( $(this).text() );
})


// FUNCTIONS
//FIX
function init(){
    // alert("Search only cities");
    renderButtons(cities);
};  
//FIX
function renderButtons(arr){
    citiesList.empty();
    arr.forEach(function(city){
        // Make a button inside this button to erase the local storage and the button from the html. Prevent bubbling
        var cityBtn = $(`<button type="button" class="btn btn-outline-success cityBtn mb-1" data-name="${city}">${city}</button>`);
        citiesList.prepend(cityBtn);
    });   
}
function toTitleCase(wordsArr){
    var wordsTC = [];
    wordsArr.forEach(function(word){
        let wordTC = word.toLowerCase().split("");
        wordTC[0] = wordTC[0].toUpperCase();
        wordsTC.push(wordTC.join(""));
    })
    return wordsTC.join(" ");
}
function cityUpdate(){
    // User error. DK example
    var location = cityInput.val().trim().split(", ");
    // Title Case
    var city = location[0].split(" ");
    var cityTitleCase = toTitleCase(city)
    if ( location[1] !== undefined){
        var country = location[1].toUpperCase();
    } else {
        var country = "US"
    }
    cityInput.val("");
    cities.push(`${cityTitleCase}, ${country}`);
    var result = [cityTitleCase, country]
    return result;
}
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
        currentlyDisplayingHeader.text(`${city}, ${countryCode}`)
        
        $(".focusDay").empty();
        createCard(currentWeatherObj);
        console.log("Current Weather Response:");
        console.log(response);

      });
}
function getForecast(city, countryCode){
    // api.openweathermap.org/data/2.5/forecast?q={city name},{country code}
    // United States (get the proper country code)(search cities api?)
    // Need to add that functionality
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&APPID=${APIKey}&units=Imperial`;
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){
        // Initialize
        var timeArr = ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"];
        var days = {};
        var foreCastArr = response.list; 
        // Grab all of the hourly reports and store 
        foreCastArr.forEach(function(hourlyReport){
            var hourlyInfo = weatherObj(hourlyReport);
            // console.log(hourlyInfo);
            var day = hourlyInfo.timeData.day;
            var hour = hourlyInfo.timeData.hour;
            if ( days[day] ){
                // // Push information to the day
                // days[day][hour] = hourlyInfo.weatherData;
                days[day][hour] = hourlyInfo
            } else {
                // Create the day
                days[day] = {};
                // days[day][hour] = hourlyInfo.weatherData;
                days[day][hour] = hourlyInfo;
            }
        });
        console.log("Forecast Days:");
        console.log(days);
        $(".remaining5Days").empty();
        for (let day in days){
            console.log(day);
            if(days.hasOwnProperty(day)){
                // console.log(days[day]);
                var tempAvg = 0;
                var humidityAvg = 0;
                var iconImageMode = 0
                var count = 0;
                var iconImageObj = {};
                var currentDay = days[day];
                
                timeArr.forEach(function(hour){
                    if (currentDay[hour] !== undefined){
                        // console.log(currentDay[hour]);
                        currentDay.useableTime = hour;
                        // console.log(currentDay.useableTime);
                        tempAvg += currentDay[hour].weatherData.temp;
                        humidityAvg += currentDay[hour].weatherData.humidity;
                        if (iconImageObj.hasOwnProperty(currentDay[hour].weatherData.weatherIcon)){
                            iconImageObj[currentDay[hour].weatherData.weatherIcon] += 1;
                        } else {
                            iconImageObj[currentDay[hour].weatherData.weatherIcon] = 0;
                        };
                        count++;
                    }
                });

                // After
                tempAvg /= count;
                humidityAvg /= count;
                iconImageMode = Object.values(iconImageObj).reduce((a, b) => a > b ? a : b);

                // console.log(foreCastArr);
                // var dailyInfo = weatherObj(foreCastArr[]); // index of the proper days

                console.log(currentDay[currentDay.useableTime]);
                // console.log(`Day: ${day} Values:`)
                // console.log(iconImageMode);
                // console.log(tempAvg);
                // console.log(humidityAvg);

                
                // This changes the data of the last useable timeslot so that Will need to be fixed if I want to display graphs in the future
                // I could create 
                var remaining5Card = currentDay[currentDay.useableTime];
                remaining5Card.weatherData.temp = Math.round(tempAvg);
                remaining5Card.weatherData.humidity = Math.round(humidityAvg);
                // // remaining5Card.weatherData. = Avg;
                createCard(remaining5Card);
            };
        };
        // days.keys.forEach(function(day){
        //     console.log(day);
        //     // createCard(currentWeatherObj);
        // })
        // console.log("done making the card");
        // Get rid of current day's forecast
        // console.log(days.keys);
        // This is where I need to create cards with the days
        // console.log(days);

      });
}
function createCard(object){
    console.log(`CreateCard Object:`);
    console.log(object);
    // I'm concerned of having two ids the same
    var column = $(`<div class="col mb-2"></div>`);
    var cardWrapper = $(`<div class="card w-${object.html.width}" id="${object.timeData.day}"></div>`);
    var cardBody = $(`<div class="card-body" id="${object.timeData.day}"></div>`);
    if (object.html.type === "focus"){
        // var row0 = $(``);
        var row0 = $(`<h3 id="${object.timeData.day}">${object.location.city}, ${object.location.country}</h3>\n<h3>${object.timeData.fullDate}</h3>`);
        // var row0 = $(`<h3 id="${object.timeData.day}">${object.timeData.fullDate}</h3>`);
        var row1 = $(`<h5 class="card-title tempDisp" id="${object.timeData.day}">${object.weatherData.weatherIcon}${object.weatherData.temp}°F</h5>`);
        var row2 = $(`<p class="card-text humidityDisp" id="${object.timeData.day}">Humidity: ${object.weatherData.humidity}%</p>`);
        var row3 = $(`<p class="card-text windDisp" id="${object.timeData.day}">Wind Speed: ${object.weatherData.windSpeed}m/h</p>`);
        var row4 = $(`<p class="card-text uvIndexDisp" id="${object.timeData.day}">UV Index: ${object.weatherData.uvIndex}</p>`); // This doesn't always arrive in time
    } else if (object.html.type === "forecast") {
        // var row0 = $(``);
        var row0 = $(`<h5 class="card-text text-center date mb-0" id="${object.timeData.day}">Date:</h5>`);
        var row1 = $(`<p class="card-text text-center dateDisp mb-0" id="${object.timeData.day}">${object.timeData.shortday} ${object.timeData.dayOfMonth}</p>`);
        var row2 = $(`<p class="card-title text-center iconDisp" id="${object.timeData.day}">${object.weatherData.weatherIcon}</p>`);
        var row3 = $(`<p class="card-text text-center tempDisp" id="${object.timeData.day}">Temp: ${object.weatherData.temp}°F</p>`);
        var row4 = $(`<p class="card-text text-center humidityDisp" id="${object.timeData.day}">RH: ${object.weatherData.humidity}%</p>`);
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
function getUVIndex(lat, lon){
    var queryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${lat}&lon=${lon}`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        // console.log(response.value);
        uvIndex = response.value;
        console.log(uvIndex);
    })
    return uvIndex;
}


init();


//°
// !!!!TO DO!!!!

    // Function: Display the weather param1(where the user currently is)
        // Going to have the current day as the focus
        // The next 6 days will show up to the right

    // Get stored searched cities.
        // Need to look at localStorage


    // function displayStates(state){
//     switch(state){
//         case "loading":
//             console.log("Data hasn't loaded yet, so what should I display?");
//             break;
        
//     }
// }