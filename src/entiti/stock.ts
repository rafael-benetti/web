import { Prize } from './prize';
import { Supply } from './supplies';

export interface Stock {
  prizes: Prize[];
  supplies: Supply[];
}
