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
// 

// BUTTONS
searchBtn.on("click", function(event){
    event.preventDefault();
    var city = cityInput.val().trim();
    cities.push(city);
    console.log(`cityInput: ${city}`);
    renderButtons(cities);
    cityInput.val("");

})
clearBtn.on("click", function(event){
    event.preventDefault();
    cityInput.val("");
})
// <button type="button" class="btn btn-outline-success">Success</button>

// Events
$(".cityForm").on("submit", function(event){
    event.preventDefault();
    var city = cityInput.val().trim();
    cities.push(city);
    console.log(`cityInput: ${city}`);
    renderButtons(cities);
    cityInput.val("");

});

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
        var cityBtn = $(`<button type="button" class="btn btn-outline-success" data-name="${city}">${city}</button>`);
        citiesList.prepend(cityBtn);
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