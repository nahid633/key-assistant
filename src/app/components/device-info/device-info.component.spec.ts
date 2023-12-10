import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceInfoComponent } from './device-info.component';
import {AsyncPipe, CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {KeyManagementService} from "../../services/key-management.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('DeviceInfoComponent', () => {
  let component: DeviceInfoComponent;
  let fixture: ComponentFixture<DeviceInfoComponent>;
  let keyManagementServiceMock;

  beforeEach(async () => {
    keyManagementServiceMock = jasmine.createSpyObj('KeyManagementService', ['getDevices', 'getProgrammers']);
    await TestBed.configureTestingModule({
      imports: [
        DeviceInfoComponent,
        AsyncPipe,
        MatCardModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: KeyManagementService, useValue: keyManagementServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
