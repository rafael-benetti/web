import { ChartData } from './machine-info';
import { PointOfSale } from './point-of-sales';

export interface DashboardData {
  chartData1: ChartData[];
  chartData2: {
    cashIncome: 2186;
    coinIncome: 0;
    creditCardIncome: 0;
    others: 0;
  };
  givenPrizesCount: number;
  income: number;
  machinesNeverConnected: number;
  machinesSortedByLastCollection: {
    id: string;
    serialNumber: string;
    pointOfSale: PointOfSale;
    lastConnection: Date;
    lastCollection: Date;
  }[];
  machinesSortedByLastConnection: {
    id: string;
    serialNumber: string;
    pointOfSale: PointOfSale;
    lastCollection: Date;
    lastConnection: Date;
  }[];
  machinesSortedByStock: {
    id: string;
    groupId: string;
    lastConnection: Date;
    minimumPrizeCount: number;
    serialNumber: string;
    total: number;
  }[];
  machinesWithoutTelemetryBoard: number;
  offlineMachines: number;
  onlineMachines: number;
}
