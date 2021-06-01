import { Group } from './group';
import { MachineInfo, ChartData } from './machine-info';
import { PointOfSale } from './point-of-sales';
import { Route } from './route';

export interface PointOfSaleInfo {
  chartData: ChartData[];
  givenPrizesCount: number;
  income: number;
  machinesInfo: MachineInfo[];
  pointOfSale: PointOfSale;
  route?: Route;
  group?: Group;
}
