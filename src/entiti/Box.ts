import { Counter } from './counter';
import { Prize } from './prize';

export interface Box {
  id?: string;
  prizes?: Prize[];
  counters: Counter[];
  currentMoney?: number;
  nuberOfPrizes?: number;
}
