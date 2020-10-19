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
		c.width = this.memory.renderer.canvasWrapper.clientWidth;
		c.height = this.memory.renderer.canvasWrapper.clientHeight;
		ctx.drawImage(this.memory.renderer.gridBuffer, 0, 0);
		ctx.drawImage(this.memory.renderer.oekakiBuffer, 0, 0);

		const ctxUi: CanvasRenderingContext2D = this.memory.renderer.ctx.ui;
		const d: HTMLCanvasElement = ctxUi.canvas;
		d.width = this.memory.renderer.canvasWrapper.clientWidth;
		d.height = this.memory.renderer.canvasWrapper.clientHeight;
		ctxUi.drawImage(this.memory.renderer.uiBuffer, 0, 0);
		ctxUi.drawImage(this.memory.renderer.debugger, 0, 0);
	}
}
