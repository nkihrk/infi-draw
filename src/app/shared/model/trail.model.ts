import { Point } from './point.model';
import { Offset } from './offset.model';

export interface Trail {
  id: number;
  min: Offset;
  max: Offset;
  points: Point[];
}
