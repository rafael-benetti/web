import { Group } from './group';
import { ChartData } from './machine-info';
import { PointOfSale } from './point-of-sales';

export interface GroupInfo {
  chartData1: ChartData[];
  chartData2: { total: number; counterLabel: string }[];
  givenPrizesCount: number;
  group: Group;
  income: number;
  lastPurchaseDate: Date;
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
  pointsOfSaleSortedByIncome: {
    income: number;
    numberOfMachines: number;
    pointOfSale: { id: string; label: string };
  }[];
}
