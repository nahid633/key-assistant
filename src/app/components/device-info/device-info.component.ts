import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {BatchDuplicationPhaseEnum, KeyReplacementPhaseEnum} from "../../models/phases.enum";
import {AsyncPipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {Observable} from "rxjs";
import {Device} from "../../models/device.model";
import {Programmer} from "../../models/programmer.model";
import {KeyManagementService} from "../../services/key-management.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-device-info',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCardModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './device-info.component.html',
  styleUrl: './device-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceInfoComponent {
  private readonly keyManagementService = inject(KeyManagementService)
  protected readonly replacementPhases = KeyReplacementPhaseEnum;
  protected readonly duplicationPhases = BatchDuplicationPhaseEnum;
  protected readonly devices$: Observable<Device[]> = this.keyManagementService.getDevices();
  protected readonly programmers$: Observable<Programmer[]> = this.keyManagementService.getProgrammers();
  @Input() currentPhase!: KeyReplacementPhaseEnum | BatchDuplicationPhaseEnum;
  @Input() selectedDevice!: Device | null;
  @Input() selectedProgrammer!: Programmer | null;
  @Output() selectedDeviceChange: EventEmitter<Device> = new EventEmitter<Device>();
  @Output() selectedProgrammerChange: EventEmitter<Programmer> = new EventEmitter<Programmer>();

  onDeviceChange(selectedDevice: Device){
    this.selectedDeviceChange.emit(selectedDevice);
  }

  onProgrammerChange(selectedProgrammer: Programmer){
    this.selectedProgrammerChange.emit(selectedProgrammer);
  }
}
