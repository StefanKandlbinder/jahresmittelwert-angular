import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CardService {

  // Observable string sources
  private measurand = new Subject<string>();

  // Observable string streams
  measurand$ = this.measurand.asObservable();

  // Service message commands
  setMeasurand(mission: string) {
    this.measurand.next(mission);
  }
}
