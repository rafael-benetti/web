import { Machine } from './machine';
import { ChartData } from './machine-info';
import { PointOfSale } from './point-of-sales';
import { Route } from './route';

export interface ChartData2 {
  pointOfSaleId: string;
  label: string;
  income: number;
  givenPrizesCount: number;
}

export interface RouteInfo {
  chartData1: ChartData[];
  chartData2: ChartData2[];
  givenPrizesCount: number;
  income: number;
  pointsOfSale: PointOfSale[];
  route: Route;
  machines: Machine[];
}
