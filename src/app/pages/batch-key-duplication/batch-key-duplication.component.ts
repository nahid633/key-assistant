import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {DeviceInfoComponent} from "../../components/device-info/device-info.component";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StepComponent} from "../../components/step/step.component";
import {KeyManagementService} from "../../services/key-management.service";
import {BehaviorSubject} from "rxjs";
import {Device} from "../../models/device.model";
import {Programmer} from "../../models/programmer.model";
import {BatchDuplicationPhaseEnum} from "../../models/phases.enum";
import { untilDestroyed } from '../../utils/until-destroyed';

@Component({
  selector: 'app-batch-key-duplication',
  standalone: true,
  imports: [
    DeviceInfoComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    StepComponent,
    FormsModule
  ],
  templateUrl: './batch-key-duplication.component.html',
  styleUrl: './batch-key-duplication.component.scss'
})
export class BatchKeyDuplicationComponent {
  private keyManagementService = inject(KeyManagementService)
  private cdf = inject(ChangeDetectorRef)
  private untilDestroyed = untilDestroyed();
  selectedDeviceSubject: BehaviorSubject<Device | null> = new BehaviorSubject<Device | null>(null);
  selectedProgrammerSubject: BehaviorSubject<Programmer | null> = new BehaviorSubject<Programmer | null>(null);
  selectedAmountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  newDeviceNameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentPhaseSubject: BehaviorSubject<BatchDuplicationPhaseEnum> = new BehaviorSubject<BatchDuplicationPhaseEnum>(BatchDuplicationPhaseEnum.SELECT);
  duplicationPhases = BatchDuplicationPhaseEnum;
  currentIndex = 0;
  createdDeviceNames: string[] = [];

  set newDeviceName(name: string) {
    this.newDeviceNameSubject.next(name);
  }

  get newDeviceName() {
    return this.newDeviceNameSubject.value;
  }

  set selectedAmount(amount: number) {
    this.selectedAmountSubject.next(amount);
  }

  get selectedAmount() {
    return this.selectedAmountSubject.value;
  }

  set currentPhase(phase: BatchDuplicationPhaseEnum) {
    this.currentPhaseSubject.next(phase);
  }

  get currentPhase(): BatchDuplicationPhaseEnum {
    return this.currentPhaseSubject.value;
  }

  set selectedProgrammer(programmer: Programmer) {
    this.selectedProgrammerSubject.next(programmer);
  }

  get selectedProgrammer(): Programmer | null {
    return this.selectedProgrammerSubject.value;
  }

  set selectedDevice(device: Device) {
    this.selectedDeviceSubject.next(device);
  }

  get selectedDevice(): Device | null {
    return this.selectedDeviceSubject.value;
  }

  onSelectDevice() {
    this.currentPhase = this.duplicationPhases.DUPLICATION;
  }

  onDuplicateDevice() {
    if (!this.selectedDevice && !this.newDeviceName) {
      return;
    }
    this.currentPhaseSubject.next(this.duplicationPhases.PROGRAMMING);
    const newDevice = {...this.selectedDevice, name: this.newDeviceName} as Device;
    this.keyManagementService.duplicateDevice(newDevice)
      .pipe(this.untilDestroyed())
      .subscribe(
        {
          next: () => {
            this.createdDeviceNames.push(this.newDeviceName);
            if (this.currentIndex === this.selectedAmount - 1) {
              this.currentPhaseSubject.next(this.duplicationPhases.RESULT);
            } else {
              this.currentPhaseSubject.next(this.duplicationPhases.DUPLICATION);
            }
            this.currentIndex++;
          },
          error: () => {
            this.reset();
          },
          complete: () => {
            this.cdf.markForCheck();
            this.newDeviceName = ''
          }
        })
  }

  onCancel() {
    this.keyManagementService.cancelOperation();
  }

  private reset(){
    this.currentPhaseSubject.next(this.duplicationPhases.SELECT);
    this.selectedDeviceSubject.next(null);
    this.selectedProgrammerSubject.next(null);
    this.currentIndex = 0;
    this.createdDeviceNames = [];
  }
}
