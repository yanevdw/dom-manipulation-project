import "leaflet/dist/leaflet.css";
import fetchWeatherForecast from "./api";
import {
  loadWeatherForecast,
  failedForecast,
  hideForecastLoader,
  closePopup,
  displayForecastLoader,
  handleMapClick,
  handleMainCityClick,
} from "./domManipulation";
import { getMap, resetMap } from "./map";

// Only a loader for the pop-up. Ensures it only displays if results haven't been returned yet.
displayForecastLoader("custom");

// Get the parent element for the main cities/locations which holds all the buttons.
const mainCities = document.getElementById("main-cities-nav");
// Get all the button elements in this parent.
if (mainCities){
  const mainCityButtons = mainCities.getElementsByClassName("city-chip");
  // Add a click event to each of the main city chips to show their respective forecasts.
  for (let i = 0; i < mainCityButtons.length; i++) {
    mainCityButtons[i].addEventListener("click", () => handleMainCityClick(i));
  }
}


// Complete all the network calls for the main cities.
// Network call for Pretoria
fetchWeatherForecast(
  "pretoria",
  "-25.731340",
  "28.218370",
  loadWeatherForecast,
  failedForecast,
  hideForecastLoader,
);
// Network call for Johannesburg
fetchWeatherForecast(
  "johannesburg",
  "-26.195246",
  "28.034088",
  loadWeatherForecast,
  failedForecast,
  hideForecastLoader,
);
// Network call for Durban
fetchWeatherForecast(
  "durban",
  "-29.85790000",
  "31.02920000",
  loadWeatherForecast,
  failedForecast,
  hideForecastLoader,
);
// Network call Cape Town
fetchWeatherForecast(
  "cape-town",
  "-33.918861",
  "18.423300",
  loadWeatherForecast,
  failedForecast,
  hideForecastLoader,
);

// Set the initial view of the map to that of South Africa.
const map = getMap();

// Display the forecast for Pretoria as default.
handleMainCityClick(0);

// Add a click event to the map to process when a custom or random location is selected on the map.
map.on("click", handleMapClick);

// Add the click event to the close icon to trigger the close function.
const closePopupButton = document.getElementById("close-popup-button");
if (closePopupButton) {
  closePopupButton.addEventListener("click", () => closePopup());
}

// Add the click event to the reset button to trigger the reset fucnction.
const resetMapButton = document.getElementById("reset-map-button");
if (resetMapButton) {
  resetMapButton.addEventListener("click", () => resetMap());
}

