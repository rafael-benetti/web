import { Box } from './Box';

export interface Category {
  id: string;
  ownerId: string;
  label: string;
  boxes: Box[];
}
