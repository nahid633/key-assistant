import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BatchKeyDuplicationComponent} from './batch-key-duplication.component';
import {DeviceInfoComponent} from "../../components/device-info/device-info.component";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StepComponent} from "../../components/step/step.component";
import {KeyManagementService} from "../../services/key-management.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('BatchKeyDuplicationComponent', () => {
  let component: BatchKeyDuplicationComponent;
  let fixture: ComponentFixture<BatchKeyDuplicationComponent>;
  let keyManagementServiceMock;

  beforeEach(async () => {
    keyManagementServiceMock = jasmine.createSpyObj('KeyManagementService', ['getDevices', 'getProgrammers', 'duplicateDevice', 'cancelOperation']);

    await TestBed.configureTestingModule({
      imports: [
        BatchKeyDuplicationComponent,
        DeviceInfoComponent,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        StepComponent,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide: KeyManagementService, useValue: keyManagementServiceMock}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BatchKeyDuplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
