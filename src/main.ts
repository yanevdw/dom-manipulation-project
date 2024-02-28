import "leaflet/dist/leaflet.css";
import fetchWeatherForecast from "./api";
import {
  loadWeatherForecast,
  failedForecast,
  hideForecastLoader,
  closePopup,
  displayForecastLoader,
  handleMainCityClick,
  fetchPopup,
} from "./domManipulation";
import { getMap, resetMap, bindMapClick, loadMarker } from "./map";

// Only a loader for the pop-up. Ensures it only displays if results haven't been returned yet.
displayForecastLoader("custom");

// Get the parent element for the main cities/locations which holds all the buttons.
const mainCities = document.getElementById("main-cities-nav");
// Get all the button elements in this parent.
if (mainCities){
  const mainCityButtons = mainCities.getElementsByClassName("city-chip");
  // Add a click event to each of the main city chips to show their respective forecasts.
  for (let i = 0; i < mainCityButtons.length; i++) {
    mainCityButtons[i].addEventListener("click", () => handleMainCityClick(i, loadMarker));
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

getMap();
// Add a click event to the map to process when a custom or random location is selected on the map.
bindMapClick(fetchPopup);

// Display the forecast for Pretoria as default.
handleMainCityClick(0, loadMarker);

// Add the click event to the close icon to trigger the close function.
// Add the click event to the reset button to trigger the reset fucnction.
const closePopupButton = document.getElementById("close-popup-button");
const resetMapButton = document.getElementById("reset-map-button");

if (closePopupButton && resetMapButton) {
  closePopupButton.addEventListener("click", () => closePopup(loadMarker));
  resetMapButton.addEventListener("click", () => resetMap());
}


