import { Trail } from '../model/trail.model';
import { CanvasOffsets } from './canvas-offsets.model';

export interface History {
  trailLists: Trail[];
  canvasOffsets: CanvasOffsets;
  isChangedStates: boolean;
}
