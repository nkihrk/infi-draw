import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { Trail } from '../../model/trail.model';
import { DebugService } from '../util/debug.service';
import { Offset } from '../../model/offset.model';
import { MouseOffset } from '../../model/mouse-offset.model';

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

  checkVisibility(): void {
    const trailList: Trail[] = this.memory.trailList;

    for (let i = 0; i < trailList.length; i++) {
      const min: Offset = trailList[i].min;
      const max: Offset = trailList[i].max;

      const mouseOffset: MouseOffset = this.memory.mouseOffset;
    }
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
