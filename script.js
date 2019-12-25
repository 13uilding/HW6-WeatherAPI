// VARIABLES
var queryURL;
var cityStr;
var geocoder;
var currentPositionArr = [];
var cities = [];

// TARGETS
var currentlyDisplayingHeader = $("h3.currentlyDisplaying"); // use .text("To change it")
// Cities Field
var userCityInput = $("#userCityInput");
var citiesField = $(".citiesField");
// 

// BUTTONS


// FUNCTIONS
function successCallBack(position){
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    codeLatLng(lat, lng)
};
function failCallBack(){
    return alert("Geocoder failed");
};

function init(){
    console.log("HI");
    geocoder = new google.maps.Geocoder();
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

// THIS FUNCTION IS GRABBED FROM GEOLOCATION STACKED EXCHANGE
function codeLatLng(lat, lng) {
    // Google.maps.latlng
    var latlng = new google.maps.LatLng(lat, lng);
    // geocode method (geocoder was initialized from google.maps.Geocoder())
    // Looks like we pass it an object with latLng as the key and then our latLng from earlier, calback function
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        // The status determines if the passes or fails
      if (status == google.maps.GeocoderStatus.OK) {
      console.log(results)
        if (results[1]) {
         //formatted address
         alert(results[0].formatted_address)
        //find country name
            // We are doing a for loop over results[0].address_components
             for (var i=0; i<results[0].address_components.length; i++) {
                 // We then loop over the different types per individual address
            for (var b=0;b<results[0].address_components[i].types.length;b++) {
                console.log(`${results[0].address_components[i]} has the type ${results[0].address_components[i]}.types[b]`)
            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
            // Use if to find what you are looking for
                if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                    //this is the object you are looking for
                    city= results[0].address_components[i];
                    break;
                }
            }
        }
        //city data
        alert(city.short_name + " " + city.long_name)


        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  }

  // Attempts to get the current location Not positive the location of this
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallBack, failCallBack);
    };
init();
    // function displayStates(state){
//     switch(state){
//         case "loading":
//             console.log("Data hasn't loaded yet, so what should I display?");
//             break;
        
//     }
// }