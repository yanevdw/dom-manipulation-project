import { loadWeatherForecast } from "./domManipulation";

export default function fetchWeatherForecast(location, lat, long) {
  const callURL = `http://www.7timer.info/bin/api.pl?lon=${long}&lat=${lat}&product=civillight&output=json`;

  // Showing the loader for the popup first.
  if (location === "custom") {
    document.getElementById("popup-loading-container").style.visibility = "visible";
    document.getElementById("popup-loading-container").style.display = "flex";
    document.getElementById("popup-forecast-container").style.visibility = "hidden";
    document.getElementById("popup-forecast-container").style.display = "none";
  }

  fetch(callURL)
    .then((response) => response.json())
    .then((jsonResponse) => {
      // Validating response
      if (!jsonResponse?.dataseries) {
        throw new Error("Invalid response");
      }
      const forecastResults = jsonResponse.dataseries;
      // Showing the forecast after everything has been loaded.
      loadWeatherForecast(location, forecastResults);

      if (location === "custom") {
        document.getElementById("popup-loading-container").style.visibility = "hiddem";
        document.getElementById("popup-loading-container").style.display = "none";
        document.getElementById("popup-forecast-container").style.visibility = "visible";
        document.getElementById("popup-forecast-container").style.display = "flex";
      }
    })
    .catch((error) => console.error(error))
    .finally(() => console.log("Network call has been completed."));
}
