import L from "leaflet";

const map = L.map("map").setView([-28.921631, 25.224609], 4);
// Set the initial marker location ot that of Pretoria as this is the default.
const marker = L.marker([-25.73134, 28.21837]).addTo(map);

export function getMap() {
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

// Reset the map to a zoomed-out view of South Africa to make custom selections a bit easier.
export function resetMap() {
  map.setView([-28.921631, 25.224609], 4);
}
