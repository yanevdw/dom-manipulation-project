import { format } from "date-fns";

export function getCurrentDate() {
  let date = new Date();
  date = format(date, "MMdd");
  return date;
}

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
    weatherEmoji = "&#1F328;";
  }

  return weatherEmoji;
}

export function networkCall(location, lat, long) {
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
      const containerID = `${location}-container`;
      const cityForecast = document.getElementById(containerID);

      if (cityForecast != null) {
        const cityDailyForecast = cityForecast.getElementsByClassName("daily-forecast-container");

        for (const result of forecastResults) {
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
          const dailyForecast = cityDailyForecast[forecastResults.indexOf(result)];

          const dateResult = forecastItemContent.substring(4, forecastItemContent.indexOf(","));
          forecastItemContent = forecastItemContent.substring(forecastItemContent.indexOf(",") + 1, forecastItemContent.length);
          const weatherResult = forecastItemContent.substring(0, forecastItemContent.indexOf(","));
          forecastItemContent = forecastItemContent.substring(forecastItemContent.indexOf(",") + 1, forecastItemContent.length);
          const maxTempResult = forecastItemContent.substring(0, forecastItemContent.indexOf(","));
          forecastItemContent = forecastItemContent.substring(forecastItemContent.indexOf(",") + 1, forecastItemContent.length);
          const minTempResult = forecastItemContent.substring(0, forecastItemContent.indexOf(","));
          const forecastItemsList = dailyForecast.getElementsByClassName("forecast-item-info");

          for (let i = 0; i < forecastItemsList.length; i++) {
            const forecastItemInfo = forecastItemsList[i];
            if (i === 0) {
              if (getCurrentDate() === dateResult) {
                forecastItemInfo.innerText = "Today";
              } else {
                const formattedDate = `${dateResult.substring(2, 4)} ${format(dateResult.substring(0, 2), "MMM")}`;
                forecastItemInfo.innerText = formattedDate;
                // console.log(formattedDate);
              }
            } else if (i === 1) {
              forecastItemInfo.innerHTML = weatherIconConverter(weatherResult);
            } else if (i === 2) {
              forecastItemInfo.innerText = `${minTempResult} °C / ${maxTempResult} °C`;
            }
          }
        }

        // Showing the forecast after everything has been loaded.
        if (location === "custom") {
          document.getElementById("popup-loading-container").style.visibility = "hiddem";
          document.getElementById("popup-loading-container").style.display = "none";
          document.getElementById("popup-forecast-container").style.visibility = "visible";
          document.getElementById("popup-forecast-container").style.display = "flex";
        }
      }
    })
    .catch((error) => console.error(error))
    .finally(() => console.log("Network call has been completed."));
}
