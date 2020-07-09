import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { Trail } from '../../model/trail.model';
import { DebugService } from '../util/debug.service';
import { Offset } from '../../model/offset.model';
import { MouseOffset } from '../../model/mouse-offset.model';
import { Point } from '../../model/point.model';
import { Erase } from '../../model/erase.model';

@Injectable({
  providedIn: 'root'
})
export class EraseService {
  constructor(private memory: MemoryService, private debug: DebugService) {}

  activate(): void {
    this.memory.reservedByFunc = {
      name: 'erase',
      type: 'oekaki',
      flgs: ['']
    };
  }

  setVisibility() {
    const trailIndexes: number[] = this._validateTrails();

    for (let i = 0; i < trailIndexes.length; i++) {
      const tId: number = trailIndexes[i];
      const pointIndexes: number[] = this._validatePoints(tId);

      for (let j = 0; j < pointIndexes.length; j++) {
        const pId: number = pointIndexes[j];
        const p: Point = this.memory.trailList[tId].points[pId];

        if (p.visibility) {
          const erase: Erase = this.memory.eraseList[this.memory.eraseList.length - 1];
          if (!erase.trailList[tId]) erase.trailList[tId] = { trailId: -1, pointIdList: [] };
          erase.trailList[tId].trailId = tId;
          erase.trailList[tId].pointIdList.push(pId);
        }

        p.visibility = false;
      }
    }
  }

  _validateTrails(): number[] {
    const validList: number[] = [];

    const trailList: Trail[] = this.memory.trailList;
    for (let i = 0; i < trailList.length; i++) {
      const min: Offset = trailList[i].min;
      const max: Offset = trailList[i].max;
      const mouseOffset: MouseOffset = this.memory.mouseOffset;
      const x: number = min.newOffsetX;
      const y: number = min.newOffsetY;
      const r: number = this.memory.constant.ERASER_LINE_WIDTH;

      // diff
      const diffX0: number = x - mouseOffset.x;
      const diffY0: number = y - mouseOffset.y;
      const diffX1: number = max.newOffsetX - mouseOffset.x;
      const diffY1: number = max.newOffsetY - mouseOffset.y;

      // Corner
      const corner0: boolean = diffX0 < r && diffY0 < r;
      const corner1: boolean = diffX0 < r && diffY1 < r;
      const corner2: boolean = diffX1 < r && diffY0 < r;
      const corner3: boolean = diffX1 < r && diffY1 < r;
      const corner: boolean = corner0 || corner1 || corner2 || corner3;

      // Middle
      const middle0: boolean = min.newOffsetY < mouseOffset.y - r && mouseOffset.y + r < max.newOffsetY;
      const middle1: boolean = min.newOffsetX < mouseOffset.x - r && mouseOffset.x + r < max.newOffsetX;
      const middle: boolean = middle0 && middle1;

      if (corner || middle) validList.push(i);
    }

    return validList;
  }

  _validatePoints($trailId: number): number[] {
    const validList: number[] = [];

    const points: Point[] = this.memory.trailList[$trailId].points;
    for (let i = 0; i < points.length; i++) {
      const pointX: number = points[i].offset.newOffsetX;
      const pointY: number = points[i].offset.newOffsetY;
      const mouseOffset: MouseOffset = this.memory.mouseOffset;
      const r: number = this.memory.constant.ERASER_LINE_WIDTH;

      const diffX: number = pointX - mouseOffset.x;
      const diffY: number = pointY - mouseOffset.y;
      const distance: number = Math.sqrt(diffX * diffX + diffY * diffY);

      const isCollided: boolean = distance < r;

      if (isCollided) validList.push(i);
    }

    return validList;
  }
}
