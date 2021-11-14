import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Station } from './station';
import { default as stationen } from "./stations.json";

@Injectable({
  providedIn: 'root'
})
export class StationsService {
  stations: Station[];

  constructor() {
    this.stations = this.getStationsAir();
  }

  private getStationsAir() {
    let stations: any = [];
    stationen.stationen.map((station: Station) => {
      if (station.komponentenCodes.includes("NO2" || "PM10kont" || "PM25kont"))
        stations.push(station);
      return true;
    });
    return stations;
  }

  getStationByCode(code: string):Station {
    return this.stations.filter((station:Station) => station.code === code)[0];
  }

  getStations() {
    return this.stations;
  }
}
