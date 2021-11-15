import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ICard } from './card/card.interface';
import { MeasurementService } from './measurement/measurement.service';
import { Station } from './stations/station';
import { StationsService } from './stations/stations.service';
import { createUrls } from './utilities/utilities';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  station: ICard = {
    "stationId": "S415",
    "stationShort": "-",
    "measurand": "NO2",
    "value": "0.00",
    "unit": "µg/m³",
    "dateFrom": 0,
    "dateTo": 0,
  }
  stations!: Station[];
  selectedStation: string = this.station.stationId;
  measurands = ["NO2", "PM10kont", "PM25kont"];
  mean = "TMW";
  days = 0;
  loading = false;
  title = "Tagesdurchschnitt";

  constructor(private measurementService: MeasurementService, private stationsService: StationsService) {
    this.stations = this.stationsService.getStations();
  }

  ngOnInit(): void {
    this.update();
  }

  onChangePolluter(event: any) {
    this.station.measurand = event.target.value;
    this.update()
  }

  onChangeStation(event: any) {
    this.station.stationId = event.target.value;
    this.selectedStation = this.station.stationId;
    this.update()
  }

  onHandlePeriod(days: number, mean: string) {
    this.days = days;
    this.mean = mean;
    this.update();
  }

  update() {
    this.loading = true;

    switch (this.days) {
      case 0:
        this.title = "Aktueller Wert"
        break;
      case 1:
        this.title = "Tagesdurchschnitt"
        break;
      case 7:
        this.title = "Wochendurchschnitt"
        break;
      case 31:
        this.title = "Monatsdurchschnitt"
        break;
    }

    this.measurementService.getData(createUrls(this.days, this.station.stationId, this.station.measurand, false), this.mean).pipe(
      take(1)
    ).subscribe({
      next: (measurements) => {
        this.loading = false;
        this.station = this.measurementService.getDataStation(measurements);
      },
      error: (error: any) => {
        throw error;
      },
      complete: () => {
        // writeStationsData(station, component, tmpMeasurements[0]);
        // writeMeanData(station, component, mittelwert);

        console.log("COMPLETED");
      }
    });

  }
}
