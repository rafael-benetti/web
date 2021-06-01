import { Box } from '../entiti/Box';

export interface HandleMachineDto {
  groupId: string;
  serialNumber: string;
  gameValue: number;
  operatorId?: string | null;
  locationId?: string | null;
  boxes: Box[];
  categoryId: string;
  telemetryBoardId?: string | null;
  minimumPrizeCount?: number;
  typeOfPrizeId?: string;
  maintenance?: boolean;
  incomePerPrizeGoal?: number;
  incomePerMonthGoal?: number;
}
