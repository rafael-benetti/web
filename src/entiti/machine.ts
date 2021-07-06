import { Box } from './Box';
import { Group } from './group';
import { PointOfSale } from './point-of-sales';
import { Prize } from './prize';
import { User } from './user';

export interface Machine {
  id: string;
  ownerId: string;
  groupId: string;
  group?: Group;
  pointOfSale?: PointOfSale;
  serialNumber: string;
  gameValue: string;
  operator: User;
  operatorId?: string;
  locationId?: string;
  categoryId: string;
  categoryLabel: string;
  telemetryBoardId: string;
  minimumPrizeCount?: string;
  typeOfPrize: Prize;
  boxes?: Box[];
  lastConnection: Date;
  lastCollection?: Date;
  maintenance: boolean;
  incomePerPrizeGoal?: string;
  incomePerMonthGoal?: string;
  givenPrizes?: number;
}
