import { Trail } from '../model/trail.model';
import { CanvasOffsets } from './canvas-offsets.model';

export interface History {
  trailList: Trail[];
  isChangedStates: boolean;
}
