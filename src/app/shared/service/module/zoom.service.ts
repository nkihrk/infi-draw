import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { CoordService } from '../util/coord.service';
import { CanvasService } from '../core/canvas.service';
import { DrawService } from '../module/draw.service';

@Injectable({
	providedIn: 'root'
})
export class ZoomService {
	private prevX = 0;
	private prevY = 0;

	constructor(
		private memory: MemoryService,
		private coord: CoordService,
		private canvas: CanvasService,
		private draw: DrawService
	) {}

	activate($toggleFlg: boolean): void {
		if ($toggleFlg) {
			this.memory.reservedByFunc.current = {
				name: 'zoom',
				type: '',
				group: ''
			};
		} else {
			this.memory.reservedByFunc.current = this.memory.reservedByFunc.prev;
		}
	}

	updateOffsets(): void {
		const x: number = this.memory.pointerOffset.prev.x;
		const y: number = this.memory.pointerOffset.prev.y;
		const diffX: number = this.memory.pointerOffset.current.x - this.memory.pointerOffset.tmp.x;
		const diffY: number = this.memory.pointerOffset.current.y - this.memory.pointerOffset.tmp.y;

		if (Math.abs(diffX) <= Math.abs(diffY)) return;

		if (diffX > 0) {
			// Set for cursor
			this.memory.states.isZoomCursorPositive = true;

			this.canvas.updateOffsetByZoom(x, y, false);
			this.draw.updateOffsetsByZoom(x, y, false);
		} else {
			// Set for cursor
			this.memory.states.isZoomCursorPositive = false;

			this.canvas.updateOffsetByZoom(x, y, true);
			this.draw.updateOffsetsByZoom(x, y, true);
		}
	}
}
