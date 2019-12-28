// VARIABLES
var queryURL;
var cityStr;
var geocoder;
var currentPositionArr = [];
var cities = [];

// TARGETS
var currentlyDisplayingHeader = $("h3.currentlyDisplaying"); // use .text("To change it")
// City
var cityInput = $("#cityInput");
var citiesField = $(".citiesField");
// 

// BUTTONS


//<button type="button" class="btn btn-outline-success">Success</button>

// FUNCTIONS
function init(){
    console.log("HI");
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


init();







    // function displayStates(state){
//     switch(state){
//         case "loading":
//             console.log("Data hasn't loaded yet, so what should I display?");
//             break;
        
//     }
// }