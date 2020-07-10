import { Offset } from './offset.model';

export interface Point {
  id: number;
  color: string;
  visibility: boolean;
  offset: Offset;
  pressure: number;
}
