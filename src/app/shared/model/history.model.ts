import { Trail } from '../model/trail.model';

export interface History {
  trailList: Trail[];
  isChangedStates: boolean;
}
