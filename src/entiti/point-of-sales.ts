import { Address } from './address';
import { Group } from './group';

export interface PointOfSale {
  id: string;
  ownerId: string;
  groupId: string;
  routeId?: string;
  label: string;
  contactName: string;
  address: Address;
  primaryPhoneNumber: string;
  secondaryPhoneNumber?: string;
  rent?: string;
  isPercentage?: boolean;
  group: Group;
}
