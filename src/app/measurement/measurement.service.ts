import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatMap, from, map, Observable, reduce } from 'rxjs';
import { Measurement } from '../measurement/measurement';
import { ICard } from '../card/card.interface';
import { createUrls } from '../utilities/utilities';
import { StationsService } from '../stations/stations.service';
import { IcuPlaceholder } from '@angular/compiler/src/i18n/i18n_ast';

interface Measurements {
  messwerte: Measurement[]
}

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  constructor(private http: HttpClient, private stationsService: StationsService) { }

  getData(urls: string[], mean: string): Observable<Measurement[]> {
    return from(urls)
      .pipe(
        concatMap((url: string) => {
          return this.http.request<Measurements>("get", url, { responseType: "json" })
        }),
        reduce((acc, res) => [...acc, ...res.messwerte], [] as Measurement[]),
        map((measurements: Measurement[]) =>
          measurements.filter((measurement) => {
            return measurement.mittelwert === mean;
          })
        )
      )
  }

  getDataStation(measurements: Measurement[], mean: string): ICard {
    let stationData: ICard = {
      "stationId": "S431",
      "stationShort": "Stadtpark",
      "measurand": "SO2",
      "mean": "TMW",
      "value": "12.00",
      "unit": "µg/m³",
      "dateFrom": 1209999,
      "dateTo": 12423423,
    };

    let count = 1;
    let sum = 0;
    let mittelwert = 0;

    stationData.stationId = measurements[0].station;
    stationData.stationShort = this.stationsService.getStationByCode(measurements[0].station).kurzname;
    stationData.measurand = measurements[0].komponente;
    stationData.mean = mean;
    stationData.value = measurements[0].messwert;
    stationData.unit = measurements[0].einheit;
    stationData.dateFrom = measurements[(measurements.length - 1)].zeitpunkt;
    stationData.dateTo = measurements[0].zeitpunkt;

    measurements.map(measurement => {
      let tmp = parseFloat(measurement.messwert.replace(",", ".")) * 1000;
      sum += tmp;
      mittelwert = sum / count;
      count++;
    })

    mean === "TMW" ? stationData.value = mittelwert.toFixed(2).toString() : stationData.value = (parseFloat(measurements[measurements.length - 1].messwert.replace(",", ".")) * 1000).toFixed(2).toString();

    console.log(stationData.value, mean);

    return stationData;
  }
}
