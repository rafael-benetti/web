import { Machine } from './machine';
import { MachineLog } from './machine-log';
import { TelemetryLog } from './telemetry-log';

export interface ChartData {
  date: string;
  prizeCount: number;
  income: number;
}

export interface BoxInfo {
  boxId: string;
  currentMoney: number;
  currentPrizeCount: number;
  givenPrizes: number;
}

export interface MachineInfo {
  machine: Machine;
  lastConnection?: Date;
  lastCollection?: Date;
  collectedBy?: string;
  income: number;
  givenPrizes: number;
  chartData: ChartData[];
  boxesInfo: BoxInfo[];
  transactionHistory: TelemetryLog[];
  machineLogs: MachineLog[];
}
