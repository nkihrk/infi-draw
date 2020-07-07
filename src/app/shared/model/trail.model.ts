import { Point } from './point.model';

export interface Trail {
  id: number;
  min: {
    x: number;
    y: number;
  };
  max: {
    x: number;
    y: number;
  };
  points: Point[];
}
