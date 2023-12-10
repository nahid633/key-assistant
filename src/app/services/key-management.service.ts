import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {delay, map, Observable, of, Subject, switchMap, takeUntil, throwError} from "rxjs";
import {Device} from "../models/device.model";
import {Programmer} from "../models/programmer.model";
import {DeviceStatus} from "../models/device-status.enum";

@Injectable({
  providedIn: 'root'
})
export class KeyManagementService {
  private httpClient = inject(HttpClient)
  private readonly apiUrl = 'api/';
  private cancelSubject = new Subject<void>();

  getDevices(): Observable<Device[]> {
    return this.httpClient.get<Device[]>(`${this.apiUrl}devices`)
      .pipe(map(devices => devices.filter(d => d.status === DeviceStatus.ACTIVE)));
  }

  getProgrammers(): Observable<Programmer[]> {
    return this.httpClient.get<Programmer[]>(`${this.apiUrl}programmers`);
  }

  invalidateDevice(device: Device) {
    const updatedDevice = {...device, status: DeviceStatus.INVALID};
    return of(null)
      .pipe(
        delay(3000), // 3s delay from task requirements
        takeUntil(this.cancelSubject.pipe(
          switchMap(() => throwError(() => new Error()))
        )),
        switchMap(() => this.httpClient.put<boolean>(`${this.apiUrl}devices/${updatedDevice.id}`, updatedDevice)
          .pipe(switchMap(() => of(true))) // in memory server doesn't return response therefore I'm setting this as true
        )
      )
  }

  duplicateDevice(device: Device) {
    const newDevice = {...device, status: DeviceStatus.ACTIVE, id: null};
    return of(null)
      .pipe(
        delay(5000), //5s delay
        takeUntil(this.cancelSubject.pipe(
          switchMap(() => throwError(() => new Error()))
        )),
        switchMap(() => this.httpClient.post<boolean>(`${this.apiUrl}devices`, newDevice)
          .pipe(switchMap(() => of(true))) // in memory server doesn't return response therefore I'm setting this as true
        )
      )
  }

  cancelOperation() {
    this.cancelSubject.next();
  }
}
