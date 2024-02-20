import { networkCall } from "./api";

// Toggle visibility of the pop-up
const mainLocations = document.getElementById("main-cities-container");
const customLocationPopup = document.getElementById("popup-container");
mainLocations.style.visibility = "visible";
customLocationPopup.style.visibility = "hidden";

// Complete all the network calls for the main cities.
// Network call for Pretoria
networkCall("pretoria", "-25.731340", "28.218370");
// Network call for Johannesburg
networkCall("johannesburg", "-26.195246", "28.034088");
// Network call for Durban
networkCall("durban", "-29.85790000", "31.02920000");
// Network call Cape Town
networkCall("cape-town", "-33.918861", "18.423300");

// Set the initial view of the map to that of South Africa.
const map = L.map("map").setView([-28.921631, 25.224609], 4);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
}).addTo(map);

// Get the parent element for the main cities/locations which holds all the buttons.
const mainCities = document.getElementById("main-cities-nav");
// Get all the button elements in this parent.
const mainCityButtons = mainCities.getElementsByClassName("city-chip");
// Set the default city to the first option.
let selectedMainCity = 0;
// Make Pretoria the  default main city displayed on load.
mainCityButtons[selectedMainCity].classList.add("active");
document.getElementById("pretoria-container").style.visibility = "visible";
// Hide all other main cities.
document.getElementById("johannesburg-container").style.visibility = "hidden";
document.getElementById("durban-container").style.visibility = "hidden";
document.getElementById("cape-town-container").style.visibility = "hidden";
// Set the initial marker location ot that of Pretoria as this is the default.
const marker = L.marker([-25.73134, 28.21837]).addTo(map);

// Controls the pop-up for when a user selects a location on the map;
function togglePopup(customLat, customLong) {
  if (customLocationPopup.style.visibility === "visible") {
    customLocationPopup.style.visibility = "hidden";
  }

  networkCall("custom", customLat, customLong);
  marker.setLatLng([customLat, customLong]).addTo(map);
  map.setView([customLat, customLong], 8);
  mainLocations.style.visibility = "hidden";
  mainLocations.style.display = "none";
  customLocationPopup.style.visibility = "visible";
  customLocationPopup.style.display = "flex";
}

// Controls what happens when user clicks on the map to select own location.
function handleMapClick(mapClickEvent) {
  let latLong = mapClickEvent.latlng;
  latLong = String(latLong);
  const lat = latLong.substring(latLong.indexOf("(") + 1, latLong.indexOf(","));
  const long = latLong.substring(
    latLong.indexOf(",") + 2,
    latLong.indexOf(")"),
  );
  togglePopup(lat, long);
}

// Add a click event to the map to process when a custom or random location is selected on the map.
map.on("click", handleMapClick);

// Controls what happens each time a new main city is clicked.
function handleClick(numButton) {
  const forecastDisplay = document.getElementsByClassName("city-forecast");
  // Remove the active state from the previously selected button.
  mainCityButtons[selectedMainCity].classList.remove("active");
  // Update the index of the newly/currently selected button.
  selectedMainCity = numButton;
  // Set the newly selected button to active.
  mainCityButtons[selectedMainCity].classList.add("active");

  // Display forecast for selected city and hide forecasts for other main cities/locations.
  for (let j = 0; j < forecastDisplay.length; j++) {
    if (j === selectedMainCity) {
      // Display corresponding forecast of selected main city.
      forecastDisplay[j].style.visibility = "visible";
      forecastDisplay[j].style.display = "flex";
    } else {
      // Hide all other cities' information.
      forecastDisplay[j].style.visibility = "hidden";
      forecastDisplay[j].style.display = "none";
    }
  }

  // Update the location of the marker.
  if (selectedMainCity === 0) {
    marker.setLatLng([-25.73134, 28.21837]);
    map.setView([-25.73134, 28.21837], 8);
  } else if (selectedMainCity === 1) {
    marker.setLatLng([-26.195246, 28.034088]).addTo(map);
    map.setView([-26.195246, 28.034088], 8);
  } else if (selectedMainCity === 2) {
    marker.setLatLng([-29.8579, 31.0292]).addTo(map);
    map.setView([-29.8579, 31.0292], 8);
  } else if (selectedMainCity === 3) {
    marker.setLatLng([-33.918861, 18.4233]).addTo(map);
    map.setView([-33.918861, 18.4233], 8);
  }
}

// Add a click event to each of the main city chips to show their respective forecasts.
for (let i = 0; i < mainCityButtons.length; i++) {
  mainCityButtons[i].addEventListener("click", () => handleClick(i));
}

// Close the popup when the close icon is selected.
function closePopup() {
  mainLocations.style.visibility = "visible";
  mainLocations.style.display = "flex";
  customLocationPopup.style.visibility = "hidden";
  customLocationPopup.style.display = "none";

  if (selectedMainCity === 0) {
    marker.setLatLng([-25.73134, 28.21837]);
    map.setView([-25.73134, 28.21837], 8);
  } else if (selectedMainCity === 1) {
    marker.setLatLng([-26.195246, 28.034088]).addTo(map);
    map.setView([-26.195246, 28.034088], 8);
  } else if (selectedMainCity === 2) {
    marker.setLatLng([-29.8579, 31.0292]).addTo(map);
    map.setView([-29.8579, 31.0292], 8);
  } else if (selectedMainCity === 3) {
    marker.setLatLng([-33.918861, 18.4233]).addTo(map);
    map.setView([-33.918861, 18.4233], 8);
  }
}

// Add the click event to the close icon to trigger the close function.
const closePopupButton = document.getElementById("close-popup-button");
closePopupButton.addEventListener("click", () => closePopup());

// Reset the map to a zoomed-out view of South Africa to make custom selections a bit easier.
function resetMap() {
  map.setView([-28.921631, 25.224609], 4);
}

// Add the click event to the reset button to trigger the reset fucnction.
const resetMapButton = document.getElementById("reset-map-button");
resetMapButton.addEventListener("click", () => resetMap());
