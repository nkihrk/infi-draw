import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { CursorService } from '../core/cursor.service';

// Ui module
import { SelectUiService } from '../module/select.ui.service';

@Injectable({
	providedIn: 'root'
})
export class UiService {
	constructor(private memory: MemoryService, private cursor: CursorService, private selectUi: SelectUiService) {}

	render(): void {
		const ctxUiBuffer: CanvasRenderingContext2D = this.memory.renderer.ctx.uiBuffer;
		const c: HTMLCanvasElement = ctxUiBuffer.canvas;
		c.width = this.memory.renderer.canvasWrapper.clientWidth;
		c.height = this.memory.renderer.canvasWrapper.clientHeight;

		// To pixelize correctly
		ctxUiBuffer.translate(0.5, 0.5);

		// GUI for select
		this.selectUi.render(ctxUiBuffer);

		// Render cursor
		this.cursor.render(ctxUiBuffer);
	}
}
