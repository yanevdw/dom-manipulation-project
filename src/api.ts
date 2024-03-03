import { WeatherResponse } from "./types/customTypes";
import { EMPTY, Subject, catchError, map, switchMap, throttleTime } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

export const signalNewForecastFetch$ = new Subject<[number, number]>();

export const fetchResultSet$ = signalNewForecastFetch$.pipe(
  throttleTime(200),
  switchMap(([lat, long]) =>
    fromFetch(
      `http://www.7timer.info/bin/api.pl?lon=${long}&lat=${lat}&product=civillight&output=json`
    ).pipe(
      switchMap((res) => fromPromise(res.json())),
      map((json: WeatherResponse) => ({ result: json })),
      catchError((error) => {
        console.error("JSON Parse Fail", error);
        return EMPTY;
      })
    )
  )
);
