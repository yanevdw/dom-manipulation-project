import L, { LatLng } from "leaflet";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  shadowSize: [40, 64],
  iconAnchor: [13, 40],
  shadowAnchor: [10, 62],
});

const map = L.map("map").setView([-28.921631, 25.224609], 4);
// Set the initial marker location ot that of Pretoria as this is the default.

const marker = L.marker([-25.73134, 28.21837], { icon: markerIcon }).addTo(map);

export function getMap() {
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

// Controls what happens when user clicks on the map to select own location.
export function bindMapClick(
  callbackMapClick: (lat: number, long: number) => void
) {
  map.addEventListener("click", (mapClickEvent: { latlng: LatLng }) => {
    const latLong = String(mapClickEvent.latlng.wrap());

    const customLat = latLong.substring(
      latLong.indexOf("(") + 1,
      latLong.indexOf(",")
    );
    const customLong = latLong.substring(
      latLong.indexOf(",") + 2,
      latLong.indexOf(")")
    );

    loadMarker(Number(customLat), Number(customLong));
    callbackMapClick(Number(customLat), Number(customLong));
  });
}

export function loadMarker(lat: number, long: number) {
  marker.setLatLng([lat, long]).addTo(map);
  map.setView([lat, long], 8);
}

// Reset the map to a zoomed-out view of South Africa to make custom selections a bit easier.
export function resetMap() {
  map.setView([-28.921631, 25.224609], 4);
}
