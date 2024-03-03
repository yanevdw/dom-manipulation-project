interface Temperature {
  max: string;
  min: string;
}

export interface Forecast {
  date: string;
  weather: string;
  temp2m: Temperature;
}

export interface WeatherResponse {
  dataseries: Forecast[];
}
