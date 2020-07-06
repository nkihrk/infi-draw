import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { Point } from '../../model/point.model';
import { Trail } from '../../model/trail.model';

@Injectable({
  providedIn: 'root'
})
export class DrawService {
  constructor(private memory: MemoryService) {}

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
      x: this.memory.mousePos.x,
      y: this.memory.mousePos.y,
      pressure: 1
    };

    if (this._ignoreDuplication(point.x, point.y)) {
      trail.points.push(point);
    }
  }

  _ignoreDuplication($x: number, $y: number): boolean {
    const trailId: number = this.memory.trailList.length > 0 ? this.memory.trailList.length - 1 : 0;
    const trail: Trail = this.memory.trailList[trailId];
    const points: Point[] = trail.points;

    if (points.length > 1) {
      const pointId: number = points.length - 1;
      const prevPoint: Point = points[pointId - 1];

      if (prevPoint.x === $x && prevPoint.y === $y) {
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
    ctxOekakiBuffer.strokeStyle = 'ffffff';
    ctxOekakiBuffer.lineWidth = 1;

    for (let i = 0; i < trailList.length; i++) {
      const p0: Point = trailList[i].points[0];
      ctxOekakiBuffer.moveTo(p0.x, p0.y);

      for (let j = 1; j < trailList[i].points.length; j++) {
        const p: Point = trailList[i].points[j];
        ctxOekakiBuffer.lineTo(p.x, p.y);
      }
    }

    ctxOekakiBuffer.stroke();
  }
}
