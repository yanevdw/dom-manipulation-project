import { Forecast } from "./domManipulation";

export default function fetchWeatherForecast(
  location: string,
  lat: string,
  long: string,
  callbackSuccess: (loc: string, res: Forecast[]) => void,
  callbackFailure: (loc: string) => void,
  callbackFinally: (loc: string) => void,
) {
  const callURL = `http://www.7timer.info/bin/api.pl?lon=${long}&lat=${lat}&product=civillight&output=json`;

  fetch(callURL)
    .then((response) => {
      if (response.headers.get("content-type") === "text/plain") {
        return response.text();
      }
      return response.json();
    })
    .then((jsonResponse) => {
      try {
        let jsonValue = jsonResponse;
        if (
          typeof jsonResponse === "string"
        ) {
          jsonValue = JSON.parse(jsonResponse);
        }
        // Validating response
        if (!jsonValue?.dataseries) {
          throw new Error(`Invalid response from the API: "${jsonValue}"`);
        }
        const forecastResults = jsonValue.dataseries;
        if (callbackSuccess) {
          callbackSuccess(location, forecastResults);
        }
      } catch (error) {
        throw new Error(
          `Invalid response from the API: "${jsonResponse}"`
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
        callbackFinally(location);
      }
    });
}
