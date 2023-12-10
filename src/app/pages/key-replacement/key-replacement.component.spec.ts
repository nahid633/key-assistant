import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyReplacementComponent } from './key-replacement.component';
import {KeyManagementService} from "../../services/key-management.service";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FormsModule} from "@angular/forms";
import {DeviceInfoComponent} from "../../components/device-info/device-info.component";
import {StepComponent} from "../../components/step/step.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('KeyReplacementComponent', () => {
  let component: KeyReplacementComponent;
  let fixture: ComponentFixture<KeyReplacementComponent>;
  let keyManagementServiceMock;

  beforeEach(async () => {
    keyManagementServiceMock = jasmine.createSpyObj('KeyManagementService', ['getDevices','getProgrammers', 'duplicateDevice', 'cancelOperation']);
    await TestBed.configureTestingModule({
      imports: [KeyReplacementComponent,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatButtonModule,
        MatProgressBarModule,
        FormsModule,
        DeviceInfoComponent,
        StepComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: KeyManagementService, useValue: keyManagementServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
