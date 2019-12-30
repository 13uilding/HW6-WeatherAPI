// ++++VARIABLES++++
var queryURL;
var cityStr;
var cities = [];
var uvIndex;
var currentWeatherObj;

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
        };
        
        createCard(currentWeatherObj);
        console.log("done making the card");

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
        var foreCastArr = response.list; 
        var days = {};
        foreCastArr.forEach(function(hourlyReport){
            var hourlyInfo = weatherObj(hourlyReport);
            // console.log(hourlyInfo);
            var day = hourlyInfo.timeData.day;
            var hour = hourlyInfo.timeData.hour;
            if ( days[day] ){
                //push information to the day
                days[day][hour] = hourlyInfo.weatherData;
            } else {
                days[day] = {};
                days[day][hour] = hourlyInfo.weatherData;
            }
        });
        days.forEach(function(day){
            
            createCard(currentWeatherObj);
        })
        console.log("done making the card");
        // Get rid of current day's forecast
        // console.log(days.keys);
        // This is where I need to create cards with the days
        // console.log(days);

      });
}
function createCard(object){
    console.log(object);
    // I'm concerned of having two ids the same
    var cardWrapper = $(`<div class="card w-${object.html.width}" id=${object.timeData.fullDate}></div>`);
    var cardBody = $(`<div class="card-body" id=${object.timeData.fullDate}></div>`);
    var row1 = $(`<h5 class="card-title tempDisp" id=${object.timeData.fullDate}>${object.weatherData.weatherIcon}${object.weatherData.temp}°F</h5>`);
    var row2 = $(`<p class="card-text humidityDisp" id=${object.timeData.fullDate}>Humidity: ${object.weatherData.humidity}%</p>`);
    if (object.html.type === "focus"){
        var row3 = $(`<p class="card-text windDisp" id=${object.timeData.fullDate}>Wind Speed: ${object.weatherData.windSpeed}m/h</p>`);
        var row4 = $(`<p class="card-text uvIndexDisp" id=${object.timeData.fullDate}>UV Index: ${object.weatherData.uvIndex}</p>`); // This doesn't always arrive in time
    } else if (object.html.type === "forecast") {
        var row3 = $(`<h5 class="card-text dateDisp" id=${object.timeData.fullDate}>Date: ${object.timeData.day} ${object.timeData.month}</h5>`);
        var row4 = $(`<div class="mb-1"></div>`);
    };
    // Appending to page
    $(object.html.appendTo).empty();
    $(object.html.appendTo).append(cardWrapper);
    $(cardWrapper).append(cardBody);
    $(cardBody).append(row1);
    $(cardBody).append(row2);
    $(cardBody).append(row3);
    $(cardBody).append(row4);


}
function weatherObj(reportObj){
    var fcMoment = moment(reportObj.dt_txt);
    // Object with 2 nested objects containing time and weather data
    forecastData = {
        timeData : {
            fullDate: fcMoment.format("LLLL"),
            month: fcMoment.format("MMM"),
            dayOfMonth : fcMoment.format("DD"),
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