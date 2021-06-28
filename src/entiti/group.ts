import { Stock } from './stock';

export interface Group {
  id: string;
  ownerId: string;
  label: string;
  isPersonal?: boolean;
  stock: Stock;
  numberOfMachines?: number;
}
