import { format } from "date-fns";

// Get the current date to convert the forecast for the current date to "Today";
export function getCurrentDate() {
  // Convert to format that matches how the result from the network call has been formulated.
  return format(new Date(), "MMdd");;
}

// Convert the general weather types to corresponding emojis.
export function weatherIconConverter(weatherType = "") {
  let weatherEmoji = "";
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

function temperatureColourConverter(temp) {
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

export function loadWeatherForecast(location, fetchResults) {
  // Showing the loader for the popup first.

  document.getElementById("popup-loading-container").style.visibility =
    "visible";
  document.getElementById("popup-loading-container").style.display = "flex";
  document.getElementById("popup-forecast-container").style.visibility =
    "hidden";
  document.getElementById("popup-forecast-container").style.display = "none";

  const containerID = `${location}-container`;
  const cityForecast = document.getElementById(containerID);

  if (cityForecast != null) {
    const cityDailyForecast = cityForecast.getElementsByClassName(
      "daily-forecast-container"
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
        forecastItemContent.indexOf(",")
      );
      forecastItemContent = forecastItemContent.substring(
        forecastItemContent.indexOf(",") + 1,
        forecastItemContent.length
      );
      const weatherResult = forecastItemContent.substring(
        0,
        forecastItemContent.indexOf(",")
      );
      forecastItemContent = forecastItemContent.substring(
        forecastItemContent.indexOf(",") + 1,
        forecastItemContent.length
      );
      const maxTempResult = forecastItemContent.substring(
        0,
        forecastItemContent.indexOf(",")
      );
      forecastItemContent = forecastItemContent.substring(
        forecastItemContent.indexOf(",") + 1,
        forecastItemContent.length
      );
      const minTempResult = forecastItemContent.substring(
        0,
        forecastItemContent.indexOf(",")
      );
      const forecastItemsList =
        dailyForecast.getElementsByClassName("forecast-item-info");

      for (let i = 0; i < forecastItemsList.length; i++) {
        const forecastItemInfo = forecastItemsList[i];
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
          console.log(tempList[0].innerText);
          tempList[0].style.backgroundColor =
            temperatureColourConverter(minTempResult);
          tempList[1].innerText = `${maxTempResult} °C`;
          tempList[1].style.backgroundColor =
            temperatureColourConverter(maxTempResult);
        }
      }
    }
  }
}

// Controls what happens when the network call has been unsuccessful.
export function failedForecast(location) {
  console.error(`Unable to fetch the forecast for the ${location} location`);
  document.getElementById("popup-text").innerText = "Unable to fetch forecast";
}

// Hides the loader after the network call has been completed.
export function hideForecastLoader(location) {
  if (location === "custom") {
    document.getElementById("popup-loading-container").style.visibility =
      "hiddem";
    document.getElementById("popup-loading-container").style.display = "none";
    document.getElementById("popup-forecast-container").style.visibility =
      "visible";
    document.getElementById("popup-forecast-container").style.display = "flex";
  }
}
