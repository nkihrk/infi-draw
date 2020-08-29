import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { CursorService } from '../core/cursor.service';

@Injectable({
	providedIn: 'root'
})
export class UiService {
	constructor(private memory: MemoryService, private cursor: CursorService) {}

	render(): void {
		const ctxUiBuffer: CanvasRenderingContext2D = this.memory.renderer.ctx.uiBuffer;
		const c: HTMLCanvasElement = ctxUiBuffer.canvas;
		c.width = this.memory.renderer.canvasWrapper.clientWidth;
		c.height = this.memory.renderer.canvasWrapper.clientHeight;

		// Render cursor
		this.cursor.render(ctxUiBuffer);
	}
}
