import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { Point } from '../../model/point.model';
import { Trail } from '../../model/trail.model';
import { CoordService } from '../util/coord.service';
import { PointerEvent } from '../../model/pointer-event.model';

@Injectable({
  providedIn: 'root'
})
export class DrawService {
  constructor(private memory: MemoryService, private coord: CoordService) {}

  registerOnMouseDown(): void {
    const trailList: Trail[] = this.memory.trailList;

    for (let i = 0; i < trailList.length; i++) {
      const t: Trail = trailList[i];
      t.min.prevOffsetX = t.min.newOffsetX;
      t.min.prevOffsetY = t.min.newOffsetY;
      t.max.prevOffsetX = t.max.newOffsetX;
      t.max.prevOffsetY = t.max.newOffsetY;

      for (let j = 0; j < t.points.length; j++) {
        const p: Point = t.points[j];
        p.offsets.prevOffsetX = p.offsets.newOffsetX;
        p.offsets.prevOffsetY = p.offsets.newOffsetY;
      }
    }
  }

  registerOnNoMouseDown($event: PointerEvent): void {
    this.updateOffsets(0, 0, $event);
  }

  registerOnMouseMiddleMove($newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {
    this.updateOffsets($newOffsetX, $newOffsetY, $event);
  }

  updateOffsets($newOffsetX: number, $newOffsetY: number, $event?: PointerEvent): void {
    const trailList: Trail[] = this.memory.trailList;

    for (let i = 0; i < trailList.length; i++) {
      const t: Trail = trailList[i];
      this.coord.updateOffsets($newOffsetX, $newOffsetY, t.min, $event);
      this.coord.updateOffsets($newOffsetX, $newOffsetY, t.max, $event);

      for (let j = 0; j < t.points.length; j++) {
        const p: Point = t.points[j];
        this.coord.updateOffsets($newOffsetX, $newOffsetY, p.offsets, $event);
      }
    }
  }

  activate(): void {
    this.memory.reservedByFunc = {
      name: 'draw',
      type: 'oekaki',
      flgs: ['']
    };
  }

  recordTrail(): void {
    const trailId: number = this.memory.trailList.length > 0 ? this.memory.trailList.length - 1 : 0;
    const trail: Trail = this.memory.trailList[trailId];
    const point: Point = {
      id: trail.points.length,
      color: 'white',
      style: 'circle',
      visibility: true,
      offsets: {
        prevOffsetX: this.memory.mousePos.x,
        prevOffsetY: this.memory.mousePos.y,
        newOffsetX: this.memory.mousePos.x,
        newOffsetY: this.memory.mousePos.y
      },
      pressure: 1
    };

    if (this._ignoreDuplication(point.offsets.prevOffsetX, point.offsets.prevOffsetY)) {
      this._validateMinMax(trail, point.offsets.newOffsetX, point.offsets.newOffsetY);
      trail.points.push(point);
    }
  }

  _validateMinMax($trail: Trail, $x: number, $y: number): void {
    $trail.min.newOffsetX = Math.min($trail.min.newOffsetX, $x);
    $trail.min.newOffsetY = Math.min($trail.min.newOffsetY, $y);

    $trail.max.newOffsetX = Math.max($trail.max.newOffsetX, $x);
    $trail.max.newOffsetY = Math.max($trail.max.newOffsetY, $y);
  }

  _ignoreDuplication($x: number, $y: number): boolean {
    const trailId: number = this.memory.trailList.length > 0 ? this.memory.trailList.length - 1 : 0;
    const trail: Trail = this.memory.trailList[trailId];
    const points: Point[] = trail.points;

    if (points.length > 1) {
      const pointId: number = points.length - 1;
      const prevPoint: Point = points[pointId - 1];

      if (prevPoint.offsets.newOffsetX === $x && prevPoint.offsets.newOffsetY === $y) {
        return false;
      }
    }

    return true;
  }

  render(): void {
    const ctxOekakiBuffer: CanvasRenderingContext2D = this.memory.renderer.ctx.oekakiBuffer;
    const c: HTMLCanvasElement = ctxOekakiBuffer.canvas;
    c.width = this.memory.renderer.wrapper.clientWidth;
    c.height = this.memory.renderer.wrapper.clientHeight;

    const trailList: Trail[] = this.memory.trailList;

    ctxOekakiBuffer.translate(0.5, 0.5);

    ctxOekakiBuffer.beginPath();
    ctxOekakiBuffer.strokeStyle = this.memory.constant.STROKE_STYLE;
    ctxOekakiBuffer.lineWidth = this.memory.constant.LINE_WIDTH * this.memory.canvasOffsets.zoomRatio;

    for (let i = 0; i < trailList.length; i++) {
      const p0: Point = trailList[i].points[0];
      ctxOekakiBuffer.moveTo(p0.offsets.newOffsetX, p0.offsets.newOffsetY);

      for (let j = 1; j < trailList[i].points.length; j++) {
        const p: Point = trailList[i].points[j];
        ctxOekakiBuffer.lineTo(p.offsets.newOffsetX, p.offsets.newOffsetY);
      }
    }

    ctxOekakiBuffer.stroke();
  }
}
