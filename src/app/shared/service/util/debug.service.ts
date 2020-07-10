import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';

@Injectable({
  providedIn: 'root'
})
export class DebugService {
  private queueList: Function[] = [];

  constructor(private memory: MemoryService) {}

  setToQueue($callback: Function): void {
    this.queueList.push($callback);
  }

  render(): void {
    const ctxDebugger: CanvasRenderingContext2D = this.memory.renderer.ctx.debugger;
    const c: HTMLCanvasElement = ctxDebugger.canvas;
    c.width = this.memory.renderer.canvasWrapper.clientWidth;
    c.height = this.memory.renderer.canvasWrapper.clientHeight;

    ctxDebugger.translate(0.5, 0.5);

    for (let i = 0; i < this.queueList.length; i++) {
      this.queueList[i](ctxDebugger, this.memory);
    }
  }
}
