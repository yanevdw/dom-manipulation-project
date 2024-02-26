import { format } from "date-fns";
import { loadMarker } from "./map";
import fetchWeatherForecast from "./api";

// Get the parent element for the main cities/locations which holds all the buttons.
const mainCities = document.getElementById("main-cities-nav");

// Get all the button elements in this parent.
let  mainCityButtons : HTMLCollectionOf<Element>;
if (mainCities !== null) {
  mainCityButtons = mainCities.getElementsByClassName("city-chip");
}

// Set the default city to the first option.
let selectedMainCity = 0;

// Toggle visibility of the pop-up
const mainLocations = document.getElementById("main-cities-container");
const customLocationPopup = document.getElementById("popup-container");
if (mainLocations !== null) {
  mainLocations.style.visibility = "visible";
}
if (customLocationPopup !== null)
{
  customLocationPopup.style.visibility = "hidden";
}


// Get the current date to convert the forecast for the current date to "Today";
export function getCurrentDate() {
  // Convert to format that matches how the result from the network call has been formulated.
  return format(new Date(), "MMdd");
}

// Convert the general weather types to corresponding emojis.
export function weatherIconConverter(weatherType = "") {
  let weatherEmoji = "&#x1F31E;";
  if (weatherType.includes("clearday")) {
    weatherEmoji = "&#x1F31E;";
  } else if (weatherType.includes("clearnight")) {
    weatherEmoji = "&#x1F319";
  } else if (weatherType.includes("clear")) {
    weatherEmoji = "&#x1F31E;";
  } else if (weatherType.includes("cloudy")) {
    weatherEmoji = "&#x26C5;";
  } else if (weatherType.includes("shower")) {
    weatherEmoji = "&#x1F326;";
  } else if (weatherType.includes("humid")) {
    weatherEmoji = "&#x1F31E;";
  } else if (weatherType.includes("rain")) {
    weatherEmoji = "&#x1F326;";
  } else if (weatherType.includes("snow")) {
    weatherEmoji = "&#x2744;";
  } else if (weatherType.includes("rainsnow")) {
    weatherEmoji = "&#x1F328;";
  } else if (weatherType.includes("ts")) {
    weatherEmoji = "&#x1F329;";
  }

  return weatherEmoji;
}

function temperatureColourConverter( temp: number) {
  switch (true) {
    case temp < 0:
      return "#1818d7";
    case temp < 10:
      return "#0e7ccb";
    case temp < 20:
      return "#03a3d9";
    case temp < 30:
      return "#338a5a";
    case temp < 40:
      return "#d38e0e";
    case temp < 50:
      return "#ff0000";
    default:
      return "#6153cc";
  }
}

export function displayForecastLoader(location: string) {
  if (location === "custom") {

    const popupLoader = document.getElementById("popup-loading-container");

    if (popupLoader !== null) {
      popupLoader.style.visibility = "visible";
      popupLoader.style.display = "flex";
    }
    
    const popupForecastDisplay = document.getElementById("popup-forecast-container");

    if (popupForecastDisplay !== null) {
      popupForecastDisplay.style.visibility = "hidden";
      popupForecastDisplay.style.display = "none";
    }
    
  }
}

interface Temperature {
  max: string,
  min: string
}
export interface Forecast{

  date: string, 
  weather: string,
  temp2m: Temperature,

}



export function loadWeatherForecast(location: string, fetchResults: Forecast[]) {
  // Showing the loader for the popup first.

  const containerID = `${location}-container`;
  const cityForecast = document.getElementById(containerID);

  if (cityForecast != null) {
    const cityDailyForecast = cityForecast.getElementsByClassName(
      "daily-forecast-container",
    );

    for (const result of fetchResults) {
      let forecastItemContent = "";

      if (result?.date) {
        forecastItemContent += `${result.date},`;
      }
      if (result?.weather) {
        forecastItemContent += `${result.weather},`;
      }
      if (result?.temp2m?.max) {
        forecastItemContent += `${result.temp2m.max},`;
      }

      if (result?.temp2m?.min) {
        forecastItemContent += `${result.temp2m.min},`;
      }
      const dailyForecast = cityDailyForecast[fetchResults.indexOf(result)];

      const dateResult = forecastItemContent.substring(
        4,
        forecastItemContent.indexOf(","),
      );
      forecastItemContent = forecastItemContent.substring(
        forecastItemContent.indexOf(",") + 1,
        forecastItemContent.length,
      );
      const weatherResult = forecastItemContent.substring(
        0,
        forecastItemContent.indexOf(","),
      );
      forecastItemContent = forecastItemContent.substring(
        forecastItemContent.indexOf(",") + 1,
        forecastItemContent.length,
      );
      const maxTempResult = forecastItemContent.substring(
        0,
        forecastItemContent.indexOf(","),
      );
      forecastItemContent = forecastItemContent.substring(
        forecastItemContent.indexOf(",") + 1,
        forecastItemContent.length,
      );
      const minTempResult = forecastItemContent.substring(
        0,
        forecastItemContent.indexOf(","),
      );
      const forecastItemsList = dailyForecast.getElementsByClassName("forecast-item-info");

      for (let i = 0; i < forecastItemsList.length; i++) {
        const forecastItemInfo = <HTMLElement>forecastItemsList[i];
        if (i === 0) {
          if (getCurrentDate() === dateResult) {
            forecastItemInfo.innerText = "Today";
          } else {
            const formattedDate = `${dateResult.substring(2, 4)} ${format(dateResult.substring(0, 2), "MMM")}`;
            forecastItemInfo.innerText = formattedDate;
          }
        } else if (i === 1) {
          forecastItemInfo.innerHTML = weatherIconConverter(weatherResult);
        } else if (i === 2) {
          const tempList = forecastItemInfo.getElementsByTagName("div");
          tempList[0].innerText = `${minTempResult} °C`;
          tempList[0].style.backgroundColor = temperatureColourConverter(Number(minTempResult));
          tempList[1].innerText = `${maxTempResult} °C`;
          tempList[1].style.backgroundColor = temperatureColourConverter(Number(maxTempResult));
        }
      }
    }
  }
}

// Controls what happens when the network call has been unsuccessful.
export function failedForecast(location: string) {
  console.error(`Unable to fetch the forecast for the ${location} location`);
  const popupTextElement = document.getElementById("popup-text");
  if (popupTextElement !== null) {
    popupTextElement.innerText = "Unable to fetch forecast";
  }
  
}

// Hides the loader after the network call has been completed.
export function hideForecastLoader(location: string) {
  if (location === "custom") {

    const popupLoader = document.getElementById("popup-loading-container");
    if (popupLoader !== null) {
      popupLoader.style.visibility = "hidden";
      popupLoader.style.display = "none";
    }
   
    const popupForecast =  document.getElementById("popup-forecast-container");

    if (popupForecast !== null) {
      popupForecast.style.visibility = "visible";
      popupForecast.style.display = "flex";
    }
   
  }
}
export function handleMainCityClick(numButton: number) {
  const forecastDisplay = document.getElementsByClassName("city-forecast");
  // Remove the active state from the previously selected button.

  mainCityButtons[selectedMainCity].classList.remove("active");
  // Update the index of the newly/currently selected button.
  selectedMainCity = numButton;
  // Set the newly selected button to active.
  mainCityButtons[selectedMainCity].classList.add("active");

  // Display forecast for selected city and hide forecasts for other main cities/locations.
  if (forecastDisplay !== null) {
    for (let j = 0; j < forecastDisplay.length; j++) {
      if (j === selectedMainCity) {
        // Display corresponding forecast of selected main city.
        
        const forecastItem = <HTMLElement>(forecastDisplay[j]);
        forecastItem.style.visibility = "visible";
        forecastItem.style.display = "flex";
      } else {
        // Hide all other cities' information.
        const forecastItem = <HTMLElement>(forecastDisplay[j]);
        forecastItem.style.visibility = "hidden";
        forecastItem.style.display = "none";
      }
    }
  }
  

  // Update the location of the marker.
  if (selectedMainCity === 0) {
    loadMarker(-25.73134, 28.21837);
  } else if (selectedMainCity === 1) {
    loadMarker(-26.195246, 28.034088);
  } else if (selectedMainCity === 2) {
    loadMarker(-29.8579, 31.0292);
  } else if (selectedMainCity === 3) {
    loadMarker(-33.918861, 18.4233);
  }
}

// Controls the pop-up for when a user selects a location on the map;
export function togglePopup(customLat: string, customLong: string) {
  displayForecastLoader("custom");

  fetchWeatherForecast(
    "custom",
    customLat,
    customLong,
    loadWeatherForecast,
    failedForecast,
    hideForecastLoader,
  );

  loadMarker(Number(customLat), Number(customLong));

  const mainCitiesDisplay = document.getElementById("main-cities-container");

  if (mainCitiesDisplay !== null) {
    mainCitiesDisplay.style.visibility = "hidden";
    mainCitiesDisplay.style.display = "none";
  }
  
  const popupDisplay = document.getElementById("popup-container");

  if (popupDisplay !== null) {
    popupDisplay.style.visibility = "visible";
    popupDisplay.style.display = "flex";
  }
  
  const customForecastDisplay = document.getElementById("custom-container");

  if (customForecastDisplay !== null) {
    customForecastDisplay.style.visibility = "visible";
    customForecastDisplay.style.display = "flex";
  }
}

// Close the popup when the close icon is selected.
export function closePopup() {

  if (mainLocations !== null && customLocationPopup !== null) {
    mainLocations.style.visibility = "visible";
    mainLocations.style.display = "flex";
    customLocationPopup.style.visibility = "hidden";
    customLocationPopup.style.display = "none";
  }
  
  if (selectedMainCity === 0) {
    loadMarker(-25.73134, 28.21837);
  } else if (selectedMainCity === 1) {
    loadMarker(-26.195246, 28.034088);
  } else if (selectedMainCity === 2) {
    loadMarker(-29.8579, 31.0292);
  } else if (selectedMainCity === 3) {
    loadMarker(-33.918861, 18.4233);
  }
}

// Controls what happens when user clicks on the map to select own location.
export function handleMapClick(mapClickEvent: { latlng: { wrap: () => any; }; }) {
  const latLong = String(mapClickEvent.latlng.wrap());
  const lat = latLong.substring(latLong.indexOf("(") + 1, latLong.indexOf(","));
  const long = latLong.substring(
    latLong.indexOf(",") + 2,
    latLong.indexOf(")"),
  );
  togglePopup(lat, long);
}
