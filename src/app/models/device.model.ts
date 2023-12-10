import {DeviceStatus} from "./device-status.enum";

export interface Device {
  id: number;
  name: string;
  location: string;
  accessTimes: string[];
  type: string;
  status?: DeviceStatus;
}
