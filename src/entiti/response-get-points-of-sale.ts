import { PointOfSale } from './point-of-sales';

export interface ResponseGetPointsOfSale {
  count: number;
  pointsOfSale: PointOfSale[];
}
