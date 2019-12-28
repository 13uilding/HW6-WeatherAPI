// VARIABLES
var queryURL;
var cityStr;
var cities = [];

// TARGETS
var currentlyDisplayingHeader = $("h3.currentlyDisplaying"); // use .text("To change it")
// City
var cityInput = $("#cityInput");
var citiesField = $(".citiesField");
var citiesList = $(".citiesList")
var searchBtn = $("#searchBtn");
var clearBtn = $("#clearBtn");
// OpenWeather
var APIKey = "8b1406f6dfd91995f05edf59eb9d8b9c";
// Here we are building the URL we need to query the database

// BUTTONS
searchBtn.on("click", function(event){
    event.preventDefault();
    console.log("fix me: Make a single function to handle this and the submit")


})
clearBtn.on("click", function(event){
    event.preventDefault();
    cityInput.val("");
})

// EVENTS
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
    // Function: Grab the current day and next 6 days
        // moment() for current day
        // moment().get() for the remaining days    

    // Function: Display the weather param1(where the user currently is)
        // Going to have the current day as the focus
        // The next 6 days will show up to the right

    // Get stored searched cities.
        // Need to look at localStorage

    // Function: Display past searched cities on the left
        // Add the city that is inputed into the field
        // Display the new array list
        // Gonna want to use the .empty 
        // $(`<li>${cities[i]}`) 
function renderButtons(arr){
    citiesList.empty();
    arr.forEach(function(city){
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
function getForecast(city){
    // api.openweathermap.org/data/2.5/forecast?q={city name},{country code}
    var countryCode = "840"; // United States (get the proper country code)(search cities api)
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&APPID=${APIKey}&units=Imperial`;
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){
        console.log(response)
        // city.city.id, name, coord.lat, lon, country, population, timezone, sunrise, sunset 
        // city.list[0, 39]
        var foreCastArr = response.list;
        foreCastArr.forEach(function(hourly3Report){
            console.log(hourly3Report.dt_txt); //it works
            // Getting the high and low for the day
            //.dt 
            //.main.temp
            //.temp_min
            //.temp_max
            //.humidity
            //.weather.icon
            //.wind.speed,
            //.dt_txt "2019-12-29 21:00:00"
        });
        return console.log("BRO");
        // Moment.js incorporate
      });
}


init();







    // function displayStates(state){
//     switch(state){
//         case "loading":
//             console.log("Data hasn't loaded yet, so what should I display?");
//             break;
        
//     }
// }