import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {KeyManagementService} from "../../services/key-management.service";
import {BehaviorSubject} from "rxjs";
import {Device} from "../../models/device.model";
import {Programmer} from "../../models/programmer.model";
import {FormsModule} from "@angular/forms";
import {KeyReplacementPhaseEnum} from "../../models/phases.enum";
import {DeviceInfoComponent} from "../../components/device-info/device-info.component";
import {StepComponent} from "../../components/step/step.component";
import { untilDestroyed } from '../../utils/until-destroyed';

@Component({
  selector: 'app-key-replacement',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    FormsModule,
    DeviceInfoComponent,
    StepComponent
  ],
  templateUrl: './key-replacement.component.html',
  styleUrl: './key-replacement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyReplacementComponent{
  private keyManagementService = inject(KeyManagementService)
  private cdf = inject(ChangeDetectorRef)
  private untilDestroyed = untilDestroyed();
  selectedDeviceSubject: BehaviorSubject<Device | null> = new BehaviorSubject<Device | null>(null);
  selectedProgrammerSubject: BehaviorSubject<Programmer | null> = new BehaviorSubject<Programmer | null>(null);
  currentPhaseSubject: BehaviorSubject<KeyReplacementPhaseEnum> = new BehaviorSubject<KeyReplacementPhaseEnum>(KeyReplacementPhaseEnum.SELECT);
  replacementPhases = KeyReplacementPhaseEnum;
  get currentPhase(): KeyReplacementPhaseEnum {
    return this.currentPhaseSubject.value;
  }

  set selectedProgrammer(programmer: Programmer){
    this.selectedProgrammerSubject.next(programmer);
  }

  get selectedProgrammer(): Programmer | null{
    return this.selectedProgrammerSubject.value;
  }

  set selectedDevice(device: Device){
    this.selectedDeviceSubject.next(device);
  }

  get selectedDevice(): Device | null {
    return this.selectedDeviceSubject.value;
  }
  onInvalidateDevice(){
    if(!this.selectedDevice){
      return;
    }
    this.currentPhaseSubject.next(this.replacementPhases.INVALIDATION);
    this.keyManagementService.invalidateDevice(this.selectedDevice)
      .pipe(this.untilDestroyed())
      .subscribe(
      {
        next: () => {
          this.currentPhaseSubject.next(this.replacementPhases.DUPLICATION);
        },
        error: () => {
          this.reset();
        },
        complete: () => {
          this.cdf.markForCheck();
        }
      })
  }

  onDuplicateDevice(){
    if(!this.selectedDevice){
      return;
    }
    this.currentPhaseSubject.next(this.replacementPhases.PROGRAMMING);
    this.keyManagementService.duplicateDevice(this.selectedDevice)
      .pipe(this.untilDestroyed())
      .subscribe(
        {
          next: () => {
            this.currentPhaseSubject.next(this.replacementPhases.RESULT);
          },
          error: () => {
          this.reset();
          },
          complete: () => {
            this.cdf.markForCheck();
          }
        })
  }

  onNameChange(name: string){
    if(!this.selectedDevice){
      return;
    }
    this.selectedDevice.name = name;
  }

  onCancel(){
    this.keyManagementService.cancelOperation();
  }

  private reset(){
    this.currentPhaseSubject.next(this.replacementPhases.SELECT);
    this.selectedDeviceSubject.next(null);
    this.selectedProgrammerSubject.next(null);
  }
}
