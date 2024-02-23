export default function fetchWeatherForecast(
  location,
  lat,
  long,
  callbackSuccess,
  callbackFailure,
  callbackFinally
) {
  const callURL = `http://www.7timer.info/bin/api.pl?lon=${long}&lat=${lat}&product=civillight&output=json`;

  fetch(callURL)
    .then((response) => {
      if (response.headers.get("content-type") === "text/plain") {
        return response.text();
      } else {
        return response.json();
      }
    })
    .then((jsonResponse) => {
      try {
        let jsonValue = jsonResponse;
        if (typeof jsonResponse === 'string' || jsonResponse instanceof String) {
          jsonValue = JSON.parse(jsonResponse);

        }
        // Validating response
        if (!jsonValue?.dataseries) {
          throw new Error(`Invalid response from the API: "${jsonValue}"`);
        }
        const forecastResults = jsonValue.dataseries;
        console.log(forecastResults);
        if (callbackSuccess) {
          callbackSuccess(location, forecastResults);
        }
      } catch (error) {
        throw new Error(
          `Invalid response from the API: "${jsonResponse}"`,
          error
        );
      }
    })
    .catch((error) => {
      if (callbackFailure) {
        callbackFailure(location);
      }
      console.error("CATCH", error);
    })
    .finally(() => {
      if (callbackFinally) {
        callbackFinally();
      }
      console.log("Network call has been completed.");
    });
}
