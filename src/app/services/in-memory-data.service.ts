import {InMemoryDbService} from 'angular-in-memory-web-api';
import {Injectable} from "@angular/core";
import {DeviceStatus} from "../models/device-status.enum";

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const devices = [
      {
        id: 1,
        name: 'Device 1',
        location: 'Munich, Germany',
        accessTimes: [],
        type: 'Lock',
        status: DeviceStatus.ACTIVE
      },
    ];
    const programmers = [
      {id: 1, name: 'Smart Stick AX'},
      {id: 2, name: 'Smart CD 2'},
      {id: 3, name: 'Smart CD MP'},
      {id: 4, name: 'Smart CD HF'},
      {id: 5, name: 'CD Starter G2'},
    ];
    return {devices, programmers};
  }
}
