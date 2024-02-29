import "leaflet/dist/leaflet.css";
import {
  loadWeatherForecast,
  closePopup,
  displayForecastLoader,
  handleMainCityClick,
  togglePopup,
  hideForecastLoader,
} from "./domManipulation";
import {
  getMap,
  resetMap,
  customLat,
  customLong,
  bindMapClick,
  loadMarker,
} from "./map";
import {
  signalNewForecastFetch$,
  fetchResultSet$,
  fetchCustomResultSet$,
} from "./api";

let location = "pretoria";

function handleFetch(loc: string, lat: string, long: string) {
  location = loc;
  displayForecastLoader("custom");
  signalNewForecastFetch$.next([lat, long]);
}

function handleCityClick(selectedCity: number) {
  if (selectedCity === 0) {
    handleFetch("pretoria", "-25.731340", "28.218370");
    handleMainCityClick(selectedCity, loadMarker);
  } else if (selectedCity === 1) {
    handleFetch("johannesburg", "-26.195246", "28.034088");
    handleMainCityClick(selectedCity, loadMarker);
  } else if (selectedCity === 2) {
    handleFetch("durban", "-29.85790000", "31.02920000");
    handleMainCityClick(selectedCity, loadMarker);
  } else if (selectedCity === 3) {
    handleFetch("cape-town", "-33.918861", "18.423300");
    handleMainCityClick(selectedCity, loadMarker);
  }
}

function handleMapClick() {
  handleFetch("custom", customLat, customLong);
  fetchCustomResultSet$.subscribe((result) => {
    loadWeatherForecast(location, result.result.dataseries);
  });

  togglePopup();
  hideForecastLoader("custom");
}

fetchResultSet$.subscribe((result) => {
  loadWeatherForecast(location, result.result.dataseries);
});
// // Only a loader for the pop-up. Ensures it only displays if results haven't been returned yet.
// displayForecastLoader("custom");

// Get the parent element for the main cities/locations which holds all the buttons.
const mainCities = document.getElementById("main-cities-nav");
// Get all the button elements in this parent.
if (mainCities) {
  const mainCityButtons = mainCities.getElementsByClassName("city-chip");
  // Add a click event to each of the main city chips to show their respective forecasts.
  for (let i = 0; i < mainCityButtons.length; i++) {
    mainCityButtons[i].addEventListener("click", () => handleCityClick(i));
  }
}

getMap();

// // Display the forecast for Pretoria as default.
handleCityClick(0);

// Add a click event to the map to process when a custom or random location is selected on the map.
bindMapClick(handleMapClick);
// // Add the click event to the close icon to trigger the close function.
// // Add the click event to the reset button to trigger the reset fucnction.
const closePopupButton = document.getElementById("close-popup-button");
const resetMapButton = document.getElementById("reset-map-button");

fetchResultSet$.subscribe((result) => {
  loadWeatherForecast(location, result.result.dataseries);
});

if (closePopupButton && resetMapButton) {
  closePopupButton.addEventListener("click", () => closePopup(loadMarker));
  resetMapButton.addEventListener("click", () => resetMap());
}
