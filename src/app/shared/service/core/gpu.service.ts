import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';

@Injectable({
  providedIn: 'root'
})
export class GpuService {
  constructor(private memory: MemoryService) {}

  render(): void {
    //////////////////////////////////////////////////////////
    //
    // Render result
    //
    //////////////////////////////////////////////////////////

    const ctx: CanvasRenderingContext2D = this.memory.renderer.ctx.main;
    const c: HTMLCanvasElement = ctx.canvas;
    c.width = this.memory.renderer.wrapper.clientWidth;
    c.height = this.memory.renderer.wrapper.clientHeight;
    ctx.drawImage(this.memory.renderer.gridBuffer, 0, 0);
  }
}
