import { BoxColection } from '../entiti/collection';

export interface BaseData {
  machineId: string;
  observations: string;
  boxCollections: BoxColection[];
  photosToDelete?: string[];
  startTime?: Date;
}

interface Files {
  [key: string]: File;
}

export type HandleCollectionDto = BaseData & Files;

export type EditCollecionDto = BaseData;
