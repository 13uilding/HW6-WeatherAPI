// VARIABLES
var queryURL;
var cityStr;
var cities = [];

// TARGETS
var currentlyDisplayingHeader = $("h3.currentlyDisplaying"); // use .text("To change it")
// Cities Field
var userCityInput = $("#userCityInput");
var citiesField = $(".citiesField");
// 

// BUTTONS


// FUNCTIONS
function init(){
    console.log("HI");
    // Function: Need the location grabbed from window
        // Figure out how to get that, and if I need to notify the user.
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
};

// function displayStates(state){
//     switch(state){
//         case "loading":
//             console.log("Data hasn't loaded yet, so what should I display?");
//             break;
        
//     }
// }