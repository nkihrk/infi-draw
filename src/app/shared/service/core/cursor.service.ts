import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';

@Injectable({
  providedIn: 'root'
})
export class CursorService {
  constructor(private memory: MemoryService) {}

  render(): void {
    const ctxUiBuffer: CanvasRenderingContext2D = this.memory.renderer.ctx.uiBuffer;
    const c: HTMLCanvasElement = ctxUiBuffer.canvas;
    c.width = this.memory.renderer.wrapper.clientWidth;
    c.height = this.memory.renderer.wrapper.clientHeight;

    ctxUiBuffer.translate(0.5, 0.5);

    ctxUiBuffer.beginPath();
    ctxUiBuffer.strokeStyle = this.memory.constant.STROKE_STYLE;
    ctxUiBuffer.lineWidth = 1;

    const x: number = this.memory.mouseOffset.x;
    const y: number = this.memory.mouseOffset.y;
    const r: number = (this.memory.constant.LINE_WIDTH * this.memory.canvasOffset.zoomRatio) / 2;
    ctxUiBuffer.arc(x, y, r, 0, 2 * Math.PI);

    ctxUiBuffer.stroke();
  }
}
