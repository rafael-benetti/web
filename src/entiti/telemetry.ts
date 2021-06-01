import { Machine } from './machine';

export interface Telemetry {
  id: string;
  ownerId: string;
  groupId: string;
  machineId: string;
  lastConnection: string;
  connectionStrength: string;
  connectionType: string;
  machine?: Machine;
}
