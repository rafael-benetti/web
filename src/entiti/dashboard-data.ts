import { ChartData } from './machine-info';
import { PointOfSale } from './point-of-sales';

export interface DashboardData {
  chartData1: ChartData[];
  chartData2: { total: number; counterLabel: string }[];
  givenPrizesCount: number;
  income: number;
  machinesNeverConnected: number;
  machinesSortedByLastCollection: {
    id: string;
    serialNumber: string;
    pointOfSale: PointOfSale;
    lastConnection: Date;
    lastCollection: Date;
    categoryLabel: string;
  }[];
  machinesSortedByLastConnection: {
    id: string;
    serialNumber: string;
    pointOfSale: PointOfSale;
    lastCollection: Date;
    lastConnection: Date;
    categoryLabel: string;
  }[];
  machinesSortedByStock: {
    id: string;
    groupId: string;
    lastConnection: Date;
    minimumPrizeCount: number;
    serialNumber: string;
    total: number;
    categoryLabel: string;
  }[];
  machinesWithoutTelemetryBoard: number;
  offlineMachines: number;
  onlineMachines: number;
}
