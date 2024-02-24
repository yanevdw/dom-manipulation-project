import L from "leaflet";
import {
  loadWeatherForecast,
  failedForecast,
  hideForecastLoader,
} from "./domManipulation";
import fetchWeatherForecast from "./api";

const map = L.map("map").setView([-28.921631, 25.224609], 4);
// Set the initial marker location ot that of Pretoria as this is the default.
const marker = L.marker([-25.73134, 28.21837]).addTo(map);

export function loadMap() {
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
  }).addTo(map);
  return map;
}
export function loadMarker(lat, long) {
  marker.setLatLng([lat, long]).addTo(map);
  map.setView([lat, long], 8);
}

// Controls the pop-up for when a user selects a location on the map;
export function togglePopup(customLat, customLong) {
  document.getElementById("popup-loading-container").style.visibility = "visible";
  document.getElementById("popup-loading-container").style.display = "flex";
  document.getElementById("popup-forecast-container").style.visibility = "hidden";
  document.getElementById("popup-forecast-container").style.display = "none";

  fetchWeatherForecast(
    "custom",
    customLat,
    customLong,
    loadWeatherForecast,
    failedForecast,
    hideForecastLoader,
  );

  loadMarker(customLat, customLong);
  document.getElementById("main-cities-container").style.visibility = "hidden";
  document.getElementById("main-cities-container").style.display = "none";
  document.getElementById("popup-container").style.visibility = "visible";
  document.getElementById("popup-container").style.display = "flex";
}

// Controls what happens when user clicks on the map to select own location.
export function handleMapClick(mapClickEvent) {
  let latLong = mapClickEvent.latlng;
  latLong = String(latLong);
  const lat = latLong.substring(latLong.indexOf("(") + 1, latLong.indexOf(","));
  const long = latLong.substring(
    latLong.indexOf(",") + 2,
    latLong.indexOf(")"),
  );
  togglePopup(lat, long);
}

// Reset the map to a zoomed-out view of South Africa to make custom selections a bit easier.
export function resetMap() {
  map.setView([-28.921631, 25.224609], 4);
}

// Add the click event to the reset button to trigger the reset fucnction.
const resetMapButton = document.getElementById("reset-map-button");
resetMapButton.addEventListener("click", () => resetMap());
