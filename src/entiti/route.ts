import { User } from './user';

export interface Route {
  id: string;
  label: string;
  pointsOfSaleIds: string[];
  operatorId?: string;
  groupIds?: string[];
  operator?: User;
}
