import { Point } from './point.model';

export interface Trail {
  id: number;
  min: {
    prevOffsetX: number;
    prevOffsetY: number;
    newOffsetX: number;
    newOffsetY: number;
  };
  max: {
    prevOffsetX: number;
    prevOffsetY: number;
    newOffsetX: number;
    newOffsetY: number;
  };
  points: Point[];
}
