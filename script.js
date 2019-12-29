// ++++VARIABLES++++
var queryURL;
var cityStr;
var cities = [];

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
searchBtn.on("click", function(event){
    event.preventDefault();
    console.log("fix me: Make a single function to handle this and submit event")


})
clearBtn.on("click", function(event){
    event.preventDefault();
    cityInput.val("");
})

// ++++EVENTS++++
$(".cityForm").on("submit", function(event){
    event.preventDefault();
    var city = cityUpdate();
    // console.log("Form Btn Pushed: " + city);
    renderButtons(cities);
    getForecast(city);

});

$(".citiesList").on("click", "button", function( event ){
    event.preventDefault();
    var city = $(this).text();
    console.log( $(this).text() );
})


// FUNCTIONS
function init(){
    console.log("HI");
    renderButtons(cities);
};  

function renderButtons(arr){
    citiesList.empty();
    arr.forEach(function(city){
        // Make a button inside this button to erase the local storage and the button from the html. Prevent bubbling
        var cityBtn = $(`<button type="button" class="btn btn-outline-success cityBtn" data-name="${city}">${city}</button>`);
        citiesList.prepend(cityBtn);
    });   
}
function cityUpdate(){
    var city = cityInput.val().trim();
    cityInput.val("");
    // This is where I would add a function to update the words to title case
    cities.push(city);
    // console.log(`cityInput: ${city}`);
    return city;
}

function getCurrentWeather(city){

}
function getUVIndex(city){
    
}
function getForecast(city){
    // api.openweathermap.org/data/2.5/forecast?q={city name},{country code}
    var countryCode = "840"; // United States (get the proper country code)(search cities api)
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&APPID=${APIKey}&units=Imperial`;
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){
        console.log("Here is the AJAX response:\n");
        console.log(response);
        var foreCastArr = response.list; // Get rid of the first index?
        var days = {};
        foreCastArr.forEach(function(hourly3Report){
            var hourlyInfo = weatherObj(hourly3Report);
            // console.log(hourlyInfo);
            var day = hourlyInfo.timeData.day;
            var hour = hourlyInfo.timeData.hour;
            if ( days[day] ){
                //push information to the day
                days[day][hour] = hourlyInfo.weatherData;
                console.log("Already have the day.")
            } else {
                days[day] = {};
                days[day][hour] = hourlyInfo.weatherData;
            }
        });
        console.log(days);
        return console.log("BRO");
        // Moment.js incorporate
      });
}

// looks like my weather call doesn't grab the current day's weather
function weatherObj(reportObj){
    var fcMoment = moment(reportObj.dt_txt);
    // Object with 2 nested objects containing time and weather data
    forecastData = {
        timeData : {
            day : fcMoment.format("dddd"),
            dayOfMonth : fcMoment.format("DD"),
            hour : fcMoment.format("hA"),
        },
        weatherData : {
            temp : reportObj.main.temp,
            temp_min : reportObj.main.temp_min,
            temp_max : reportObj.main.temp_max,
            humidity : reportObj.main.humidity,
            weatherIcon : `http://openweathermap.org/img/wn/${reportObj.weather[0].icon}@2x.png`,
            windSpeed : reportObj.wind.speed,
        },
    };
    return forecastData;
}


init();



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