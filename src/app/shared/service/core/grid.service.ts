import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { CanvasOffset } from '../../model/canvas-offset.model';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  private gridScale = 50; // It is important to set the same value as rulerScale
  private gridColor = '#373543';

  constructor(private memory: MemoryService) {}

  // Create grid on canvas
  render(): void {
    // Initialize grid buffer
    const ctxGridBuffer: CanvasRenderingContext2D = this.memory.renderer.ctx.gridBuffer;
    const c: HTMLCanvasElement = ctxGridBuffer.canvas;
    c.width = this.memory.renderer.canvasWrapper.clientWidth;
    c.height = this.memory.renderer.canvasWrapper.clientHeight;

    const canvasOffset: CanvasOffset = this.memory.canvasOffset;

    // X-axis
    const offsetX: number = canvasOffset.newOffsetX - 1; // -1 is prefix for a border width of main canvas
    const remainX: number = Math.floor(offsetX / (this.gridScale * canvasOffset.zoomRatio));
    const cutoffX: number = offsetX - remainX * this.gridScale * canvasOffset.zoomRatio;

    // Y-axis
    const offsetY: number = canvasOffset.newOffsetY - 1; // -1 is prefix for a border width of main canvas
    const remainY: number = Math.floor(offsetY / (this.gridScale * canvasOffset.zoomRatio));
    const cutoffY: number = offsetY - remainY * this.gridScale * canvasOffset.zoomRatio;

    // console.log(cutoffX, cutoffY);

    ctxGridBuffer.translate(0.5, 0.5);

    // Start rendering
    ctxGridBuffer.beginPath();
    ctxGridBuffer.strokeStyle = this.gridColor;
    ctxGridBuffer.lineWidth = 1;

    // X-axis positive
    for (let i = cutoffX; i < c.width; i += this.gridScale * canvasOffset.zoomRatio) {
      ctxGridBuffer.moveTo(i, 0);
      ctxGridBuffer.lineTo(i, c.height);
    }
    // X-axis negative
    for (let i = cutoffX; i > 0; i -= this.gridScale * canvasOffset.zoomRatio) {
      ctxGridBuffer.moveTo(i, 0);
      ctxGridBuffer.lineTo(i, c.height);
    }

    // Y-axis positive
    for (let i = cutoffY; i < c.height; i += this.gridScale * canvasOffset.zoomRatio) {
      ctxGridBuffer.moveTo(0, i);
      ctxGridBuffer.lineTo(c.width, i);
    }
    // Y-axis negative
    for (let i = cutoffY; i > 0; i -= this.gridScale * canvasOffset.zoomRatio) {
      ctxGridBuffer.moveTo(0, i);
      ctxGridBuffer.lineTo(c.width, i);
    }

    // End rendering
    ctxGridBuffer.stroke();
  }
}
