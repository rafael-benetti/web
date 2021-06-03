import { Group } from './group';
import { Machine } from './machine';
import { PointOfSale } from './point-of-sales';
import { User } from './user';

export interface CounterCollecion {
  counterId: string;
  mechanicalCount: number;
  digitalCount: number;
  telemetryCount: number;
  userCount: number;
  counterTypeLabel: string;
  photos: { key: string; downloadUrl: string }[];
}

export interface BoxColection {
  boxId: string;
  prizeCount?: number;
  counterCollections: CounterCollecion[];
}

export interface Collection {
  id: string;
  previousCollectionId?: string;
  previousCollection?: Collection;
  machineId: string;
  machine: Machine;
  groupId: string;
  group: Group;
  userId: string;
  user: User;
  pointOfSaleId: string;
  pointOfSale: PointOfSale;
  routeId: string;
  observations: string;
  date: string;
  boxCollections: BoxColection[];
  startTime?: Date;
  reviewedData?: { date: Date; reviewedBy?: string; reviewerName?: string };
  startLocation: { latitude: number; longitude: number };
  endLocation: { latitude: number; longitude: number };
}
