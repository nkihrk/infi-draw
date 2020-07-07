import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { Trail } from '../../model/trail.model';
import { DebugService } from '../util/debug.service';
import { Offset } from '../../model/offset.model';
import { MouseOffset } from '../../model/mouse-offset.model';
import { Point } from '../../model/point.model';

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

      const isInBoundX: boolean = min.newOffsetX < mouseOffset.x && mouseOffset.x < max.newOffsetX;
      const isInBoundY: boolean = min.newOffsetY < mouseOffset.y && mouseOffset.y < max.newOffsetY;

      if (isInBoundX && isInBoundY) validList.push(i);
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
      const r: number = (this.memory.constant.LINE_WIDTH * this.memory.canvasOffset.zoomRatio) / 2;

      const diffX: number = pointX - mouseOffset.x;
      const diffY: number = pointY - mouseOffset.y;
      const distance: number = Math.sqrt(diffX * diffX + diffY * diffY);

      const isCollided: boolean = distance < r;

      if (isCollided) validList.push(i);
    }

    return validList;
  }

  init(): void {
    this.debug.setToQueue(this.test);
  }

  test($ctxDebugger: CanvasRenderingContext2D, $memory: MemoryService): void {
    $ctxDebugger.beginPath();
    $ctxDebugger.strokeStyle = $memory.constant.STROKE_STYLE;
    $ctxDebugger.lineWidth = $memory.constant.LINE_WIDTH;

    const trailList: Trail[] = $memory.trailList;
    for (let i = 0; i < trailList.length; i++) {
      const trail: Trail = trailList[i];
      const x: number = trail.min.newOffsetX;
      const y: number = trail.min.newOffsetY;
      const w: number = trail.max.newOffsetX - x;
      const h: number = trail.max.newOffsetY - y;
      $ctxDebugger.strokeRect(x, y, w, h);
    }

    $ctxDebugger.stroke();
  }
}
