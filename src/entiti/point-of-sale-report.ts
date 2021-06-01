import { Address } from './address';
import { MachineReport } from './machine-report';

export interface PointOfSaleReport {
  address: Address;
  groupLabel: string;
  income: number;
  label: string;
  machineAnalytics: MachineReport[];
  rent: number;
}
