import {TestBed} from '@angular/core/testing';

import {KeyManagementService} from './key-management.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Device} from "../models/device.model";
import {DeviceStatus} from "../models/device-status.enum";
import {Programmer} from "../models/programmer.model";

describe('KeyManagementService', () => {
  let service: KeyManagementService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(KeyManagementService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify(); // Verify that no unmatched requests are outstanding.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve active devices', () => {
    const mockDevices: Device[] = [
      {
        id: 1,
        name: 'Device 1',
        location: 'Munich, Germany',
        accessTimes: [],
        type: 'Lock',
        status: DeviceStatus.ACTIVE
      },
      {
        id: 2,
        name: 'Device 2',
        location: 'Munich, Germany',
        accessTimes: [],
        type: 'Lock',
        status: DeviceStatus.INVALID
      }
    ];

    service.getDevices().subscribe(devices => {
      expect(devices.length).toBe(1);
      expect(devices[0].status).toBe(DeviceStatus.ACTIVE);
    });

    const req = httpTestingController.expectOne('api/devices');
    expect(req.request.method).toBe('GET');
    req.flush(mockDevices);
  });

  it('should retrieve all programmers', () => {
    const mockProgrammers: Programmer[] = [{ id: 1, name: 'Programmer 1' }];

    service.getProgrammers().subscribe(programmers => {
      expect(programmers.length).toBe(1);
    });

    const req = httpTestingController.expectOne('api/programmers');
    expect(req.request.method).toBe('GET');
    req.flush(mockProgrammers);
  });
  it('should invalidate a device', (done) => {
    const mockDevice: Device = {
        id: 1,
        name: 'Device 1',
        location: 'Munich, Germany',
        accessTimes: [],
        type: 'Lock',
        status: DeviceStatus.INVALID
      };

    service.invalidateDevice(mockDevice).subscribe(result => {
      expect(result).toBe(true);
      done();
    });

    setTimeout(() => {
      const req = httpTestingController.expectOne(`api/devices/${mockDevice.id}`);
      expect(req.request.method).toBe('PUT');
      req.flush({});
    }, 3000);
  });

  it('should duplicate a device', (done) => {
    const mockDevice: Device = {
      id: 4,
      name: 'Device 4',
      location: 'Munich, Germany',
      accessTimes: [],
      type: 'Lock',
      status: DeviceStatus.ACTIVE
    };

    service.duplicateDevice(mockDevice).subscribe(result => {
      expect(result).toBe(true);
      done();
    });

    setTimeout(() => {
      const req = httpTestingController.expectOne('api/devices');
      expect(req.request.method).toBe('POST');
      req.flush({});
    }, 5000);
  });
});
